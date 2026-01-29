import { world } from "../World";
import { useQuestStore } from "../../features/narrative/QuestManager";
import { spawnDamageText } from "./DamageTextSystem";
import { createMinion } from "../factories/createMinion";
import { Vector3 } from "yuka";

export const QuestSystem = () => {
    // 1. Monitor active quest for completion
    const { activeQuestId, quests, completeQuest, startQuest } = useQuestStore.getState();
    
    if (activeQuestId) {
        const quest = quests[activeQuestId];
        const allComplete = quest.objectives.every(o => o.current >= o.count);
        
        if (allComplete && quest.status === "ACTIVE") {
            // Quest logic completion
            // We usually wait for the user to "turn in" but some quests are auto-complete
            // For now, let's trigger rewards when all objectives met
            handleQuestRewards(quest);
            completeQuest(activeQuestId);
            
            // Advance Chain
            advanceQuestChain(quest.id);
        }
    }
};

const handleQuestRewards = (quest: any) => {
    const player = world.with("isPlayer", "xp").first;
    if (!player) return;

    console.log(`Quest Complete: ${quest.title}. Awarding rewards.`);
    
    // 1. XP
    if (quest.rewards.xp) {
        player.xp += quest.rewards.xp;
        spawnDamageText(`+${quest.rewards.xp} XP`, player.position);
    }

    // 2. Unlocks (e.g. Minion)
    if (quest.rewards.unlocksMinion) {
        console.log("Unlocking Minion...");
        createMinion(world, new Vector3(player.position.x + 2, 5, player.position.z + 2), player.id);
        spawnDamageText("Minion Unlocked", player.position);
    }
};

const advanceQuestChain = (completedId: string) => {
    const { startQuest } = useQuestStore.getState();
    
    if (completedId === "quest_awakening") {
        startQuest("quest_into_depths");
    } else if (completedId === "quest_into_depths") {
        startQuest("quest_void_gate");
    }
};

// Event listener for Dialogue triggers
export const handleNarrativeTrigger = (trigger: string) => {
    const { activeQuestId, quests, updateObjective } = useQuestStore.getState();
    
    console.log(`Narrative Trigger: ${trigger}`);

    if (trigger === "COMPLETE_QUEST_AWAKENING") {
        if (activeQuestId === "quest_awakening") {
            // Force complete objective
            updateObjective("quest_awakening", "obj_find_anchor", 1);
        }
    }
    
    if (trigger === "COMPLETE_QUEST_INTO_DEPTHS") {
        if (activeQuestId === "quest_into_depths") {
            updateObjective("quest_into_depths", "obj_find_altar", 1);
        }
    }
};
