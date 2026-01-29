import { create } from "zustand";
import type { DialogueTree, DialogueNode } from "../../game/schema/GameSchema";

interface DialogueState {
    isOpen: boolean;
    currentTree: DialogueTree | null;
    currentNode: DialogueNode | null;

    // Actions
    startDialogue: (tree: DialogueTree) => void;
    selectOption: (nextNodeId?: string) => void;
    closeDialogue: () => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
    isOpen: false,
    currentTree: null,
    currentNode: null,

    startDialogue: (tree) => set({
        isOpen: true,
        currentTree: tree,
        currentNode: tree.nodes[tree.rootNodeId]
    }),

    selectOption: (nextNodeId) => {
        if (!nextNodeId) {
            // End dialogue
            set({ isOpen: false, currentTree: null, currentNode: null });
            return;
        }

        const state = get();
        if (!state.currentTree) return;

        const nextNode = state.currentTree.nodes[nextNodeId];
        if (nextNode) {
            set({ currentNode: nextNode });
        } else {
            // Error or end
            set({ isOpen: false });
        }
    },

    closeDialogue: () => set({
        isOpen: false,
        currentTree: null,
        currentNode: null
    })
}));
