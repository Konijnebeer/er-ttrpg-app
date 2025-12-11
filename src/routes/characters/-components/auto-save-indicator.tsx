import { useCharacterStore } from "@/store/characterStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function AutoSaveIndicator() {
  const { isSaving } = useCharacterStore();
  const wasJustSaving = useRef(false);

  useEffect(() => {
    if (isSaving && !wasJustSaving.current) {
      // Started saving
      wasJustSaving.current = true;
    } else if (!isSaving && wasJustSaving.current) {
      // Finished saving
      wasJustSaving.current = false;
      toast.success("Character saved");
    }
  }, [isSaving]);

  return null;
}
