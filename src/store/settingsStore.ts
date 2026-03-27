import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Settings,
  defaultSettings,
  settingsSchema,
} from "@/types/settings";

interface SettingsStoreState {
  settings:    Settings;
  setSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      settings:    defaultSettings,
      setSettings: (incoming) =>
        set((state) => {
          const merged = { ...state.settings, ...incoming };
          const parsed = settingsSchema.safeParse(merged);
          return parsed.success ? { settings: parsed.data } : state;
        }),
    }),
    {
      name:  "settings",
      merge: (persisted, current) => {
        const parsed = settingsSchema.safeParse({
          ...current.settings,
          ...(persisted as SettingsStoreState).settings,
        });
        return parsed.success ? { ...current, settings: parsed.data } : current;
      },
    },
  ),
);
