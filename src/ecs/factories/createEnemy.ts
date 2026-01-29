import { Vector3, Quaternion } from "yuka";
import RAPIER from "@dimforge/rapier3d-compat";
import { type Entity, world } from "../World";
import { getPhysicsWorld } from "../systems/PhysicsSystem";

export const createEnemy = (targetWorld: typeof world, position: Vector3, type: "Skeleton_Warrior" | "Skeleton_Rogue" = "Skeleton_Warrior"): Entity => {
    const pw = getPhysicsWorld();

    // 1. Physics Body (Dynamic)
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z)
        .lockRotations(); // Keep upright

    const body = pw.createRigidBody(bodyDesc);

    // 2. Collider
    const colliderDesc = RAPIER.ColliderDesc.capsule(0.6, 0.3)
        .setFriction(0)
        .setRestitution(0);
    
    pw.createCollider(colliderDesc, body);

    // 3. Entity
    const entity = targetWorld.add({
        isEnemy: true,
        assetId: type,
        position: new Vector3().copy(position),
        rotation: new Quaternion(),
        velocity: new Vector3(0, 0, 0),
        physicsBody: body,
        
        // AI Stats
        aiState: "IDLE",
        moveSpeed: 3.5,
        detectionRange: 15,
        attackRange: 2,
        
        // Combat Stats
        health: 50,
        maxHealth: 50,
        damage: 10,
        xpValue: 25,
        
        interactableType: "INSPECT"
    });

    return entity;
};