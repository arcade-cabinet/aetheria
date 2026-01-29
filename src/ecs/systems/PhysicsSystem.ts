import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { IPhysicsCollisionEvent } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { world } from "../World";

const registeredBodies = new WeakSet<any>();

export const PhysicsSystem = () => {
	// Query entities that have both a physics body and a mesh
	for (const entity of world.with("physics", "mesh")) {
		// Sync Mesh Position -> Entity Logic Position
		if (!entity.position) {
			entity.position = new Vector3();
		}
		entity.position.copyFrom(entity.mesh.position);

        // Register Collision Logic (One-time)
        if (!registeredBodies.has(entity.physics.body)) {
            registeredBodies.add(entity.physics.body);
            
            // If entity is Player, listen for collisions
            if (entity.isPlayer) {
                const observable = entity.physics.body.getCollisionObservable();
                if (observable) {
                    observable.add((event: IPhysicsCollisionEvent) => {
                        // Check if other body is a Hazard
                        const otherMesh = event.collidedAgainst.transformNode;
                        if (otherMesh && otherMesh.metadata && otherMesh.metadata.isHazard) {
                            if (entity.health !== undefined && !entity.isDead) {
                                const damage = otherMesh.metadata.damage || 10;
                                // Simple debounce or cooldown? 
                                // For now, continuous collision might kill instantly. 
                                // We rely on Havok events being discrete or rapid.
                                // Ideally we add an invulnerability timer.
                                entity.health -= damage;
                                console.log(`Player took ${damage} damage! Health: ${entity.health}`);
                            }
                        }
                    });
                }
            }
        }
	}
};
