import { useQuestStore } from "../narrative/QuestManager";
import { worldDB } from "./SqliteDatabase";

export const PersistenceManager = {
    async init() {
        console.log("Initializing Persistence...");
        
        // 1. Hydrate Quests
        const questData = await worldDB.getGameState("quests");
        if (questData) {
            useQuestStore.setState({ 
                quests: questData.quests, 
                activeQuestId: questData.activeQuestId 
            });
            console.log("Quests hydrated");
        }

        // 2. Subscribe to Quest Changes (Auto-Save)
        useQuestStore.subscribe((state) => {
            worldDB.saveGameState("quests", {
                quests: state.quests,
                activeQuestId: state.activeQuestId
            });
        });
    }
};
