import { useQuestStore } from "../../features/narrative/QuestManager";
import { QUEST_INTO_DEPTHS } from "../../features/narrative/Content";
import { createMinion } from "../factories/createMinion";
import { world } from "../World";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";

export const QuestSystem = (scene: Scene) => {
    const { quests, addQuest, startQuest } = useQuestStore.getState();
    const awakening = quests["quest_awakening"];

    if (awakening && awakening.status === "COMPLETED") {
        // 1. Minion Spawn Logic
        const hasMinion = world.with("isMinion").first;
        if (!hasMinion) {
            const player = world.with("isPlayer", "position", "mesh").first;
            if (player && player.position && player.mesh) {
                console.log("Quest Complete: Spawning Minion!");
                const spawnPos = player.position.clone().add(new Vector3(2, 0, 0));
                createMinion(scene, spawnPos, player.mesh.uniqueId);
            }
        }

        // 2. Chain Quest Logic
        if (!quests["quest_into_depths"]) {
            console.log("Starting Quest 2: Into the Depths");
            addQuest(QUEST_INTO_DEPTHS);
            startQuest(QUEST_INTO_DEPTHS.id);
        }
    }
};
