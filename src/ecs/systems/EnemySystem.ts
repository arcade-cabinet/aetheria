import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { world } from "../World";

// Cooldowns
const lastEnemyAttack = new Map<number, number>();

export const EnemySystem = () => {
    const now = Date.now();

    // 1. Find Potential Targets (Player and Minions)
    const targets = [
        ...world.with("isPlayer", "position", "health").entities,
        ...world.with("isMinion", "position", "health").entities
    ];

    // 2. Update Enemies
    for (const enemy of world.with("isEnemy", "physics", "position", "moveSpeed", "aiState")) {
        if (!enemy.mesh || !enemy.damage) continue;

        // ... (Targeting Logic) ...
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
                // Attack
                const currentVel = enemy.physics.body.getLinearVelocity();
                enemy.physics.body.setLinearVelocity(new Vector3(0, currentVel.y, 0));
                
                // Damage Logic
                const last = lastEnemyAttack.get(enemy.mesh.uniqueId) || 0;
                if (now - last > 1500) { // 1.5s cooldown
                    lastEnemyAttack.set(enemy.mesh.uniqueId, now);
                    closestTarget.health = Math.max(0, closestTarget.health - enemy.damage);
                    console.log(`Enemy hit target for ${enemy.damage}. Health: ${closestTarget.health}`);
                }
            }
        } else {
            enemy.aiState = "IDLE";
            // Stop
            const currentVel = enemy.physics.body.getLinearVelocity();
            enemy.physics.body.setLinearVelocity(new Vector3(0, currentVel.y, 0));
        }
    }
};
