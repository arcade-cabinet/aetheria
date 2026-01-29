import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { world } from "../World";

export const MinionSystem = () => {
    // 1. Find Player
    const player = world.with("isPlayer", "position").first;
    if (!player || !player.position) return;

    // 2. Update Minions
    for (const minion of world.with("isMinion", "physics", "position", "moveSpeed", "aiState")) {
        if (!minion.mesh) continue;

        // Simple State Machine
        switch (minion.aiState) {
            case "FOLLOW":
                // Distance to player
                const dist = Vector3.Distance(minion.position, player.position);
                const stopDist = 2.5;

                if (dist > stopDist) {
                    // Move towards player
                    const direction = player.position.subtract(minion.position).normalize();
                    const velocity = direction.scale(minion.moveSpeed);
                    
                    // Apply velocity (keep Y for gravity)
                    const currentVel = minion.physics.body.getLinearVelocity();
                    minion.physics.body.setLinearVelocity(new Vector3(velocity.x, currentVel.y, velocity.z));

                    // Look at player
                    minion.mesh.lookAt(new Vector3(player.position.x, minion.position.y, player.position.z));
                } else {
                    // Stop
                    const currentVel = minion.physics.body.getLinearVelocity();
                    minion.physics.body.setLinearVelocity(new Vector3(0, currentVel.y, 0));
                }
                break;
            
            case "ATTACK":
                // Future: Move to targetEntityId
                break;
        }
    }
};
