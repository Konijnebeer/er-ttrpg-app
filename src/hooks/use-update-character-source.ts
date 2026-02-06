import { useState } from "react";
import type { Character } from "@/types/character";
import type { SourceKey } from "@/types/refrence";
import { useCharacterStore } from "@/store/characterStore";
import { useSourceStore } from "@/store/sourceStore";
import { migrateCharacterSource } from "@/lib/migrateCharacterSource";
import { parseSourceKey } from "@/lib/versioningHelpers";

interface UpdateResult {
  success: boolean;
  error?:  string;
}

export function useUpdateCharacterSource() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateCharacter } = useCharacterStore();
  const { loadSource } = useSourceStore();

  const updateSource = async (
    character: Character,
    oldSourceKey: SourceKey,
    newSourceKey: SourceKey,
  ): Promise<UpdateResult> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Parse source key to get id and version
      const { id: newId, version: newVersion } = parseSourceKey(newSourceKey);

      // Load new source data
      const newSource = await loadSource(newId, newVersion);

      if (!newSource) {
        throw new Error("Failed to load new source version");
      }

      // Migrate the character
      const migratedCharacter = migrateCharacterSource(
        character,
        oldSourceKey,
        newSourceKey,
        newSource,
      );

      // Update the character in the store
      updateCharacter(migratedCharacter);

      setIsUpdating(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsUpdating(false);
      console.error("Failed to update character source:", err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    updateSource,
    isUpdating,
    error,
  };
}
