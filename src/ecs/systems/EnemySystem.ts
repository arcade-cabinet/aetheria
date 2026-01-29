import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { world } from "../World";

export const EnemySystem = () => {
    // 1. Find Potential Targets (Player and Minions)
    const targets = [
        ...world.with("isPlayer", "position").entities,
        ...world.with("isMinion", "position").entities
    ];

    // 2. Update Enemies
    for (const enemy of world.with("isEnemy", "physics", "position", "moveSpeed", "aiState")) {
        if (!enemy.mesh) continue;

        // Simple State Machine
        let closestTarget = null;
        let closestDist = Infinity;

        // Find closest target
        for (const target of targets) {
            if (!target.position) continue;
            const dist = Vector3.Distance(enemy.position, target.position);
            if (dist < closestDist) {
                closestDist = dist;
                closestTarget = target;
            }
        }

        // Logic
        if (closestTarget && closestDist < (enemy.detectionRange || 15)) {
            enemy.aiState = "CHASE";
            
            if (closestDist > (enemy.attackRange || 2)) {
                // Chase
                const direction = closestTarget.position!.subtract(enemy.position).normalize();
                const velocity = direction.scale(enemy.moveSpeed);
                
                const currentVel = enemy.physics.body.getLinearVelocity();
                enemy.physics.body.setLinearVelocity(new Vector3(velocity.x, currentVel.y, velocity.z));
                
                enemy.mesh.lookAt(new Vector3(closestTarget.position!.x, enemy.position.y, closestTarget.position!.z));
            } else {
                // Attack (Placeholder: Stop and maybe trigger animation later)
                const currentVel = enemy.physics.body.getLinearVelocity();
                enemy.physics.body.setLinearVelocity(new Vector3(0, currentVel.y, 0));
                
                // TODO: Deal Damage logic
                // if (cooldownReady) target.health -= enemy.damage;
            }
        } else {
            enemy.aiState = "IDLE";
            // Stop
            const currentVel = enemy.physics.body.getLinearVelocity();
            enemy.physics.body.setLinearVelocity(new Vector3(0, currentVel.y, 0));
        }
    }
};
