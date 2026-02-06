import type { Character } from "@/types/character";
import type { SourceKey, Reference, Id } from "@/types/refrence";
import type { Source, SourceData } from "@/types/source";
import { parseRefrence, makeRefrence } from "./versioningHelpers";

/**
 * Migrates all references in a character from an old source version to a new one.
 * References of the source that don't exist in the new source will be removed.
 * except for originRef and pathRef which will be kept unchanged if migration fails
 * (as they are required fields).
 *
 * @param character - The character to migrate
 * @param oldSourceKey - The old source version to migrate from
 * @param newSourceKey - The new source version to migrate to
 * @param newSource - The new source data
 * @returns The updated character with migrated references
 */
export function migrateCharacterSource(
  character: Character,
  oldSourceKey: SourceKey,
  newSourceKey: SourceKey,
  newSource: Source,
): Character {
  const updatedCharacter = structuredClone(character) as Character;

  // Update versionRef if it matches the old source
  if (updatedCharacter.versionRef === oldSourceKey) {
    updatedCharacter.versionRef = newSourceKey;
  }

  // Update dependencies if they include the old source
  if (updatedCharacter.dependencies) {
    updatedCharacter.dependencies = updatedCharacter.dependencies.map((dep) =>
      dep === oldSourceKey ? newSourceKey : dep,
    );
  }

  // Helper function to migrate a single reference
  const migrateReference = (
    ref: Reference,
    dataType: keyof SourceData,
  ): Reference | null => {
    try {
      const { sourceKey, id } = parseRefrence(ref);

      // Only migrate if it's from the old source
      if (sourceKey !== oldSourceKey) {
        return ref;
      }

      // Check if the entity exists in the new source
      const entityExistsInNew = entityExistsInSource(
        id,
        dataType,
        newSource.data,
      );

      if (!entityExistsInNew) {
        console.warn(
          `Entity ${id} of type ${dataType} does not exist in new source version`,
        );
        return null;
      }

      // Create new reference with new source key
      return makeRefrence(newSourceKey, id);
    } catch (error) {
      console.error(`Failed to migrate reference ${ref}:`, error);
      return null;
    }
  };

  // Migrate character.originRef and pathRef
  if (updatedCharacter.data.character.originRef) {
    const migratedOrigin = migrateReference(
      updatedCharacter.data.character.originRef,
      "origins",
    );
    if (migratedOrigin) {
      updatedCharacter.data.character.originRef = migratedOrigin;
    } else {
      console.warn("Origin reference could not be migrated, keeping original");
    }
  }

  if (updatedCharacter.data.character.pathRef) {
    const migratedPath = migrateReference(
      updatedCharacter.data.character.pathRef,
      "paths",
    );
    if (migratedPath) {
      updatedCharacter.data.character.pathRef = migratedPath;
    } else {
      console.warn("Path reference could not be migrated, keeping original");
    }
  }

  /// Migrate edges
  updatedCharacter.data.edges = updatedCharacter.data.edges
    .map((edge) => {
      const migratedRef = migrateReference(edge.ref, "edges");
      return migratedRef ? { ...edge, ref: migratedRef } : null;
    })
    .filter((edge): edge is NonNullable<typeof edge> => edge !== null);

  // Migrate skills
  updatedCharacter.data.skills = updatedCharacter.data.skills
    .map((skill) => {
      const migratedRef = migrateReference(skill.ref, "skills");
      return migratedRef ? { ...skill, ref: migratedRef } : null;
    })
    .filter((skill): skill is NonNullable<typeof skill> => skill !== null);

  // Migrate aspects
  updatedCharacter.data.aspects = updatedCharacter.data.aspects
    .map((aspect) => {
      const migratedRef = migrateReference(aspect.ref, "aspects");
      return migratedRef ? { ...aspect, ref: migratedRef } : null;
    })
    .filter((aspect): aspect is NonNullable<typeof aspect> => aspect !== null);

  // Migrate backpack oddements (including the tags filter inside)
  updatedCharacter.data.backpack.oddements =
    updatedCharacter.data.backpack.oddements
      .map((oddement) => {
        const migratedRef = migrateReference(oddement.ref, "oddements");
        if (!migratedRef) return null;

        // Migrate tags within oddement
        const migratedTags = oddement.tags
          ?.map((tag) => migrateReference(tag, "tags"))
          ?.filter((tag): tag is NonNullable<typeof tag> => tag !== null);

        return {
          ...oddement,
          ref:  migratedRef,
          tags: migratedTags?.length ? migratedTags : undefined,
        };
      })
      .filter(
        (oddement): oddement is NonNullable<typeof oddement> =>
          oddement !== null,
      );

  // Migrate backpack fragments
  updatedCharacter.data.backpack.fragments =
    updatedCharacter.data.backpack.fragments
      .map((fragment) => {
        const migratedRef = migrateReference(fragment.ref, "fragments");
        return migratedRef ? { ...fragment, ref: migratedRef } : null;
      })
      .filter(
        (fragment): fragment is NonNullable<typeof fragment> =>
          fragment !== null,
      );

  // Migrate backpack camping gear
  updatedCharacter.data.backpack.campingGear =
    updatedCharacter.data.backpack.campingGear
      .map((gear) => {
        const migratedRef = migrateReference(gear.ref, "campingGear");
        return migratedRef ? { ...gear, ref: migratedRef } : null;
      })
      .filter((gear): gear is NonNullable<typeof gear> => gear !== null);

  return updatedCharacter;
}

/**
 * Check if an entity exists in a source's data array
 */
function entityExistsInSource(
  id: Id,
  dataType: keyof SourceData,
  sourceData: SourceData,
): boolean {
  const array = sourceData[dataType];
  if (!array || !Array.isArray(array)) {
    return false;
  }

  return array.some((item) => {
    if (typeof item === "object" && item !== null && "id" in item) {
      return item.id === id;
    }
    return false;
  });
}
