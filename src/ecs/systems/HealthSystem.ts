import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { world } from "../World";

export const HealthSystem = () => {
    for (const entity of world.with("health", "maxHealth")) {
        // Death Check
        if (entity.health! <= 0 && !entity.isDead) {
            entity.isDead = true;
            
            if (entity.isPlayer) {
                console.log("Player Died! Respawning...");
                // Simple Respawn Logic
                if (entity.physics) {
                    // Reset Physics
                    entity.physics.body.setTargetTransform(new Vector3(0, 10, 0), Quaternion.Identity());
                    entity.physics.body.setLinearVelocity(new Vector3(0, 0, 0));
                    entity.physics.body.setAngularVelocity(new Vector3(0, 0, 0));
                }
                // Reset State
                entity.health = entity.maxHealth;
                entity.isDead = false;
                // Maybe clear inventory? Nah, be nice.
            } else {
                // Destroy NPC/Object
                world.remove(entity);
                if (entity.mesh) entity.mesh.dispose();
                if (entity.physics) entity.physics.dispose();
            }
        }
    }
};
