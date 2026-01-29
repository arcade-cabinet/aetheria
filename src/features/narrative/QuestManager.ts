import { create } from "zustand";
import type { Quest } from "../../game/schema/GameSchema";

interface QuestState {
    quests: Record<string, Quest>;
    activeQuestId: string | null;
    
    // Actions
    addQuest: (quest: Quest) => void;
    startQuest: (questId: string) => void;
    updateObjective: (questId: string, objectiveId: string, amount: number) => void;
    completeQuest: (questId: string) => void;
}

export const useQuestStore = create<QuestState>((set) => ({
    quests: {},
    activeQuestId: null,

    addQuest: (quest) => set((state) => ({
        quests: { ...state.quests, [quest.id]: quest }
    })),

    startQuest: (questId) => set((state) => {
        const quest = state.quests[questId];
        if (!quest) return state;
        return {
            quests: {
                ...state.quests,
                [questId]: { ...quest, status: "ACTIVE" }
            },
            activeQuestId: questId
        };
    }),

    updateObjective: (questId, objectiveId, amount) => set((state) => {
        const quest = state.quests[questId];
        if (!quest || quest.status !== "ACTIVE") return state;

        const updatedObjectives = quest.objectives.map(obj => {
            if (obj.id === objectiveId) {
                const newCurrent = Math.min(obj.current + amount, obj.count);
                return { ...obj, current: newCurrent };
            }
            return obj;
        });

        // Check completion (Future logic: trigger event or wait for interaction)
        
        return {
            quests: {
                ...state.quests,
                [questId]: { ...quest, objectives: updatedObjectives }
            }
        };
    }),

    completeQuest: (questId) => set((state) => {
        const quest = state.quests[questId];
        if (!quest) return state;
        
        return {
            quests: {
                ...state.quests,
                [questId]: { ...quest, status: "COMPLETED" }
            },
            activeQuestId: state.activeQuestId === questId ? null : state.activeQuestId
        };
    })
}));
