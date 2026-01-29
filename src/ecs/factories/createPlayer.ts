import { Vector3, Quaternion } from "yuka";
import RAPIER from "@dimforge/rapier3d-compat";
import { type Entity, world } from "../World";
import { getPhysicsWorld } from "../systems/PhysicsSystem";

export const createPlayer = (targetWorld: typeof world, initialState?: any) => {

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

        

        // Stats (Loaded from Persistence or Default)

        health: initialState?.health || 100,

        maxHealth: initialState?.maxHealth || 100,

        baseStats: initialState?.baseStats || {

            maxHealth: 100,

            damage: 15

        },

        xp: initialState?.xp || 0,

        level: initialState?.level || 1,

        targetXP: initialState?.targetXP || 100,

        damage: initialState?.damage || 15,

        inventory: initialState?.inventory || [],

        equipment: initialState?.equipment || {}

    });



    return entity;

};