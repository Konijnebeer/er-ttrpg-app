import { useCharacterStore } from "@/store/characterStore";
import { useSettingsStore } from "@/store/settingsStore";
import { saveIndicatorSchema } from "@/types/settings";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function AutoSaveIndicator() {
  const { isSaving } = useCharacterStore();
  const wasJustSaving = useRef(false);
  const indicatorSetting = useSettingsStore((s) => s.settings.saveIndicator);

  useEffect(() => {
    if (isSaving && !wasJustSaving.current) {
      // Started saving
      wasJustSaving.current = true;
    } else if (!isSaving && wasJustSaving.current) {
      // Finished saving
      wasJustSaving.current = false;

      if (indicatorSetting === saveIndicatorSchema.options[0]) {
        toast.success("Character saved");
      } else if (indicatorSetting === saveIndicatorSchema.options[1]) {
        toast.success("", {
          classNames: {
            toast:   "!min-w-0 max-w-10 w-10",
            content: "hidden",
          },
        });
      }
    }
  }, [isSaving]);

  return null;
}
