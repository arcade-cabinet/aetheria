import { useQuestStore } from "../../features/narrative/QuestManager";
import { useDialogueStore } from "../../features/narrative/DialogueManager";
import { DIALOGUE_ANCHOR } from "../../features/narrative/Content";

// Map of Dialogue IDs to Data (In a real app, this would be a loaded registry)
const DIALOGUE_REGISTRY: Record<string, any> = {
    [DIALOGUE_ANCHOR.id]: DIALOGUE_ANCHOR
};

/**
 * Handles narrative progression triggered by entity interaction.
 * Call this from InteractionSystem when a player interacts with an entity.
 */
export const handleInteractionNarrative = (targetEntity: any) => {
    const { startDialogue } = useDialogueStore.getState();
    const { updateObjective, activeQuestId, quests } = useQuestStore.getState();

    // 1. Dialogue Trigger
    if (targetEntity.dialogueId) {
        const tree = DIALOGUE_REGISTRY[targetEntity.dialogueId];
        if (tree) {
            startDialogue(tree);
        } else {
            console.warn(`Dialogue Tree not found for ID: ${targetEntity.dialogueId}`);
        }
    }

    // 2. Quest Objective Trigger (TALK type)
    if (targetEntity.questTargetId && activeQuestId) {
        const activeQuest = quests[activeQuestId];
        
        if (activeQuest && activeQuest.status === "ACTIVE") {
            // Find objectives matching this target
            const matchingObjectives = activeQuest.objectives.filter(
                obj => (obj.type === "TALK" || obj.type === "EXPLORE") && obj.targetId === targetEntity.questTargetId
            );

            matchingObjectives.forEach(obj => {
                if (obj.current < obj.count) {
                    updateObjective(activeQuestId, obj.id, 1);
                }
            });
        }
    }
};