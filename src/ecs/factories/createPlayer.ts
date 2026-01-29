import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Scene } from "@babylonjs/core/scene";
import { type Entity, world } from "../World";
import { assetRegistry } from "../AssetRegistry";
import type { CharacterClass } from "../../game/Classes";

export const createPlayer = (scene: Scene, position: Vector3, config?: CharacterClass): Entity => {
    const assetId = config?.assetId || "BaseCharacter";
    const stats = config?.stats || { strength: 5, dexterity: 5, intelligence: 5, vitality: 5 };

	// 1. Collider (Invisible Capsule)
	const collider = MeshBuilder.CreateCapsule(
		"player_collider",
		{ height: 1.8, radius: 0.3 },
		scene,
	);
	collider.position.copyFrom(position);
	collider.visibility = 0; // Invisible

	// 2. Visuals (Asset)
	const visual = assetRegistry.instantiate(assetId);
	if (visual) {
		visual.parent = collider;
		visual.scaling.setAll(0.45); // Scale correction (4.0 -> ~1.8m)
		visual.position.y = -0.9; // Offset to match capsule bottom (1.8/2 = 0.9)
		visual.rotationQuaternion = Quaternion.Identity();
	} else {
        // Fallback visual
        const debug = MeshBuilder.CreateCylinder("debug_player", { height: 1.8, diameter: 0.5 }, scene);
        debug.parent = collider;
    }

	// Physics (Capsule)
	const physics = new PhysicsAggregate(
		collider,
		PhysicsShapeType.CAPSULE,
		{ mass: 80, restitution: 0.0, friction: 0.0 },
		scene,
	);

	// Lock rotation to prevent tipping over (Character Controller behavior)
	physics.body.setMassProperties({
		inertia: new Vector3(0, 0, 0),
	});

    // Calculate Max Health from Vitality
    const maxHealth = 50 + (stats.vitality * 10);

	const entity = world.add({
		mesh: collider,
		physics,
		isPlayer: true,
		position: new Vector3().copyFrom(position),
		velocity: new Vector3(0, 0, 0),
        inventory: [],
        health: maxHealth,
        maxHealth: maxHealth,
        damage: stats.strength * 2
	});

	return entity;
};