import type { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { World } from "miniplex";

export type Entity = {
	// Core
	mesh?: AbstractMesh;
	physics?: PhysicsAggregate;

	// State
	position?: Vector3; // For logic reference, though Mesh has it too
	velocity?: Vector3;

	// Tags
	isPlayer?: boolean;
	isGround?: boolean;
	isBlock?: boolean;

	// Assembler State
	assemblerState?: "FALLING" | "LOCKED";
	targetPosition?: Vector3; // Where it should ideally end up (for snapping)

    // Gameplay
    inventory?: string[];
    interactableType?: "PICKUP" | "INSPECT";
    assetId?: string;
};

export const world = new World<Entity>();
