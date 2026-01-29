import { Vector3, Quaternion } from "yuka";
import RAPIER from "@dimforge/rapier3d-compat";
import { type Entity, world } from "../World";
import { getPhysicsWorld } from "../systems/PhysicsSystem";

export const createMinion = (targetWorld: typeof world, position: Vector3, ownerId: number): Entity => {
    const pw = getPhysicsWorld();

    // 1. Physics Body (Dynamic)
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z)
        .lockRotations();

    const body = pw.createRigidBody(bodyDesc);

    // 2. Collider
    const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.25)
        .setFriction(0)
        .setRestitution(0);
    
    pw.createCollider(colliderDesc, body);

    // 3. Entity
    const entity = targetWorld.add({
        isMinion: true,
        assetId: "Skeleton_Minion",
        position: new Vector3().copy(position),
        rotation: new Quaternion(),
        velocity: new Vector3(0, 0, 0),
        physicsBody: body,
        
        // AI Stats
        ownerId,
        aiState: "FOLLOW",
        moveSpeed: 4,
        detectionRange: 10,
        attackRange: 2,
        
        // Stats
        health: 30,
        maxHealth: 30,
        damage: 5
    });

    return entity;
};