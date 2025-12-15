import { CreateItemDialog } from "./create-item";
import { CreateAspectDialog } from "./create-aspect";
import { CreateTagDialog } from "./create-tag";

type DialogType = "item" | "aspect" | "tag" | null;

interface CreateDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  type:         DialogType;
}

export function CreateDialog({ open, onOpenChange, type }: CreateDialogProps) {
  if (type === "item") {
    return <CreateItemDialog open={open} onOpenChange={onOpenChange} />;
  }

  if (type === "aspect") {
    return <CreateAspectDialog open={open} onOpenChange={onOpenChange} />;
  }

  if (type === "tag") {
    return <CreateTagDialog open={open} onOpenChange={onOpenChange} />;
  }

  return null;
}
