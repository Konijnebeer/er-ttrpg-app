import { z } from "zod";

// ====================
// Base schemas for ID and Version
// ====================

// IDs: alphanumeric + _ and -
export const idSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Invalid ID — only letters, numbers, _ and - allowed"
  );
export type Id = z.infer<typeof idSchema>;

// Versions: semver with optional ~ or ^
export const versionSchema = z
  .string()
  .regex(
    /^[~^]?\d+\.\d+\.\d+$/,
    "Invalid version — expected semver like 1.0.0, ^2.3.4, or ~0.9.1"
  );
export type Version = z.infer<typeof versionSchema>;

// ====================
// SourceKey: `${Id}@${Version}`
// ====================

export const sourceKeySchema = z.templateLiteral(
  [idSchema, "@", versionSchema],
  "Invalid source key"
);
export type SourceKey = z.infer<typeof sourceKeySchema>;

// ====================
// Reference: either `entity-id` or `source-id@version:entity-id`
// ====================

export const trueReferenceSchema = z.templateLiteral(
  [sourceKeySchema, ":", idSchema],
  "Invalid trueReference — must be or source-id@version:entity-id"
);

export const referenceSchema = z.union(
  [
    idSchema, // plain entity ID
    trueReferenceSchema,
  ],
  "Invalid reference — must be entity-id or source-id@version:entity-id"
);
export type Reference = z.infer<typeof referenceSchema>;
