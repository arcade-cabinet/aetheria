import { Vector3 } from "yuka";
import { world } from "../World";

const _tempVec = new Vector3();

export const EnemySystem = () => {
    // 1. Find Player
    const player = world.with("isPlayer", "position").first;
    if (!player || !player.position) return;

    // 2. Update Enemies
    for (const enemy of world.with("isEnemy", "physicsBody", "position", "aiState")) {
        const body = enemy.physicsBody;
        const pos = enemy.position;
        
        // Distance to Player
        const dist = pos.distanceTo(player.position);

        // State Machine
        switch (enemy.aiState) {
            case "IDLE":
                if (dist < (enemy.detectionRange || 15)) {
                    enemy.aiState = "CHASE";
                }
                break;
            
            case "CHASE":
                if (dist > (enemy.detectionRange || 15) * 1.5) {
                    enemy.aiState = "IDLE";
                    body.setLinvel({ x: 0, y: body.linvel().y, z: 0 }, true);
                } else if (dist < (enemy.attackRange || 2)) {
                    enemy.aiState = "ATTACK";
                } else {
                    // Move towards player
                    _tempVec.copy(player.position).sub(pos).normalize();
                    const speed = enemy.moveSpeed || 3;
                    
                    // Apply Velocity (keep Y)
                    const curVel = body.linvel();
                    body.setLinvel({ 
                        x: _tempVec.x * speed, 
                        y: curVel.y, 
                        z: _tempVec.z * speed 
                    }, true);
                    
                    // Face Player (Rotation)
                    // Rapier doesn't handle rotation if locked?
                    // We can manually set rotation?
                    // Or let game renderer handle it based on velocity?
                    // Let's rely on RenderContext logic or simple lookAt if needed.
                }
                break;

            case "ATTACK":
                if (dist > (enemy.attackRange || 2)) {
                    enemy.aiState = "CHASE";
                } else {
                    // Attack Logic (Cooldown, Damage)
                    // For now, stop moving
                    body.setLinvel({ x: 0, y: body.linvel().y, z: 0 }, true);
                }
                break;
        }
    }
};
