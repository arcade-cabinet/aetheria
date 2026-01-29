import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PhysicsMotionType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { world } from "../World";
import { spawnImpactDust } from "../../features/fx/ImpactFX";
import * as Tone from "tone";

// Adjusted threshold for stability
const SETTLING_VELOCITY_THRESHOLD = 0.05;

const _velocity = new Vector3();

// Simple procedural synth for impacts
const impactSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
}).toDestination();

export const AssemblerSystem = (scene: import("@babylonjs/core/scene").Scene) => {
	// Query only Falling blocks
	for (const entity of world.with("isBlock", "physics", "assemblerState")) {
		if (entity.assemblerState !== "FALLING") continue;

		const body = entity.physics.body;

		// Use reusable vector
		body.getLinearVelocityToRef(_velocity);

		// Ensure we have a mesh
		if (!entity.mesh) continue;

		// Logic: If velocity is near zero, it has landed or is balanced.
		if (_velocity.length() < SETTLING_VELOCITY_THRESHOLD) {
			// Lock it
			body.setMotionType(PhysicsMotionType.STATIC);

			body.setLinearVelocity(Vector3.Zero());
			body.setAngularVelocity(Vector3.Zero());

			entity.mesh.freezeWorldMatrix();

			entity.assemblerState = "LOCKED";

            // Visual Juice
            spawnImpactDust(scene, entity.mesh.position);

            // Audio Juice (Procedural Thud)
            if (Tone.context.state === "running") {
                impactSynth.triggerAttackRelease("G1", "16n");
            }
		}
	}
};