import { createEnemy } from "../ecs/factories/createEnemy";
import { createMinion } from "../ecs/factories/createMinion";
import { Vector3 } from "yuka";

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
        const player = createPlayer(world);

        // 4. Create Minion (if unlocked? For test: yes)
        createMinion(world, new Vector3(2, 5, 2), player.id);

        // 5. Create Enemy
        createEnemy(world, new Vector3(5, 5, 5));
    }
};
