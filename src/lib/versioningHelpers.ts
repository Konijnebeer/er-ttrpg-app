import {
  type Id,
  idSchema,
  type Version,
  versionSchema,
  type SourceKey,
  sourceKeySchema,
  type Reference,
  referenceSchema,
  trueReferenceSchema,
} from "@/types/refrence";

export function makeSourceKey(id: Id, version: Version): SourceKey {
  const idResult = idSchema.safeParse(id);
  const versionResult = versionSchema.safeParse(version);

  if (idResult.success && versionResult.success) {
    return `${idResult.data}@${versionResult.data}` as SourceKey;
  }

  throw new Error("Invalid id or version");
}

export function parseSourceKey(sourceKey: SourceKey): {
  id: Id;
  version: Version;
} {
  const sourceKeyResult = sourceKeySchema.safeParse(sourceKey);

  if (sourceKeyResult.success) {
    const [idStr, versionStr] = sourceKeyResult.data.split("@");
    const idResult = idSchema.safeParse(idStr);
    const versionResult = versionSchema.safeParse(versionStr);

    if (idResult.success && versionResult.success) {
      return {
        id: idResult.data as Id,
        version: versionResult.data as Version,
      };
    }

    throw new Error("Invalid id or version in sourceKey");
  }
  throw new Error("Invalid sourceKey");
}

export function makeRefrence(sourceKey: SourceKey, id: Id): Reference {
  const sourceKeyResult = sourceKeySchema.safeParse(sourceKey);
  const idResult = idSchema.safeParse(id);

  if (sourceKeyResult.success && idResult.success) {
    return `${sourceKeyResult.data}:${idResult.data}` as Reference;
  }
  throw new Error("Invalid sourceKey or Id");
}

export function parseRefrence(reference: Reference): {
  sourceKey: SourceKey;
  id: Id;
} {
  const referenceResult = referenceSchema.safeParse(reference);

  if (referenceResult.success) {
    const [sourceKeyStr, idStr] = referenceResult.data.split(":");
    const sourceKeyResult = sourceKeySchema.safeParse(sourceKeyStr);
    const idResult = idSchema.safeParse(idStr);

    if (sourceKeyResult.success && idResult.success) {
      return {
        sourceKey: sourceKeyResult.data as SourceKey,
        id: idResult.data as Id,
      };
    }
    throw new Error(
      `Invalid sourceKey: ${sourceKeyResult} or id: ${idResult} in refrence ${reference}`
    );
  }
  throw new Error(`Invalid refrence: ${reference}`);
}

export function ensureRefrence(
  sourceKey: SourceKey,
  referenceOrId: Reference | Id
): Reference {
  const sourceKeyResult = sourceKeySchema.safeParse(sourceKey);
  if (!sourceKeyResult.success) {
    throw new Error("Invalid sourceKey");
  }

  const refResult = trueReferenceSchema.safeParse(referenceOrId as Reference);
  if (refResult.success) {
    return refResult.data as Reference;
  }

  const idResult = idSchema.safeParse(referenceOrId as Id);
  if (idResult.success) {
    return makeRefrence(sourceKeyResult.data as SourceKey, idResult.data as Id);
  }

  throw new Error("Value is neither a valid Reference nor a valid Id");
}
