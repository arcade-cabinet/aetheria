import { useQuestStore } from "../narrative/QuestManager";
import { worldDB } from "./SqliteDatabase";
import { world } from "../../ecs/World";
import { QUEST_AWAKENING, QUEST_INTO_DEPTHS, QUEST_VOID_GATE } from "../narrative/Content";

export const PersistenceManager = {
    async init() {
        console.log("Initializing Persistence...");
        
        const store = useQuestStore.getState();

        // 1. Register all quests
        store.addQuest(QUEST_AWAKENING);
        store.addQuest(QUEST_INTO_DEPTHS);
        store.addQuest(QUEST_VOID_GATE);

        // 2. Hydrate Quests from DB
        const questData = await worldDB.getGameState("quests");
        if (questData) {
            useQuestStore.setState({ 
                quests: questData.quests, 
                activeQuestId: questData.activeQuestId 
            });
            console.log("Quests hydrated");
        } else {
            // Start first quest if fresh
            store.startQuest("quest_awakening");
        }

        // 3. Subscribe to Quest Changes (Auto-Save)
        useQuestStore.subscribe((state) => {
            worldDB.saveGameState("quests", {
                quests: state.quests,
                activeQuestId: state.activeQuestId
            });
        });
    },

    async savePlayerState() {
        const player = world.with("isPlayer", "health").first;
        if (!player) return;

        await worldDB.saveGameState("player", {
            level: player.level,
            xp: player.xp,
            targetXP: player.targetXP,
            health: player.health,
            maxHealth: player.maxHealth,
            inventory: player.inventory,
            equipment: player.equipment,
            baseStats: player.baseStats
        });
        console.log("Player State Saved");
    },

    async loadPlayerState() {
        return await worldDB.getGameState("player");
    }
};

