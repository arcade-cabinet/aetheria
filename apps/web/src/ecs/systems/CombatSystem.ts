import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Ray } from "@babylonjs/core/Culling/ray";
import { world } from "../World";

let attackPressed = false;
window.addEventListener("mousedown", (e) => {
    if (e.button === 0) attackPressed = true; // Left Click
});
window.addEventListener("mouseup", (e) => {
    if (e.button === 0) attackPressed = false;
});

// Cooldown state map (entityId -> timestamp)
const lastAttackTime = new Map<number, number>();

export const CombatSystem = (scene: import("@babylonjs/core/scene").Scene) => {
    const now = Date.now();
    const player = world.with("isPlayer", "mesh", "damage").first;

    if (player && player.mesh && attackPressed) {
        const last = lastAttackTime.get(player.mesh.uniqueId) || 0;
        const cooldown = 500; // 0.5s attack speed

        if (now - last > cooldown) {
            // Perform Attack
            lastAttackTime.set(player.mesh.uniqueId, now);
            
            // Visual: Trigger animation (TODO)
            // Logic: Raycast/SphereCast
            const origin = player.mesh.position.clone();
            origin.y += 0.5;
            const forward = player.mesh.forward;
            const ray = new Ray(origin, forward, 2.5); // Range

            const hit = scene.pickWithRay(ray, (mesh) => {
                return mesh !== player.mesh && !mesh.isAnInstance; 
            });

            if (hit && hit.pickedMesh) {
                // Find Target Entity
                for (const target of world.with("health")) {
                    if (target.mesh === hit.pickedMesh || target.mesh === hit.pickedMesh.parent) {
                        // Deal Damage
                        const dmg = player.damage || 5;
                        target.health = Math.max(0, target.health - dmg);
                        console.log(`Hit ${target.assetId} for ${dmg} dmg. Health: ${target.health}`);
                        
                        // Spawn Damage Text
                        world.add({
                            isDamageText: true,
                            text: `-${dmg}`,
                            position: target.mesh.absolutePosition.clone().add(new Vector3(0, 2, 0)),
                            lifetime: 1000 // 1 second
                        });

                        // Pushback effect
                        if (target.physics) {
                            const force = forward.scale(500); // Impulse
                            target.physics.body.applyImpulse(force, target.mesh.absolutePosition);
                        }
                        break;
                    }
                }
            }
        }
    }
};
