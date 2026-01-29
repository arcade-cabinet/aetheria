import { describe, it, expect, beforeEach } from "vitest";
import { useQuestStore } from "../../features/narrative/QuestManager";
import type { Quest } from "../../game/schema/GameSchema";

const TEST_QUEST: Quest = {
    id: "test_quest",
    title: "Test Quest",
    description: "A quest for testing.",
    requiredLevel: 1,
    objectives: [
        {
            id: "obj_1",
            description: "Do thing",
            type: "TALK",
            targetId: "npc_1",
            count: 2,
            current: 0,
            isOptional: false
        }
    ],
    rewards: { xp: 100, gold: 0, unlocksMinion: false },
    status: "LOCKED"
};

describe("QuestManager", () => {
    beforeEach(() => {
        useQuestStore.setState({ quests: {}, activeQuestId: null });
    });

    it("adds a quest", () => {
        const { addQuest } = useQuestStore.getState();
        addQuest(TEST_QUEST);
        expect(useQuestStore.getState().quests["test_quest"]).toBeDefined();
    });

    it("starts a quest", () => {
        const { addQuest, startQuest } = useQuestStore.getState();
        addQuest(TEST_QUEST);
        startQuest("test_quest");
        
        expect(useQuestStore.getState().activeQuestId).toBe("test_quest");
        expect(useQuestStore.getState().quests["test_quest"].status).toBe("ACTIVE");
    });

    it("updates objective progress", () => {
        const { addQuest, startQuest, updateObjective } = useQuestStore.getState();
        addQuest(TEST_QUEST);
        startQuest("test_quest");
        
        updateObjective("test_quest", "obj_1", 1);
        
        const quest = useQuestStore.getState().quests["test_quest"];
        expect(quest.objectives[0].current).toBe(1);
    });

    it("completes a quest manually", () => {
        const { addQuest, startQuest, completeQuest } = useQuestStore.getState();
        addQuest(TEST_QUEST);
        startQuest("test_quest");
        
        completeQuest("test_quest");
        
        expect(useQuestStore.getState().quests["test_quest"].status).toBe("COMPLETED");
        expect(useQuestStore.getState().activeQuestId).toBeNull();
    });
});
