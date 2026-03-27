import z from "zod";

export const SaveFrequencyConst = {
  Default: 2000,
  Half:    4000,
  Quarter: 8000,
} as const;

export const saveFrequencySchema = z.enum(SaveFrequencyConst);

export type SaveFrequency = z.infer<typeof saveFrequencySchema>;

export const saveIndicatorSchema = z.enum(["Default", "Small", "None"]);

export type SaveIndicator = z.infer<typeof saveIndicatorSchema>;

export const settingsSchema = z.object({
  saveIndicator: saveIndicatorSchema,
  saveFrequency: saveFrequencySchema,
});

export type Settings = z.infer<typeof settingsSchema>;

export const defaultSettings: Settings = {
  saveIndicator: "Default",
  saveFrequency: SaveFrequencyConst.Default,
};
