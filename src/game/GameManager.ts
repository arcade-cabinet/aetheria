import { world } from "../ecs/World";
import { createPlayer } from "../ecs/factories/createPlayer";
import { initPhysics } from "../ecs/systems/PhysicsSystem";
import { chunkManager } from "../features/gen/ChunkManager";
import { Vector3 } from "yuka";
import { createEnemy } from "../ecs/factories/createEnemy";
import { createMinion } from "../ecs/factories/createMinion";
import { PersistenceManager } from "../features/persistence/PersistenceManager";

export const GameManager = {
    init: async () => {
        console.log("Initializing Production Game World...");
        
        // 1. Initialize Physics Engine
        await initPhysics();

        // 2. Load Persisted Player State
        const savedPlayer = await PersistenceManager.loadPlayerState();

        // 3. Create Player
        const player = createPlayer(world, savedPlayer);

        // 4. Initial Chunk Load
        await chunkManager.update(player.position!);

        // 5. Create Initial Minion
        createMinion(world, new Vector3(2, 5, 2), player.id);

        // 6. Create Enemy (Static test enemy)
        createEnemy(world, new Vector3(5, 5, 5));

        // 7. Setup Auto-Save (Every 30s)
        setInterval(() => {
            PersistenceManager.savePlayerState();
        }, 30000);
    }
};
