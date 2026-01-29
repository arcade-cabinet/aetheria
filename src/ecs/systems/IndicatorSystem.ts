import { world } from "../World";
import { useQuestStore } from "../../features/narrative/QuestManager";

export const IndicatorSystem = () => {
    const { quests, activeQuestId } = useQuestStore.getState();

    for (const entity of world.with("isInteractable", "dialogueId")) {
        // 1. Check if NPC has an available quest
        // (Simplified: if dialogueId matches a quest root and quest not started)
        
        // 2. Check if NPC is the target of active quest
        if (activeQuestId && entity.questTargetId) {
            const activeQuest = quests[activeQuestId];
            if (activeQuest.objectives.some(o => o.id === entity.questTargetId && o.current < o.count)) {
                entity.indicatorType = "QUEST_TARGET";
            } else {
                entity.indicatorType = undefined;
            }
        }
    }
};
