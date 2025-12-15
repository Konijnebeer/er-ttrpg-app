import z from "zod";
import {
  referenceSchema,
  idSchema,
  sourceKeySchema,
  versionSchema,
} from "./refrence";
import { bcp47Schema } from "./bcp47";

// Contrubitors and Acknowledgements

export const contactTypeSchema = z.enum([
  "Website",
  "Discord",
  "Github",
  "Patreon",
  "Youtube",
  "Instagram",
  "Bluesky",
]);

export type ContactType = z.infer<typeof contactTypeSchema>;

export const contactSchema = z.object({
  type: contactTypeSchema,
  name: z.string().min(2).max(30),
  url: z.url().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export const contributorSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(20),
  name: z.string().min(2).max(100),
  image: z.base64().optional(),
  contact: z.array(contactSchema).optional(),
});

export type Contributor = z.infer<typeof contributorSchema>;

export const acknowledgementSchema = contributorSchema.extend({
  contribution: z.string().min(5).max(200),
});

export type Acknowledgement = z.infer<typeof acknowledgementSchema>;

// Items and Tags

export const tagSchema = z.object({
  id: idSchema,
  name: z.string(),
  description: z.string().min(3).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  icon: z.string().min(3).max(20).optional(),
});

export type Tag = z.infer<typeof tagSchema>;

export const itemCategorySchema = z.enum([
  "Oddement",
  "Fragment",
  "CampingGear",
]);

export type ItemCategory = z.infer<typeof itemCategorySchema>;

export const itemSchema = z.object({
  id: idSchema,
  name: z.string().min(2).max(30),
  image: z.string().optional(),
  description: z.string().min(4).max(100).optional(),
  tags: z.array(referenceSchema).optional(),
  category: itemCategorySchema,
});

export type Item = z.infer<typeof itemSchema>;

// Data

export const gaugeBonusesSchema = z.object({
  fallout: z.int(),
  curse: z.int(),
});

export type GaugeBonuses = z.infer<typeof gaugeBonusesSchema>;

export const edgeSkillSchema = z.object({
  id: idSchema,
  name: z.string().min(2).max(10),
  maxTrack: z.int().min(1).max(5),
  description: z.string().min(2).max(150),
});

export type EdgeSkill = z.infer<typeof edgeSkillSchema>;

// Should Aspects and Relics be the same within the Data? they are Gear but with unlockables
// might be handy?

// export const abilitySchema = z.object({
// });
// export type Ability = z.infer<typeof abilitySchema>;

export const aspectCatagorySchema = z.enum(["Trait", "Gear", "Habit", "Relic"]);

export type AspectCatagory = z.infer<typeof aspectCatagorySchema>;

export const aspectSchema = z.object({
  id: idSchema,
  name: z.string().min(2).max(40),
  image: z.base64().optional(),
  description: z.string().min(2).max(200),
  maxTrack: z.int().min(1).max(10),
  category: aspectCatagorySchema,

  // abiltiy for now nothing since this is for a way later stage of the road map
  // ability:     z.array(referenceSchema).optional(),
});

export type Aspect = z.infer<typeof aspectSchema>;

export const originPathSchema = z.object({
  id: idSchema,
  name: z.string(),
  image: z.base64().optional(),
  description: z.string().min(2).max(700),
  edges: z.array(idSchema),
  skills: z.array(idSchema),
  oddements: z.array(idSchema),
  fragments: z.array(idSchema),
  gaugeBonuses: gaugeBonusesSchema,
  aspects: z.array(idSchema),
});

export type OriginPath = z.infer<typeof originPathSchema>;

export const conditionSchema = z.object({
  id: idSchema,
  name: z.string(),
  type: z.enum(["fallout", "curse"]),
  description: z.string().min(20).max(500),
  levels: z
    .object({
      level: z.int(),
      description: z.string().min(20).max(500),
    })
    .array(),
  finalMoment: z.string().min(10).max(200),
});

export type Condition = z.infer<typeof conditionSchema>;

// SourceData

export const sourceDataSchema = z.object({
  origins: z.array(originPathSchema).optional(),
  paths: z.array(originPathSchema).optional(),
  tags: z.array(tagSchema).optional(),
  items: z.array(itemSchema).optional(),
  aspects: z.array(aspectSchema).optional(),
  skills: z.array(edgeSkillSchema).optional(),
  edges: z.array(edgeSkillSchema).optional(),
  conditions: z.array(conditionSchema).optional(),
  // abilities: z.array().optional(),
});

export type SourceData = z.infer<typeof sourceDataSchema>;

// Metadata

export const sourceStatusSchema = z.enum(["draft", "release", "nonEditable"]);

export type SourceStatus = z.infer<typeof sourceStatusSchema>;

// Core sourceInfo schema
const coreSourceSchema = z.object({
  homebrew: z.boolean().default(true),
  isCore: z.literal(true),
  dependencies: z.array(sourceKeySchema).max(0).optional(), // must be empty or undefined
  coreDependency: z.never().optional(),
});

// Non-core sourceInfo schema
const nonCoreSourceSchema = z.object({
  homebrew: z.boolean().default(true),
  isCore: z.literal(false),
  dependencies: z.array(sourceKeySchema).optional(),
  coreDependency: sourceKeySchema, // must exist
});

const sourceInfo = z.discriminatedUnion("isCore", [
  coreSourceSchema,
  nonCoreSourceSchema,
]);

export const sourceMetadataSchema = z.object({
  id: idSchema,
  version: versionSchema,
  name: z.string().min(5).max(40),
  description: z.string().min(20).max(200),
  url: z.url().optional(),
  license: z.string().default("None"),
  status: sourceStatusSchema,
  sourceInfo: sourceInfo,
  language: bcp47Schema.default("en-GB"),
  contributors: z.array(contributorSchema).min(1),
  acknowledgements: z.array(acknowledgementSchema).optional(),
  dateCreated: z.int().min(0),
  dateModified: z.int().min(0),
});

export type SourceMetadata = z.infer<typeof sourceMetadataSchema>;

export const sourceSchema = z.object({
  ...sourceMetadataSchema.shape,
  data: sourceDataSchema,
});

export type Source = z.infer<typeof sourceSchema>;
