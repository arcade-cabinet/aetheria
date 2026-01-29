import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PhysicsMotionType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { world } from "../World";

import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PhysicsMotionType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { world } from "../World";

// Adjusted threshold for stability
const SETTLING_VELOCITY_THRESHOLD = 0.05;

const _velocity = new Vector3();

export const AssemblerSystem = () => {
	// Query only Falling blocks
	for (const entity of world.with("isBlock", "physics", "assemblerState")) {
		if (entity.assemblerState !== "FALLING") continue;

		const body = entity.physics.body;

		// Use reusable vector
		body.getLinearVelocityToRef(_velocity);

		// Ensure we have a mesh
		if (!entity.mesh) continue;

		// Logic: If velocity is near zero, it has landed or is balanced.
        // We remove the Y threshold check because chunks can be at any height.
		if (_velocity.length() < SETTLING_VELOCITY_THRESHOLD) {
			// Lock it
			body.setMotionType(PhysicsMotionType.STATIC);

			body.setLinearVelocity(Vector3.Zero());
			body.setAngularVelocity(Vector3.Zero());

			entity.mesh.freezeWorldMatrix();

			entity.assemblerState = "LOCKED";
		}
	}
};
