import z from "zod";
import {
  idSchema,
  referenceSchema,
  sourceKeySchema,
  versionSchema,
} from "./refrence";

// Refrences

export const edgeSkillReferenceSchema = z.object({
  ref:   referenceSchema,
  level: z.number().min(0),
});

export type EdgeSkillReference = z.infer<typeof edgeSkillReferenceSchema>;

export const itemReferenceSchema = z.object({
  ref:      referenceSchema,
  quantity: z.number().min(1),
});

export type ItemReference = z.infer<typeof itemReferenceSchema>;

export const oddementReferenceSchema = itemReferenceSchema.extend({
  tags: z.array(referenceSchema).optional(),
});

export type OddementReference = z.infer<typeof oddementReferenceSchema>;

export const aspectReferenceSchema = z.object({
  ref:   referenceSchema,
  track: z.number().min(0),
});

export type AspectReference = z.infer<typeof aspectReferenceSchema>;

// Items & Aspects

import {
  oddementSchema,
  fragmentSchema,
  campingGearSchema,
  aspectSchema,
  tagSchema,
} from "./source";

// Custom variants
export const customOddementSchema = oddementSchema.omit({ image: true });

export type CustomOddement = z.infer<typeof customOddementSchema>;

export const customTagSchema = tagSchema.omit({ icon: true });

export type CustomTag = z.infer<typeof customTagSchema>;

export const customFragmentSchema = fragmentSchema;

export type CustomFragment = z.infer<typeof customFragmentSchema>;

export const customCampingGearSchema = campingGearSchema.omit({ image: true });

export type CustomCampingGear = z.infer<typeof customCampingGearSchema>;

export const customAspectSchema = aspectSchema.omit({ image: true });

export type CustomAspect = z.infer<typeof customAspectSchema>;

// Character

export const BackpackSchema = z.object({
  oddements:   z.array(oddementReferenceSchema),
  fragments:   z.array(itemReferenceSchema),
  campingGear: z.array(itemReferenceSchema),
});

export type Backpack = z.infer<typeof BackpackSchema>;

export const clockSchema = z.object({
  food:     z.number().min(0).max(2),
  sleep:    z.number().min(0).max(2),
  dawnDusk: z.number().min(0).max(6),
});

export type clock = z.infer<typeof clockSchema>;

export const falloutCurseSchema = z.object({
  level:        z.number().min(0),
  condition:    z.string(),
  maxTrack:     z.number().min(0),
  currentTrack: z.number().min(0),
});

export type FalloutCurse = z.infer<typeof falloutCurseSchema>;

export const characterSelfSchema = z.object({
  name:       z.string().min(2).max(20),
  player:     z.string().min(2).max(20),
  pronouns:   z.string().max(10),
  origin:     z.string(),
  originRef:  referenceSchema,
  path:       z.string(),
  pathRef:    referenceSchema,
  milestones: z.number().min(0),
  dispair:    z.number().min(0).max(6),
  hope:       z.number().min(0).max(6),
  fallout:    falloutCurseSchema,
  curse:      falloutCurseSchema,
  clock:      clockSchema,
});

export type CharacterSelf = z.infer<typeof characterSelfSchema>;

// characterData

export const characterDataSchema = z.object({
  character:         characterSelfSchema,
  edges:             z.array(edgeSkillReferenceSchema),
  skills:            z.array(edgeSkillReferenceSchema),
  backpack:          BackpackSchema,
  aspects:           z.array(aspectReferenceSchema),
  customOddements:   z.array(customOddementSchema).optional(),
  customTags:        z.array(customTagSchema).optional(),
  customFragments:   z.array(customFragmentSchema).optional(),
  customCampingGear: z.array(customCampingGearSchema).optional(),
  customAspects:     z.array(customAspectSchema).optional(),
});

export type CharacterData = z.infer<typeof characterDataSchema>;

// Metadata

export const characterMetadataSchema = z.object({
  id:           idSchema,
  versionRef:   sourceKeySchema,
  name:         z.string().min(2).max(20),
  description:  z.string().min(10).max(200),
  sheetVersion: versionSchema,
  dependencies: z.array(sourceKeySchema).optional(),
  author:       z.string().min(2).max(20),
  dateCreated:  z.int().min(0),
  dateModified: z.int().min(0),
});

export type CharacterMetadata = z.infer<typeof characterMetadataSchema>;

export const characterSchema = z.object({
  ...characterMetadataSchema.shape,
  data: characterDataSchema,
});

export type Character = z.infer<typeof characterSchema>;
