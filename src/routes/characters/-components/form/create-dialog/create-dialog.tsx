import { CreateOddementDialog } from "./create-oddement";
import { CreateAspectDialog } from "./create-aspect";
import { CreateTagDialog } from "./create-tag";
import { CreateFragmentDialog } from "./create-fragment";
import { CreateCampingGearDialog } from "./create-camping-gear";
import type { DialogType } from "@/store/dialogStore";

interface CreateDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  type:         DialogType;
}

export function CreateDialog({ open, onOpenChange, type }: CreateDialogProps) {
  if (type === "oddement") {
    return <CreateOddementDialog open={open} onOpenChange={onOpenChange} />;
  }

  if (type === "fragment") {
    return <CreateFragmentDialog open={open} onOpenChange={onOpenChange} />;
  }

  if (type === "camping-gear") {
    return <CreateCampingGearDialog open={open} onOpenChange={onOpenChange} />;
  }

  if (type === "aspect") {
    return <CreateAspectDialog open={open} onOpenChange={onOpenChange} />;
  }

  if (type === "tag") {
    return <CreateTagDialog open={open} onOpenChange={onOpenChange} />;
  }

  return null;
}
