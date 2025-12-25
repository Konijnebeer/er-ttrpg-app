import type {
  Contributor,
  Source,
  SourceData,
  SourceMetadata,
} from "@/types/source";
import { create } from "zustand";
import type { Id, Reference, SourceKey, Version } from "@/types/refrence";
import {
  ensureRefrence,
  makeSourceKey,
  parseRefrence,
  parseSourceKey,
} from "@/lib/versioningHelpers";
import {
  getAllSourcesMetadata,
  getSource,
  importSource,
  deleteSource,
} from "@/database/sourceDB";
import { sourceSchema } from "@/types/source";
import { BASE_PATH } from "@/lib/constants";

interface SourceGroup {
  id:       Id;
  versions: Version[];
  metadata: SourceMetadata[];
}

interface GroupedSources {
  Core:  SourceGroup[];
  Extra: SourceGroup[];
}

type SourceDataKey = keyof SourceData;

interface SourceStoreState {
  // State
  /** Map of loaded sources keyed by SourceKey (id@version) */
  sources: Map<SourceKey, Source>;

  /** Loading state for async operations */
  isLoading: boolean;

  /** Error message from last operation */
  error: string | null;

  /** Currently selected/active source key */
  activeSourceKey: SourceKey | null;

  /** Grouped sources by Core/Extra with all versions */
  groupedSources: GroupedSources;

  /** Load all source metadata without full data */
  loadAllSourcesMetadata: () => Promise<void>;

  /** Generic update function for any array in source data */
  updateSourceEntity: <T extends keyof SourceData>(
    sourceKey: SourceKey,
    dataType: T,
    entityId: Id,
    updates: Partial<NonNullable<SourceData[T]>[number]>,
  ) => void;

  /** Generic add function for any array in source data */
  addSourceEntity: <T extends keyof SourceData>(
    sourceKey: SourceKey,
    dataType: T,
    item: NonNullable<SourceData[T]>[number],
  ) => void;

  /** Generic remove function for any array in source data */
  removeSourceEntity: <T extends keyof SourceData>(
    sourceKey: SourceKey,
    dataType: T,
    entityId: Id,
  ) => void;

  /** Update a contributor in a source */
  updateContributor: (
    sourceKey: SourceKey,
    contributorId: Id,
    updates: Partial<Contributor>,
  ) => void;

  /** Add a new contributor to a source */
  addContributor: (sourceKey: SourceKey, contributor: Contributor) => void;

  /** Remove a contributor from a source */
  removeContributor: (sourceKey: SourceKey, contributorId: Id) => void;

  /** Import source from file */
  importSource: (file: File) => Promise<Source>;

  /** Download source from public folder */
  downloadSource: (id: Id, version: Version, filename: string) => Promise<void>;

  /** Delete source from database and store */
  deleteSource: (id: Id, version: Version) => Promise<void>;

  /** Load a specific source by id and version (with caching) */
  loadSource: (id: Id, version: Version) => Promise<Source | null>;

  /**Load sources from an array of sourceKeys */
  loadSources: (sourceKeys: SourceKey[]) => Promise<void>;

  /** Set active source without loading */
  setActiveSource: (sourceKey: SourceKey) => void;

  /** Get active source */
  getActiveSource: () => Source | undefined;

  /** Get a loaded source by SourceKey */
  getSourceByKey: (key: SourceKey) => Source | undefined;

  getSourceDataArray: <T extends SourceDataKey>(
    sourceKey: SourceKey,
    dataType: T,
  ) => NonNullable<SourceData[T]> | null;

  getAllSourcesDataArray: <T extends SourceDataKey>(
    dataType: T,
  ) => NonNullable<SourceData[T]> | null;

  /** Get the object related to a Reference */
  resolveRefrence: <T extends SourceDataKey>(
    refrence: Reference,
    dataType: T,
  ) => NonNullable<SourceData[T]>[number] | null;
}

