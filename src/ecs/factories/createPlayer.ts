import { Vector3, Quaternion } from "yuka";
import RAPIER from "@dimforge/rapier3d-compat";
import { type Entity, world } from "../World";
import { getPhysicsWorld } from "../systems/PhysicsSystem";

export const createPlayer = (targetWorld: typeof world) => {
    const pw = getPhysicsWorld();

    // 1. Create Rapier Body (Dynamic)
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 5, 0) // Start in the air
        .setCanSleep(false)
        .lockRotations(); // Keep player upright

    const body = pw.createRigidBody(bodyDesc);

    // 2. Create Collider (Capsule)
    const colliderDesc = RAPIER.ColliderDesc.capsule(0.6, 0.3) // height/2, radius
        .setFriction(0)
        .setRestitution(0);
    
    pw.createCollider(colliderDesc, body);

    // 3. Create Entity in Miniplex
    const entity = targetWorld.add({
        isPlayer: true,
        assetId: "Skeleton_Warrior", 
        position: new Vector3(0, 5, 0),
        rotation: new Quaternion(),
        velocity: new Vector3(0, 0, 0),
        physicsBody: body,
        health: 100,
        maxHealth: 100,
        inventory: []
    });

    return entity;
};