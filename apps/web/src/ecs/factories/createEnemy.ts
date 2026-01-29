import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Scene } from "@babylonjs/core/scene";
import { type Entity, world } from "../World";
import { assetRegistry } from "../AssetRegistry";

export const createEnemy = (scene: Scene, position: Vector3, type: "Skeleton_Warrior" | "Skeleton_Rogue" = "Skeleton_Warrior"): Entity => {
    
    // 1. Collider
    const collider = MeshBuilder.CreateCapsule(
        "enemy_collider",
        { height: 1.8, radius: 0.3 },
        scene,
    );
    collider.position.copyFrom(position);
    collider.visibility = 0;

    // 2. Visuals
    const visual = assetRegistry.instantiate(type);
    if (visual) {
        visual.parent = collider;
        visual.scaling.setAll(0.45);
        visual.position.y = -0.9;
        visual.rotationQuaternion = Quaternion.Identity();
    } else {
        const debug = MeshBuilder.CreateBox("debug_enemy", { height: 1.8, width: 0.5, depth: 0.5 }, scene);
        debug.parent = collider;
    }

    // 3. Physics
    const physics = new PhysicsAggregate(
        collider,
        PhysicsShapeType.CAPSULE,
        { mass: 80, restitution: 0.0, friction: 0.0 },
        scene,
    );
    physics.body.setMassProperties({ inertia: new Vector3(0, 0, 0) });

    const entity = world.add({
        mesh: collider,
        physics,
        isEnemy: true,
        aiState: "IDLE",
        moveSpeed: 3.5,
        detectionRange: 15,
        attackRange: 2,
        health: 50,
        maxHealth: 50,
        damage: 10,
        position: new Vector3().copyFrom(position),
        velocity: new Vector3(0, 0, 0),
        assetId: type,
        interactableType: "INSPECT" // Maybe inspecting corpse later?
    });

    return entity;
};
