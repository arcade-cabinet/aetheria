import { create } from "zustand";
import type { DialogueTree, DialogueNode } from "../../game/schema/GameSchema";

interface DialogueState {
    isOpen: boolean;
    currentTree: DialogueTree | null;
    currentNode: DialogueNode | null;
    onTrigger?: (trigger: string) => void;

    // Actions
    startDialogue: (tree: DialogueTree, onTrigger?: (trigger: string) => void) => void;
    selectOption: (optionId: string) => void;
    closeDialogue: () => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
    isOpen: false,
    currentTree: null,
    currentNode: null,
    onTrigger: undefined,

    startDialogue: (tree, onTrigger) => set({
        isOpen: true,
        currentTree: tree,
        currentNode: tree.nodes[tree.rootNodeId],
        onTrigger
    }),

    selectOption: (optionId) => {
        const state = get();
        if (!state.currentNode || !state.currentTree) return;

        const option = state.currentNode.options.find(o => o.id === optionId);
        if (!option) return;

        // 1. Handle Trigger
        if (option.triggerEvent && state.onTrigger) {
            state.onTrigger(option.triggerEvent);
        }

        // 2. Handle Next Node
        if (!option.nextNodeId) {
            // End dialogue
            set({ isOpen: false, currentTree: null, currentNode: null });
            return;
        }

        const nextNode = state.currentTree.nodes[option.nextNodeId];
        if (nextNode) {
            set({ currentNode: nextNode });
        } else {
            set({ isOpen: false });
        }
    },

    closeDialogue: () => set({
        isOpen: false,
        currentTree: null,
        currentNode: null
    })
}));
