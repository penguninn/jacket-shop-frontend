import { create } from "zustand";
import type { Order } from "@/features/orders/model/schemas";

interface PosStore {
    // Current draft being edited (from backend)
    currentDraft: Order | null;

    // List of all pending drafts (from backend)
    draftList: Order[];

    // Actions
    setCurrentDraft: (draft: Order | null) => void;
    setDraftList: (drafts: Order[]) => void;
    clearCurrentDraft: () => void;
}

// Simple store - NO persist, NO localStorage!
export const usePosStore = create<PosStore>()((set) => ({
    currentDraft: null,
    draftList: [],

    setCurrentDraft: (draft) => set({ currentDraft: draft }),
    setDraftList: (drafts) => set({ draftList: drafts }),
    clearCurrentDraft: () => set({ currentDraft: null }),
}));
