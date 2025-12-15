import { create } from "zustand";

type DialogType = "item" | "aspect" | "tag" | null;

interface DialogState {
  open: boolean;
  type: DialogType;
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  open: false,
  type: null,
  openDialog: (type) => set({ open: true, type }),
  closeDialog: () => set({ open: false }),
}));
