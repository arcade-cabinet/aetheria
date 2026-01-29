import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PhysicsMotionType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { world } from "../World";

const SETTLING_Y_THRESHOLD = 5;
const SETTLING_VELOCITY_THRESHOLD = 0.1;

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

		if (
			entity.mesh.position.y < SETTLING_Y_THRESHOLD &&
			_velocity.length() < SETTLING_VELOCITY_THRESHOLD
		) {
			// Lock it
			body.setMotionType(PhysicsMotionType.STATIC);

			body.setLinearVelocity(Vector3.Zero());
			body.setAngularVelocity(Vector3.Zero());

			entity.mesh.freezeWorldMatrix();

			entity.assemblerState = "LOCKED";

			// Removed console.log
		}
	}
};
