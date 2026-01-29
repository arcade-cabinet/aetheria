import RAPIER from "@dimforge/rapier3d-compat";
import { world } from "../World";
import { Vector3, Quaternion } from "yuka";

let physicsWorld: RAPIER.World | null = null;
let initialized = false;

export const initPhysics = async () => {
    if (initialized) return;
    await RAPIER.init();
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    physicsWorld = new RAPIER.World(gravity);
    initialized = true;
    console.log("Rapier Physics Initialized");
};

export const getPhysicsWorld = () => {
    if (!physicsWorld) throw new Error("Physics not initialized");
    return physicsWorld;
};

export const PhysicsSystem = () => {
    if (!physicsWorld) return;

    // 1. Sync Logic -> Physics (if needed, e.g. impulses)
    // 2. Step Physics
    physicsWorld.step();

    // 3. Sync Physics -> ECS State
    for (const entity of world.with("position", "rotation", "physicsBody")) {
        const body = entity.physicsBody;
        const pos = body.translation();
        const rot = body.rotation();
        
        entity.position.set(pos.x, pos.y, pos.z);
        entity.rotation.set(rot.x, rot.y, rot.z, rot.w);
    }
};

// Factory helpers
export const createRigidBody = (
    pos: { x: number, y: number, z: number }, 
    type: RAPIER.RigidBodyDesc, 
    colliderDesc: RAPIER.ColliderDesc
) => {
    const pw = getPhysicsWorld();
    const body = pw.createRigidBody(type);
    body.setTranslation(pos, true);
    pw.createCollider(colliderDesc, body);
    return body;
};