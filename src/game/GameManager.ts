import { world } from "../ecs/World";
import { LayoutGenerator } from "../features/gen/LayoutGenerator";
import { createPlayer } from "../ecs/factories/createPlayer";
import { initPhysics, getPhysicsWorld } from "../ecs/systems/PhysicsSystem";
import RAPIER from "@dimforge/rapier3d-compat";

export const GameManager = {
    init: async () => {
        console.log("Initializing Production Game World...");
        
        // 1. Initialize Physics Engine
        await initPhysics();
        const pw = getPhysicsWorld();

        // 2. Generate Starting Town
        const layout = LayoutGenerator.generateChunk(0, 0, 50);
        
        layout.forEach(item => {
            // Create Rigid Body for Static Objects (Collisions)
            const bodyDesc = RAPIER.RigidBodyDesc.fixed()
                .setTranslation(item.position.x, item.position.y, item.position.z);
            const body = pw.createRigidBody(bodyDesc);
            
            // Assume 2x2x2 block for Floor_Brick etc.
            // In a full production game, we would query the asset's bounding box.
            const colDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1); 
            pw.createCollider(colDesc, body);

            world.add({
                assetId: item.assetId,
                position: item.position,
                rotation: item.rotation,
                physicsBody: body,
                isStatic: item.isStatic
            });
        });

        // 3. Create Player
        createPlayer(world);
    }
};
