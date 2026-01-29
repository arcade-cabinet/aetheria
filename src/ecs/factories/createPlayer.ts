import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Scene } from "@babylonjs/core/scene";
import { assetRegistry } from "../AssetRegistry";
import { type Entity, world } from "../World";

export const createPlayer = (scene: Scene, position: Vector3): Entity => {
	// 1. Collider (Invisible Capsule)
	// Height 1.8m (more realistic), Radius 0.3m
	const collider = MeshBuilder.CreateCapsule(
		"player_collider",
		{ height: 1.8, radius: 0.3 },
		scene,
	);
	collider.position.copyFrom(position);
	collider.visibility = 0.2; // Semi-transparent for debug, or 0 for invisible

	// 2. Visuals (Asset)
	const visual = assetRegistry.instantiate("BaseCharacter");
	if (visual) {
		visual.parent = collider;
		visual.scaling.setAll(0.45); // Scale correction (4.0 -> ~1.8m)
		visual.position.y = -0.9; // Offset to match capsule bottom (1.8/2 = 0.9)
		visual.rotationQuaternion = Quaternion.Identity();
	}

	// Physics (Capsule)
	// Mass 80kg
	const physics = new PhysicsAggregate(
		collider,
		PhysicsShapeType.CAPSULE,
		{ mass: 80, restitution: 0.0, friction: 0.0 }, // Friction 0 to prevent sticking to walls
		scene,
	);

	// Lock rotation to prevent tipping over (Character Controller behavior)
	physics.body.setMassProperties({
		inertia: new Vector3(0, 0, 0),
	});

	const entity = world.add({
		mesh: collider,
		physics,
		isPlayer: true,
		position: new Vector3().copyFrom(position),
		velocity: new Vector3(0, 0, 0),
	});

	return entity;
};