export const useSourceStore = create<SourceStoreState>((set, get) => ({
  sources:         new Map<SourceKey, Source>(),
  isLoading:       false,
  error:           null,
  activeSourceKey: null,
  groupedSources:  { Core: [], Extra: [] },

  importSource: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const source = await importSource(file);
      set({ isLoading: false });
      return source;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to import source from file:`, error);
      throw error;
    }
  },

  downloadSource: async (id: Id, _version: Version, filename: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch the source from the public folder
      const response = await fetch(`${BASE_PATH}/sources/${id}/${filename}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch source: ${response.statusText}`);
      }

      const text = await response.text();

      // Check if response is HTML (error page)
      if (
        text.trim().startsWith("<!DOCTYPE") ||
        text.trim().startsWith("<html")
      ) {
        throw new Error(`Source file not found at /sources/${id}/${filename}`);
      }

      const jsonData = JSON.parse(text);

      // Validate with schema
      const result = sourceSchema.safeParse(jsonData);
      if (!result.success) {
        throw new Error(`Invalid source format`);
      }

      // Save to database
      await importSource(
        new File([text], filename, { type: "application/json" }),
      );

      set({ isLoading: false });

      // Reload metadata to update UI
      await get().loadAllSourcesMetadata();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to download source:`, error);
      throw error;
    }
  },

  deleteSource: async (id: Id, version: Version) => {
    set({ isLoading: true, error: null });
    try {
      // Delete from database
      await deleteSource(id, version);

      // Remove from store
      const key = makeSourceKey(id, version);
      const sources = new Map(get().sources);
      sources.delete(key);

      // Clear active source if it was deleted
      const activeSourceKey = get().activeSourceKey;
      if (activeSourceKey === key) {
        set({ sources, activeSourceKey: null, isLoading: false });
      } else {
        set({ sources, isLoading: false });
      }

      // Reload metadata to update UI
      await get().loadAllSourcesMetadata();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to delete source:`, error);
      throw error;
    }
  },

  loadSource: async (id: Id, version: Version) => {
    const key = makeSourceKey(id, version);

    // Check cache first - avoid unnecessary DB calls
    const cached = get().sources.get(key);
    if (cached) {
      set({ activeSourceKey: key });
      return cached;
    }

    set({ isLoading: true, error: null });
    try {
      const source = await getSource(id, version);

      if (source) {
        const sources = new Map(get().sources);
        sources.set(key, source);
        set({
          sources,
          isLoading:       false,
          activeSourceKey: key,
        });
        return source;
      }

      set({ error: `Source ${id}@${version} not found`, isLoading: false });
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to load source ${id}@${version}:`, error);
      return null;
    }
  },

  loadSources: async (sourceKeys: SourceKey[]) => {
    // Check which sources aren't already cached
    const uncachedKeys = sourceKeys.filter((key) => !get().sources.has(key));

    if (uncachedKeys.length === 0) {
      return; // All sources already loaded
    }

    set({ isLoading: true, error: null });
    try {
      const loadPromises = uncachedKeys.map(async (sourceKey) => {
        const { id, version } = parseSourceKey(sourceKey);
        const source = await getSource(id, version);
        if (!source) {
          throw new Error(`Failed to load source: ${sourceKey}`);
        }
        return { key: sourceKey, source };
      });

      const results = await Promise.all(loadPromises);

      // Update all sources at once
      const sources = new Map(get().sources);
      results.forEach(({ key, source }) => {
        sources.set(key, source);
      });

      set({ sources, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to load sources:", error);
      throw error;
    }
  },

  loadAllSourcesMetadata: async () => {
    set({ isLoading: true, error: null });
    try {
      const metadata = await getAllSourcesMetadata();

      // Group sources by ID and Core/Extra status
      const grouped: GroupedSources = { Core: [], Extra: [] };
      const sourceMap = new Map<
        Id,
        { isCore: boolean; versions: Version[]; metadata: SourceMetadata[] }
      >();

      // First pass: collect all versions and metadata for each ID
      metadata.forEach((source) => {
        const existing = sourceMap.get(source.id);
        if (existing) {
          existing.versions.push(source.version);
          existing.metadata.push(source);
        } else {
          sourceMap.set(source.id, {
            isCore:   source.sourceInfo.isCore,
            versions: [source.version],
            metadata: [source],
          });
        }
      });

      // Second pass: organize into Core/Extra arrays
      sourceMap.forEach((data, id) => {
        const group: SourceGroup = {
          id,
          versions: data.versions.sort().reverse(), // Sort versions descending
          metadata: data.metadata.sort(
            (a, b) => b.version.localeCompare(a.version), // Sort metadata by version descending
          ),
        };

        if (data.isCore) {
          grouped.Core.push(group);
        } else {
          grouped.Extra.push(group);
        }
      });

      set({
        groupedSources: grouped,
        isLoading:      false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to load sources metadata:", error);
    }
  },

  setActiveSource: (sourceKey: SourceKey) => {
    set({ activeSourceKey: sourceKey });
  },

  getActiveSource: () => {
    const { sources, activeSourceKey } = get();
    return activeSourceKey ? sources.get(activeSourceKey) : undefined;
  },

  getSourceByKey: (key: SourceKey) => {
    return get().sources.get(key);
  },

  updateSourceEntity: (sourceKey, dataType, itemId, updates) => {
    const sources = new Map(get().sources);
    const source = sources.get(sourceKey);

    if (source?.data?.[dataType]) {
      const items = source.data[dataType] as any[];
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      );

      sources.set(sourceKey, {
        ...source,
        data: {
          ...source.data,
          [dataType]: updatedItems,
        },
      });

      set({ sources });
    }
  },

  addSourceEntity: (sourceKey, dataType, item) => {
    const sources = new Map(get().sources);
    const source = sources.get(sourceKey);

    if (source) {
      const existingItems = (source.data?.[dataType] as any[]) || [];

      sources.set(sourceKey, {
        ...source,
        data: {
          ...source.data,
          [dataType]: [...existingItems, item],
        },
      });

      set({ sources });
    }
  },

  removeSourceEntity: (sourceKey, dataType, itemId) => {
    const sources = new Map(get().sources);
    const source = sources.get(sourceKey);

    if (source?.data?.[dataType]) {
      const items = source.data[dataType] as any[];

      sources.set(sourceKey, {
        ...source,
        data: {
          ...source.data,
          [dataType]: items.filter((item) => item.id !== itemId),
        },
      });

      set({ sources });
    }
  },

  updateContributor: (sourceKey, contributorId, updates) => {
    const sources = new Map(get().sources);
    const source = sources.get(sourceKey);

    if (source && source.contributors) {
      const updatedContributors = source.contributors.map((c) =>
        c.name === contributorId ? { ...c, ...updates } : c,
      );

      sources.set(sourceKey, {
        ...source,
        contributors: updatedContributors,
      });

      set({ sources });
    }
  },

  addContributor: (sourceKey, contributor) => {
    const sources = new Map(get().sources);
    const source = sources.get(sourceKey);

    if (source) {
      sources.set(sourceKey, {
        ...source,
        contributors: [...(source.contributors || []), contributor],
      });

      set({ sources });
    }
  },

  removeContributor: (sourceKey, contributorId) => {
    const sources = new Map(get().sources);
    const source = sources.get(sourceKey);

    if (source && source.contributors) {
      sources.set(sourceKey, {
        ...source,
        contributors: source.contributors.filter(
          (c) => c.name !== contributorId,
        ),
      });

      set({ sources });
    }
  },

  getSourceDataArray: <T extends SourceDataKey>(
    sourceKey: SourceKey,
    dataType: T,
  ): NonNullable<SourceData[T]> | null => {
    try {
      const source = get().sources.get(sourceKey);

      if (!source) {
        console.error(`Source not found: ${sourceKey}`);
        return null;
      }
      // Get the data array
      const dataArray = source.data?.[dataType];

      if (!dataArray) {
        console.error(
          `Data type "${dataType}" not found in source: ${sourceKey}`,
        );
        return null;
      }

      // Makes sure that the id now contains the full Refrence
      const fullRefrenceResponse = (dataArray as any[]).map((entity) =>
        Object.assign({}, entity, {
          id: ensureRefrence(sourceKey, entity.id),
        }),
      ) as NonNullable<SourceData[T]>;

      return fullRefrenceResponse;
    } catch (error) {
      console.error(`Failed to parse sourceKey: ${sourceKey}`, error);
      return null;
    }
  },

  getAllSourcesDataArray: <T extends SourceDataKey>(
    dataType: T,
  ): NonNullable<SourceData[T]> | null => {
    // use getSourceDataArray for all loaded sources and combine results
    const sources = get().sources;
    let combinedArray: NonNullable<SourceData[T]> = [];
    sources.forEach((_source, sourceKey) => {
      const dataArray = get().getSourceDataArray(sourceKey, dataType);
      if (dataArray) {
        combinedArray = [...combinedArray, ...dataArray] as NonNullable<
          SourceData[T]
        >;
      }
    });
    return combinedArray.length > 0 ? combinedArray : null;
  },

  resolveRefrence: <T extends SourceDataKey>(
    refrence: Reference,
    dataType: T,
  ): NonNullable<SourceData[T]>[number] | null => {
    try {
      const { sourceKey, id } = parseRefrence(refrence);

      // Get the data array
      const dataArray = get().getSourceDataArray(sourceKey, dataType);

      if (!dataArray) {
        console.error(
          `Data type "${dataType}" not found in source: ${sourceKey}`,
        );
        return null;
      }

      // Find the item by refrence
      const entity = dataArray.find((entity) => entity.id === refrence);

      if (!entity) {
        console.error(
          `Item "${id}" not found in ${dataType} of source: ${sourceKey}`,
        );
        return null;
      }

      return entity;
    } catch (error) {
      console.error(`Failed to parse reference: ${refrence}`, error);
      return null;
    }
  },
}));
