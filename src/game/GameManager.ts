import { world } from "../ecs/World";
import { LayoutGenerator } from "../features/gen/LayoutGenerator";
import { createPlayer } from "../ecs/factories/createPlayer";

export const GameManager = {
    init: () => {
        console.log("Initializing Game World...");
        
        // 1. Generate Starting Town (Chunk 0,0)
        const layout = LayoutGenerator.generateChunk(0, 0, 50); // Size 50?
        
        layout.forEach(item => {
            world.add({
                assetId: item.assetId,
                position: item.position, // Yuka Vector3
                rotation: item.rotation,
                isStatic: item.isStatic
            });
        });

        // 2. Create Player
        createPlayer(world); // Make sure createPlayer uses Yuka
    }
};
