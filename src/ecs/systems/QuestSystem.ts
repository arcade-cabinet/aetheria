import { useQuestStore } from "../../features/narrative/QuestManager";
import { createMinion } from "../factories/createMinion";
import { world } from "../World";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";

export const QuestSystem = (scene: Scene) => {
    const { quests } = useQuestStore.getState();
    const awakening = quests["quest_awakening"];

    if (awakening && awakening.status === "COMPLETED") {
        // Check if minion exists
        const hasMinion = world.with("isMinion").first;
        
        if (!hasMinion) {
            // Find player to spawn nearby
            const player = world.with("isPlayer", "position", "mesh").first;
            if (player && player.position && player.mesh) {
                console.log("Quest Complete: Spawning Minion!");
                const spawnPos = player.position.clone().add(new Vector3(2, 0, 0));
                createMinion(scene, spawnPos, player.mesh.uniqueId);
            }
        }
    }
};
