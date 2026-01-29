import { world } from "../ecs/World";
import { createPlayer } from "../ecs/factories/createPlayer";
import { createEnemy } from "../ecs/factories/createEnemy";
import { initPhysics, getPhysicsWorld } from "../ecs/systems/PhysicsSystem";
import RAPIER from "@dimforge/rapier3d-compat";
import { Vector3 } from "yuka";

export const TestbedManager = {
    init: async () => {
        console.log("Initializing TESTBED (Deterministic Diorama)...");
        
        // 1. Reset World (Naive clear for now)
        world.entities.forEach(e => world.remove(e));
        
        // 2. Physics
        await initPhysics();
        const pw = getPhysicsWorld();

        // 3. Static Environment (The Stage)
        // Floor 20x20
        const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0);
        const floorBody = pw.createRigidBody(floorBodyDesc);
        const floorCol = RAPIER.ColliderDesc.cuboid(10, 1, 10);
        pw.createCollider(floorCol, floorBody);

        world.add({
            assetId: "Floor_Brick", // We need a 20x20 scaled asset or tile it. For now, one tile scaled?
            // Actually, let's just use the logic floor and verify movement.
            // Visuals might look small if using 2x2 tile.
            position: new Vector3(0, -1, 0),
            physicsBody: floorBody,
            isStatic: true
        });

        // 4. Test Case A: Interaction (The Chest) at (-5, 0, 0)
        const chestBody = pw.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(-5, 0, 0));
        pw.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), chestBody);
        
        world.add({
            assetId: "Chest_Wood",
            position: new Vector3(-5, 0, 0),
            physicsBody: chestBody,
            isInteractable: true,
            interactableType: "PICKUP",
            interactionRange: 2,
            // Debug Marker
            text: "LOOT ME"
        });

        // 5. Test Case B: Combat (The Dummy) at (5, 0, 0)
        const enemy = createEnemy(world, new Vector3(5, 0, 0));
        enemy.aiState = "IDLE"; // Passive dummy
        enemy.health = 1000; // Tanky

        // 6. Player at Origin
        createPlayer(world);
        
        console.log("TESTBED Ready.");
    }
};
