import { useQuestStore } from "../../features/narrative/QuestManager";
import { useDialogueStore } from "../../features/narrative/DialogueManager";
import { DIALOGUE_ANCHOR, DIALOGUE_GUIDE } from "../../features/narrative/Content";
import { world } from "../World";

// Map of Dialogue IDs to Data (In a real app, this would be a loaded registry)
const DIALOGUE_REGISTRY: Record<string, any> = {
    [DIALOGUE_ANCHOR.id]: DIALOGUE_ANCHOR,
    [DIALOGUE_GUIDE.id]: DIALOGUE_GUIDE
};

/**
 * Handles narrative progression triggered by entity interaction.
 * Call this from InteractionSystem when a player interacts with an entity.
 */
export const handleInteractionNarrative = (targetEntity: any) => {
    // ... existing logic ...
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

export const NarrativeSystem = () => {
    // Update Indicators based on Active Quest
    const { activeQuestId, quests } = useQuestStore.getState();
    const activeQuest = activeQuestId ? quests[activeQuestId] : null;

    // 1. Clear old indicators (Naive approach: re-evaluate all)
    // In ECS, we query entities with narrative tags
    for (const entity of world.with("questTargetId")) {
        let newType: "QUEST_TARGET" | "INTERACT" | undefined = undefined;

        // Check if target for active quest
        if (activeQuest && activeQuest.status === "ACTIVE") {
            const isObjective = activeQuest.objectives.some(
                obj => obj.targetId === entity.questTargetId && obj.current < obj.count
            );
            if (isObjective) {
                newType = "QUEST_TARGET";
            }
        }

        // If not a quest target, but has dialogue, show interact?
        if (!newType && entity.dialogueId) {
            // Only show interact if close? Or always?
            // "..." icon usually helpful.
            newType = "INTERACT";
        }

        // Apply change
        if (entity.indicatorType !== newType) {
            // modifying component directly in miniplex triggers updates if using archetypes?
            // Miniplex requires re-adding component to trigger changes in archetypes if simple object?
            // But we are mutating the property.
            // Systems reading 'indicatorType' will see it.
            entity.indicatorType = newType;
        }
    }
};