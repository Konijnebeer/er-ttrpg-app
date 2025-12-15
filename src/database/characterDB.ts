import { openDB, type IDBPDatabase } from "idb";
import {
  characterSchema,
  type Character,
  type CharacterMetadata,
  type CharacterSelf,
} from "@/types/character";
import type { Id, SourceKey } from "@/types/refrence";
import {
  CHARACTER_DB_NAME,
  CHARACTER_DB_VERSION,
  CHARACTER_STORE_NAME,
} from "@/lib/constants";

/**
 * IndexedDB schema definition for the character database.
 * Characters are keyed by composite CharacterId (id).
 */
interface CharacterDB {
  sources: {
    key:     Id;
    value:   Character;
    indexes: {
      id:           Id;
      versionRef:   SourceKey;
      dependencies: SourceKey[];
      dateModified: number;
      name:         string;
    };
  };
}

let dbInstance: IDBPDatabase<CharacterDB> | null = null;

/**
 * Initialize and return the source database instance.
 * Creates object store and indexes on first run or version upgrade.
 */
export async function initDB(): Promise<IDBPDatabase<CharacterDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<CharacterDB>(
      CHARACTER_DB_NAME,
      CHARACTER_DB_VERSION,
      {
        upgrade(db) {
          // Create characters store if it doesn't exist
          if (!db.objectStoreNames.contains(CHARACTER_STORE_NAME)) {
            const store = db.createObjectStore(CHARACTER_STORE_NAME);

            // Create indexes for efficient queries
            store.createIndex("id", "id", { unique: false });
            store.createIndex("versionRef", "versionRef", { unique: false });
            store.createIndex("dependencies", "dependencies", {
              unique: false,
            });
            store.createIndex("dateModified", "dateModified", {
              unique: false,
            });
            store.createIndex("name", "name", { unique: false });
          }
        },
      },
    );

    return dbInstance;
  } catch (error) {
    throw error;
  }
}

/**
 * Get a specific character by id
 * @param id - The source identifier
 * @returns The character if found, undefined otherwise
 */
export async function getCharacter(id: Id): Promise<Character | undefined> {
  try {
    const db = await initDB();
    return db.get(CHARACTER_STORE_NAME, id);
  } catch (error) {
    throw error;
  }
}

/**
 * Get metadata for all characters without loading full data. Ordered by dateModified descending.
 * @returns Array of character metadata objects
 */
export async function getAllCharactersMetadata(): Promise<
  (CharacterMetadata & { character: CharacterSelf })[]
> {
  try {
    const db = await initDB();
    const characters = await db.getAll(CHARACTER_STORE_NAME);

    // Strip out edges and skills to reduce memory, but keep character self
    return characters
      .map(({ data, ...metadata }) => ({
        ...metadata,
        character: data.character,
      }))
      .sort((a, b) => b.dateModified - a.dateModified);
  } catch (error) {
    throw error;
  }
}

/**
 * Save or update a character in the database.
 * Validates that all dependencies exist before saving.
 *
 * @param character - The character to save
 */
export async function saveCharacter(character: Character): Promise<void> {
  try {
    const db = await initDB();

    // Todo Validate dependencies exist

    // Update modification timestamp devide by 100 for unix timestamp
    const now = Math.floor(Date.now() / 1000);
    const characterToSave: Character = {
      ...character,
      dateModified: now,
    };

    await db.put(CHARACTER_STORE_NAME, characterToSave, characterToSave.id);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a character from the database.
 * @param id - The source identifier
 */
export async function deleteCharacter(id: Id): Promise<void> {
  try {
    const db = await initDB();

    await db.delete(CHARACTER_STORE_NAME, id);
  } catch (error) {
    throw error;
  }
}

/**
 * Import a character from a JSON file.
 * Validates the character structure and saves it to the database.
 *
 * @param file - The File object containing the character JSON
 * @returns The imported character
 * @throws {Error} If file reading fails, JSON parsing fails, or validation fails
 */
export async function importCharacter(file: File): Promise<Character> {
  try {
    // Read file contents
    const text = await file.text();

    // Parse JSON
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // Validate with Zod schema
    const result = characterSchema.safeParse(jsonData);

    // Format errors
    if (!result.success) {
      const errorList = result.error.issues
        .map((err, i) => {
          const path =
            err.path.length > 0
              ? err.path
                  .map((p) =>
                    typeof p === "number" ? `[${p}]` : `.${String(p)}`,
                  )
                  .join("")
                  .replace(/^\./, "")
              : "root";
          return `${i + 1}. ${path}: ${err.message}`;
        })
        .join("\n");

      throw new Error(
        `Source validation failed with ${result.error.issues.length} error(s):\n${errorList}`,
      );
    }

    const character = result.data;

    // Check if source already exists
    const exists = await characterExists(character.id);
    if (exists) {
      throw new Error(
        `Source ${character.id}/${character.name} already exists`,
      );
    }

    // Save to database (this will validate dependencies)
    await saveCharacter(character);

    return character;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to import source: ${String(error)}`);
  }
}

/**
 * Export a character to a JSON file.
 * @param id - The character identifier
 * @returns The character JSON as a string
 */
export async function exportCharacter(id: Id): Promise<string> {
  try {
    const character = await getCharacter(id);
    if (!character) {
      throw new Error(`Character with id ${id} not found`);
    }
    return JSON.stringify(character, null, 2);
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a character with the given id exists.
 * @param id - The character identifier
 * @returns True if the character exists, false otherwise
 */
export async function characterExists(id: Id): Promise<boolean> {
  const character = await getCharacter(id);
  return character !== undefined;
}
