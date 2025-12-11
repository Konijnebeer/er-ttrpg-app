import type {
  Character,
  CharacterMetadata,
  CharacterSelf,
} from "@/types/character";
import { characterSchema } from "@/types/character";
import { create } from "zustand";
import type { Id } from "@/types/refrence";
import {
  getAllCharactersMetadata,
  getCharacter,
  importCharacter,
  saveCharacter,
  deleteCharacter,
} from "@/database/characterDB";
import { SAVE_DEBOUNCE_MS } from "@/lib/constants";

interface CharacterStoreState {
  // State
  /** Current selected character */
  character: Character;

  /** All characters but only containing metadata and characterSelf */
  characters: (CharacterMetadata & { character: CharacterSelf })[];

  /** Loading state for async operations */
  isLoading: boolean;

  /** Saving state for debounced updates */
  isSaving: boolean;

  /** Error message from last operation */
  error: string | null;

  /** Debounce timer for auto-save */
  saveTimer: NodeJS.Timeout | null;

  /** Load a specific character by id (with caching) */
  loadCharacter: (id: Id) => Promise<Character | null>;

  /** Load all characters metadata without full data TODO: check if i need to store them or if i can just return an array*/
  loadAllCharactersMetadata: () => Promise<void>;

  /** Import character from file */
  importCharacter: (file: File) => Promise<Character>;

  /** Download character from public folder */
  downloadCharacter: (id: Id, filename: string) => Promise<void>;

  /** Delete character from database */
  deleteCharacter: (id: Id) => Promise<void>;

  /** Update character with partial data (debounced save) */
  updateCharacter: (updates: Partial<Character>) => void;

  /** Save character immediately (for manual saves) */
  saveCharacter: () => Promise<void>;

  /** Make a new character in the Database */
  createNewCharacter: (Character: Character) => Promise<void>;
}

export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
  character: {} as Character,
  characters: [] as (CharacterMetadata & { character: CharacterSelf })[],
  isLoading: false,
  isSaving: false,
  error: null,
  saveTimer: null,

  loadCharacter: async (id: Id) => {
    // Check cache first - avoid unnecessary DB calls
    const cached = get().character;
    if (cached.id === id) {
      return cached;
    }

    set({ isLoading: true, error: null });
    try {
      const character = await getCharacter(id);

      if (character) {
        set({
          character: character,
          isLoading: false,
        });
        return character;
      }
      set({ error: `Character ${id} not found`, isLoading: false });
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to load character ${id}:`, error);
      return null;
    }
  },

  loadAllCharactersMetadata: async () => {
    set({ isLoading: true, error: null });
    try {
      const metadata = await getAllCharactersMetadata();

      set({
        characters: metadata,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to load sources metadata:", error);
    }
  },

  importCharacter: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const character = await importCharacter(file);

      set({
        character: character,
        isLoading: false,
      });
      return character;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to import character from file:`, error);
      throw error;
    }
  },

  downloadCharacter: async (id: Id, filename: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch the character from the public folder
      const response = await fetch(`/characters/${id}/${filename}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch character: ${response.statusText}`);
      }

      const text = await response.text();

      // Check if response is HTML (error page)
      if (
        text.trim().startsWith("<!DOCTYPE") ||
        text.trim().startsWith("<html")
      ) {
        throw new Error(`Character file not found at /characters/${filename}`);
      }

      const jsonData = JSON.parse(text);

      // Validate with schema
      const result = characterSchema.safeParse(jsonData);
      if (!result.success) {
        throw new Error(`Invalid character format`);
      }

      // Save to database
      await importCharacter(
        new File([text], filename, { type: "application/json" })
      );

      set({ isLoading: false });

      // Reload metadata to update UI
      await get().loadAllCharactersMetadata();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to download character:`, error);
      throw error;
    }
  },

  deleteCharacter: async (id: Id) => {
    set({ isLoading: true, error: null });
    try {
      // Delete from database
      await deleteCharacter(id);

      // Clear character if it was the active one
      const currentCharacter = get().character;
      if (currentCharacter.id === id) {
        set({ character: {} as Character, isLoading: false });
      } else {
        set({ isLoading: false });
      }

      // Reload metadata to update UI
      await get().loadAllCharactersMetadata();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
      console.error(`Failed to delete character:`, error);
      throw error;
    }
  },

  updateCharacter: (updates: Partial<Character>) => {
    const currentCharacter = get().character;

    if (!currentCharacter.id) {
      console.error("No character loaded to update");
      return;
    }

    // Merge updates with current character
    const updatedCharacter = {
      ...currentCharacter,
      ...updates,
      dateModified: Math.floor(Date.now() / 1000),
    };

    // Update state immediately for responsive UI
    set({ character: updatedCharacter });

    // Clear existing timer
    const existingTimer = get().saveTimer;
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounced save timer
    const newTimer = setTimeout(async () => {
      await get().saveCharacter();
    }, SAVE_DEBOUNCE_MS);

    set({ saveTimer: newTimer });
  },

  saveCharacter: async () => {
    const currentCharacter = get().character;

    if (!currentCharacter.id) {
      console.error("No character loaded to save");
      return;
    }

    set({ isSaving: true, error: null });
    try {
      await saveCharacter(currentCharacter);
      set({ isSaving: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isSaving: false });
      console.error("Failed to save character:", error);
      throw error;
    }
  },

  createNewCharacter: async (character: Character) => {
    try {
      await saveCharacter(character);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage });
      console.error("Failed to save character:", error);
      throw error;
    }
  },
}));
