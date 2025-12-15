import { useSourceStore } from "@/store/sourceStore";
import { useCharacterStore } from "@/store/characterStore";
import type { Reference } from "@/types/refrence";
import { idSchema, trueReferenceSchema } from "@/types/refrence";
import type { SourceData } from "@/types/source";

// Keys that exist in both SourceData and CharacterData
type CommonDataKeys = "aspects" | "items" | "tags";

// Map from common keys to character custom keys
type CharacterCustomKeyMap = {
  aspects: "customAspects";
  items:   "customItems";
  tags:    "customTags";
};

/**
 * Hook that resolves references from either source store (full reference)
 * or character store (just an ID)
 */
export function useResolveReference() {
  const { resolveRefrence: resolveSourceReference } = useSourceStore();
  const { resolveReference: resolveCharacterReference } = useCharacterStore();

  const resolveReference = <T extends CommonDataKeys>(
    reference: Reference,
    dataType: T,
  ): NonNullable<SourceData[T]>[number] | null => {
    // Check if it's a full reference using zod schema
    const fullRefResult = trueReferenceSchema.safeParse(reference);

    if (fullRefResult.success) {
      // It's a full reference, use source store
      return resolveSourceReference(reference, dataType);
    }

    // Check if it's just an ID using zod schema
    const idResult = idSchema.safeParse(reference);

    if (idResult.success) {
      // It's just an ID, look it up in character custom data
      const customKeyMap: CharacterCustomKeyMap = {
        aspects: "customAspects",
        items:   "customItems",
        tags:    "customTags",
      };

      const characterDataKey = customKeyMap[dataType];
      return resolveCharacterReference(
        reference,
        characterDataKey,
      ) as NonNullable<SourceData[T]>[number];
    }

    console.error(`Invalid reference: ${reference}`);
    return null;
  };

  return { resolveReference };
}
