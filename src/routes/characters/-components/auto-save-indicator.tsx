import { useCharacterStore } from "@/store/characterStore";
import { useSettingsStore } from "@/store/settingsStore";
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

      if (indicatorSetting === "Default") {
        toast.success("Character saved");
      } else if (indicatorSetting === "Small") {
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
