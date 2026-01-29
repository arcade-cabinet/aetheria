import { Vector3 } from "yuka";
import { world } from "../World";

const _tempVec = new Vector3();

export const MinionSystem = () => {
    // 1. Find Owner (Player)
    const player = world.with("isPlayer", "position").first;
    if (!player || !player.position) return;

    for (const minion of world.with("isMinion", "physicsBody", "position", "aiState")) {
        const body = minion.physicsBody;
        const pos = minion.position;
        const dist = pos.distanceTo(player.position);

        // Simple Follow Logic
        if (dist > 4) {
            // Move
            _tempVec.copy(player.position).sub(pos).normalize();
            const speed = minion.moveSpeed || 4;
            
            const curVel = body.linvel();
            body.setLinvel({
                x: _tempVec.x * speed,
                y: curVel.y,
                z: _tempVec.z * speed
            }, true);
        } else {
            // Stop
            const curVel = body.linvel();
            body.setLinvel({ x: 0, y: curVel.y, z: 0 }, true);
        }
    }
};
