import { openDB, type IDBPDatabase } from "idb";
import {
  sourceSchema,
  type Source,
  type SourceMetadata,
} from "@/types/source";
import type { Id, SourceKey, Version } from "@/types/refrence";
import {
  SOURCE_DB_NAME,
  SOURCE_DB_VERSION,
  SOURCE_STORE_NAME,
} from "@/lib/constants";
import { makeSourceKey } from "@/lib/versioningHelpers";

/**
 * IndexedDB schema definition for the source database.
 * Sources are keyed by composite SourceKey (id@version).
 */
interface SourceDB {
  sources: {
    key: SourceKey;
    value: Source;
    indexes: {
      id: Id;
      version: Version;
      dateModified: number;
      name: string;
    };
  };
}

let dbInstance: IDBPDatabase<SourceDB> | null = null;

/**
 * Initialize and return the source database instance.
 * Creates object store and indexes on first run or version upgrade.
 */
export async function initDB(): Promise<IDBPDatabase<SourceDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<SourceDB>(
      SOURCE_DB_NAME,
      SOURCE_DB_VERSION,
      {
        upgrade(db) {
          // Create sources store if it doesn't exist
          if (!db.objectStoreNames.contains(SOURCE_STORE_NAME)) {
            const store = db.createObjectStore(SOURCE_STORE_NAME);

            // Create indexes for efficient queries
            store.createIndex("id", "id", { unique: false });
            store.createIndex("version", "version", { unique: false });
            store.createIndex("dateModified", "dateModified", {
              unique: false,
            });
            store.createIndex("name", "name", { unique: false });
          }
        },
      }
    );

    return dbInstance;
  } catch (error) {
    throw error;
  }
}

/**
 * Get a specific source by id and version
 * @param id - The source identifier
 * @param version - The source version
 * @returns The source if found, undefined otherwise
 */
export async function getSource(
  id: Id,
  version: Version
): Promise<Source | undefined> {
  try {
    const db = await initDB();
    const sourceKey = makeSourceKey(id, version);
    return db.get(SOURCE_STORE_NAME, sourceKey);
  } catch (error) {
    throw error;
  }
}

/**
 * Get the latest version of a source by id
 * @param id - The source identifier
 * @returns The source with the latest version if found, undefined otherwise
 */
export async function getLatestSourceVersion(
  id: Id
): Promise<Source | undefined> {
  try {
    const db = await initDB();
    const index = db.transaction(SOURCE_STORE_NAME).store.index("id");
    const sources = await index.getAll(id);

    if (sources.length === 0) {
      return undefined;
    }

    // Sort by version to find the latest
    // Version format is semver: "major.minor.patch"
    return sources.sort((a, b) => {
      const [aMajor, aMinor, aPatch] = a.version.split(".").map(Number);
      const [bMajor, bMinor, bPatch] = b.version.split(".").map(Number);

      if (aMajor !== bMajor) return bMajor - aMajor;
      if (aMinor !== bMinor) return bMinor - aMinor;
      return bPatch - aPatch;
    })[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Get metadata for all sources without loading full data. Ordered by dateModified descending.
 * @returns Array of source metadata objects
 */
export async function getAllSourcesMetadata(): Promise<SourceMetadata[]> {
  try {
    const db = await initDB();
    const sources = await db.getAll(SOURCE_STORE_NAME);

    // Strip out data to reduce memory
        return sources
      .map(({ data, ...metadata }) => metadata)
      .sort((a, b) => b.dateModified - a.dateModified);
  } catch (error) {
    throw error;
  }
}

/**
 * Get all sources with a specific id (all versions)
 * @param id - The source identifier
 * @returns Array of sources with the given id
 */
export async function getAllSourceVersions(id: Id): Promise<Source[]> {
  try {
    const db = await initDB();
    const index = db.transaction(SOURCE_STORE_NAME).store.index("id");
    return index.getAll(id);
  } catch (error) {
    throw error;
  }
}

/**
 * Save or update a source in the database.
 * Validates that all dependencies exist before saving.
 *
 * @param source - The source to save
 */
export async function saveSource(source: Source): Promise<void> {
  try {
    const db = await initDB();

    // Todo Validate dependencies exist

    // Update modification timestamp (Unix timestamp in seconds)
    const now = Math.floor(Date.now() / 1000);
    const sourceToSave: Source = {
      ...source,
      dateModified: now,
    };

    const sourceKey = makeSourceKey(sourceToSave.id, sourceToSave.version);
    await db.put(SOURCE_STORE_NAME, sourceToSave, sourceKey);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a source from the database.
 * @param id - The source identifier
 * @param version - The source version
 */
export async function deleteSource(id: Id, version: Version): Promise<void> {
  try {
    const db = await initDB();
    const sourceKey = makeSourceKey(id, version);
    await db.delete(SOURCE_STORE_NAME, sourceKey);
  } catch (error) {
    throw error;
  }
}

/**
 * Import a source from a JSON file.
 * Validates the source structure and saves it to the database.
 *
 * @param file - The File object containing the source JSON
 * @returns The imported source
 * @throws {Error} If file reading fails, JSON parsing fails, or validation fails
 */
export async function importSource(file: File): Promise<Source> {
  try {
    // Read file contents
    const text = await file.text();

    // Parse JSON
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Validate with Zod schema
    const result = sourceSchema.safeParse(jsonData);

    // Format errors
    if (!result.success) {
      const errorList = result.error.issues
        .map((err, i) => {
          const path =
            err.path.length > 0
              ? err.path
                  .map((p) =>
                    typeof p === "number" ? `[${p}]` : `.${String(p)}`
                  )
                  .join("")
                  .replace(/^\./, "")
              : "root";
          return `${i + 1}. ${path}: ${err.message}`;
        })
        .join("\n");

      throw new Error(
        `Source validation failed with ${result.error.issues.length} error(s):\n${errorList}`
      );
    }

    const source = result.data;

    // Check if source already exists
    const exists = await sourceExists(source.id, source.version);
    if (exists) {
      throw new Error(
        `Source ${source.id}@${source.version} already exists`
      );
    }

    // Save to database (this will validate dependencies)
    await saveSource(source);

    return source;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to import source: ${String(error)}`);
  }
}

/**
 * Check if a source with the given id and version exists.
 * @param id - The source identifier
 * @param version - The source version
 * @returns True if the source exists, false otherwise
 */
export async function sourceExists(id: Id, version: Version): Promise<boolean> {
  const source = await getSource(id, version);
  return source !== undefined;
}
