import type { ItemReference, OddementReference } from "@/types/character";
import type { Reference } from "@/types/refrence";
import { ensureRefrence, parseRefrence } from "./versioningHelpers";

export function normalizeTagsForRef(
  itemRefId: Reference,
  tags?: Reference[],
): Reference[] | undefined {
  if (!tags || tags.length === 0) return undefined;
  const parsed = parseRefrence(itemRefId);
  return tags.map((tag) => ensureRefrence(parsed.sourceKey, tag));
}

export function haveSameTags(
  tags1: Reference[] | undefined,
  tags2: Reference[] | undefined,
): boolean {
  const arr1 = tags1 ?? [];
  const arr2 = tags2 ?? [];
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((tag, idx) => tag === sorted2[idx]);
}

export function normalizeItemReferenceTags(
  itemRef: OddementReference,
  itemTagsFromSource?: Reference[],
): OddementReference {
  const normalizedTags =
    itemTagsFromSource && itemTagsFromSource.length > 0
      ? normalizeTagsForRef(itemRef.ref, itemTagsFromSource)
      : normalizeTagsForRef(itemRef.ref, itemRef.tags);

  return {
    ...itemRef,
    quantity: itemRef.quantity ?? 1,
    ...(normalizedTags ? { tags: normalizedTags } : {}),
  };
}

export function mergeItemRefs<T extends OddementReference | ItemReference>(
  items: T[],
  resolveItemTags?: (ref: Reference) => Reference[] | undefined,
): T[] {
  return items.reduce((acc: T[], itemRef: T) => {
    // Only normalize tags for OddementReference (which can have tags)
    const hasTagSupport = "tags" in itemRef;

    let normalized: T;
    if (hasTagSupport && resolveItemTags) {
      const sourceTags = resolveItemTags(itemRef.ref);
      normalized = normalizeItemReferenceTags(
        itemRef as OddementReference,
        sourceTags,
      ) as T;
    } else if (hasTagSupport) {
      normalized = normalizeItemReferenceTags(
        itemRef as OddementReference,
        (itemRef as OddementReference).tags,
      ) as T;
    } else {
      // For ItemReference (fragments, campingGear), just ensure quantity
      normalized = { ...itemRef, quantity: itemRef.quantity ?? 1 };
    }

    const existing = acc.find((item) => {
      if (hasTagSupport && "tags" in item) {
        return (
          item.ref === normalized.ref &&
          haveSameTags(
            (item as OddementReference).tags,
            (normalized as OddementReference).tags,
          )
        );
      }
      // For ItemReference, only match by ref
      return item.ref === normalized.ref;
    });

    if (existing) {
      existing.quantity += normalized.quantity ?? 1;
    } else {
      acc.push(normalized);
    }

    return acc;
  }, []);
}
