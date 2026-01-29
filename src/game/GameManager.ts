import { world } from "../ecs/World";
import { createPlayer } from "../ecs/factories/createPlayer";
import { initPhysics } from "../ecs/systems/PhysicsSystem";
import { chunkManager } from "../features/gen/ChunkManager";
import { Vector3 } from "yuka";
import { createEnemy } from "../ecs/factories/createEnemy";
import { createMinion } from "../ecs/factories/createMinion";

export const GameManager = {
    init: async () => {
        console.log("Initializing Production Game World...");
        
        // 1. Initialize Physics Engine
        await initPhysics();

        // 2. Create Player
        const player = createPlayer(world);

        // 3. Initial Chunk Load
        await chunkManager.update(player.position!);

        // 4. Create Initial Minion
        createMinion(world, new Vector3(2, 5, 2), player.id);

        // 5. Create Enemy (Static test enemy)
        createEnemy(world, new Vector3(5, 5, 5));

        // 6. Create Test Loot (Potion)
        // ... (removed static loot, chunks handle it)
    }
};
