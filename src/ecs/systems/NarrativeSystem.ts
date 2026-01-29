import { useDialogueStore } from "../../features/narrative/DialogueManager";
import { DIALOGUE_ANCHOR, DIALOGUE_GUIDE, DIALOGUE_ALTAR } from "../../features/narrative/Content";
import { handleNarrativeTrigger } from "./QuestSystem";

// Map IDs to content
const DialogueContentMap: Record<string, any> = {
    "dialogue_anchor": DIALOGUE_ANCHOR,
    "dialogue_guide": DIALOGUE_GUIDE,
    "dialogue_altar": DIALOGUE_ALTAR
};

export const startNarrative = (dialogueId: string) => {
    const tree = DialogueContentMap[dialogueId];
    if (!tree) {
        console.warn(`Dialogue not found: ${dialogueId}`);
        return;
    }

    useDialogueStore.getState().startDialogue(tree, handleNarrativeTrigger);
};

export const NarrativeSystem = () => {
    // This could handle ambient dialogue or world events
};
