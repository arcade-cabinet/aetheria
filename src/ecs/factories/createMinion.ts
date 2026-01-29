import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Scene } from "@babylonjs/core/scene";
import { type Entity, world } from "../World";
import { assetRegistry } from "../AssetRegistry";

export const createMinion = (scene: Scene, position: Vector3, ownerId: number): Entity => {
    const assetId = "Skeleton_Minion";

    // 1. Collider
    const collider = MeshBuilder.CreateCapsule(
        "minion_collider",
        { height: 1.5, radius: 0.25 },
        scene,
    );
    collider.position.copyFrom(position);
    collider.visibility = 0;

    // 2. Visuals
    const visual = assetRegistry.instantiate(assetId);
    if (visual) {
        visual.parent = collider;
        visual.scaling.setAll(0.4); // Slightly smaller than player
        visual.position.y = -0.75;
        visual.rotationQuaternion = Quaternion.Identity();
    } else {
        const debug = MeshBuilder.CreateCylinder("debug_minion", { height: 1.5, diameter: 0.4 }, scene);
        debug.parent = collider;
    }

    // 3. Physics
    const physics = new PhysicsAggregate(
        collider,
        PhysicsShapeType.CAPSULE,
        { mass: 60, restitution: 0.0, friction: 0.0 },
        scene,
    );
    physics.body.setMassProperties({ inertia: new Vector3(0, 0, 0) });

    const entity = world.add({
        mesh: collider,
        physics,
        isMinion: true,
        ownerId,
        aiState: "FOLLOW",
        moveSpeed: 4, // Slightly slower than player
        detectionRange: 10,
        attackRange: 2,
        health: 30,
        maxHealth: 30,
        damage: 5,
        position: new Vector3().copyFrom(position),
        velocity: new Vector3(0, 0, 0)
    });

    return entity;
};
