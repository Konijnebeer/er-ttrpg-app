import { create } from "zustand";

export type DialogType = "oddement" | "fragment" | "camping-gear" | "aspect" | "tag" | null;

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
