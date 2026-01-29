import { useQuestStore } from "../narrative/QuestManager";
import { worldDB } from "./SqliteDatabase";
import { world } from "../../ecs/World";

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

