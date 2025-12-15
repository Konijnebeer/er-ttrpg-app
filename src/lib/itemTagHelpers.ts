import type { ItemReference } from "@/types/character";
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
  itemRef: ItemReference,
  itemTagsFromSource?: Reference[],
): ItemReference {
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

export function mergeItemRefs(
  items: ItemReference[],
  resolveItemTags?: (ref: Reference) => Reference[] | undefined,
): ItemReference[] {
  return items.reduce((acc: ItemReference[], itemRef: ItemReference) => {
    const sourceTags = resolveItemTags
      ? resolveItemTags(itemRef.ref)
      : undefined;
    const normalized = normalizeItemReferenceTags(itemRef, sourceTags);
    const existing = acc.find(
      (item) =>
        item.ref === normalized.ref && haveSameTags(item.tags, normalized.tags),
    );

    if (existing) {
      existing.quantity += normalized.quantity ?? 1;
    } else {
      acc.push(normalized);
    }

    return acc;
  }, []);
}
