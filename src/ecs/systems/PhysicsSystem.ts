import { world } from "../World";
import { Vector3 } from "yuka"; // Use Yuka vectors for math

// Shim for Babylon Physics Body used in Logic
class PhysicsBody {
    velocity = new Vector3();
    position = new Vector3(); // Ref to entity pos

    constructor(positionRef: Vector3) {
        this.position = positionRef;
    }

    setLinearVelocity(v: any) {
        this.velocity.set(v.x, v.y, v.z);
    }
    getLinearVelocity() {
        return this.velocity; // Return ref or clone? Babylon returns ref usually or takes ref
        // For compatibility with logic: const v = body.getLinearVelocity();
        // Logic expects Babylon Vector3.
        // We refactored logic to be engine agnostic? Not yet for Systems.
        // Systems import @babylonjs/core.
        // We need to refactor Systems to use Yuka vectors too.
        return { x: this.velocity.x, y: this.velocity.y, z: this.velocity.z }; 
    }
    applyImpulse(force: any, contact: any) {
        // Simple impulse: vel += force / mass (assume mass 1 for now)
        this.velocity.x += force.x * 0.1;
        this.velocity.y += force.y * 0.1;
        this.velocity.z += force.z * 0.1;
    }
    setMassProperties() {}
}

export const PhysicsSystem = () => {
    const dt = 1/60;
    const gravity = -9.81;

    for (const entity of world.with("position", "velocity", "physics")) {
        // Apply Gravity
        if (entity.position.y > 0) { // Simple ground check
            entity.physics.body.velocity.y += gravity * dt;
        } else if (entity.position.y <= 0 && entity.physics.body.velocity.y < 0) {
             entity.physics.body.velocity.y = 0;
             entity.position.y = 0;
        }

        // Integrate
        entity.position.x += entity.physics.body.velocity.x * dt;
        entity.position.y += entity.physics.body.velocity.y * dt;
        entity.position.z += entity.physics.body.velocity.z * dt;

        // Sync Mesh (if using Filament model component that reads position)
        // React Native Filament usually updates via props.
        // We might need a "RenderSystem" to sync ECS pos to UI/View props.
    }
};

// We need to update World.ts to use this Physics shim instead of Havok
