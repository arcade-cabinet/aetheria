import { Vector3, Quaternion } from "yuka";
import { type Entity, world } from "../World";

export const createPlayer = (targetWorld: typeof world) => {
    // 1. Create Entity in Miniplex
    const entity = targetWorld.add({
        isPlayer: true,
        assetId: "Skeleton_Rogue", // Hardcoded default for now
        position: new Vector3(0, 10, 0), // Start high
        velocity: new Vector3(0, 0, 0),
        rotation: new Quaternion(),
        
        // Physics Shim
        physics: {
            body: {
                velocity: new Vector3(0, 0, 0),
                setLinearVelocity: function(v: any) {
                    this.velocity.set(v.x, v.y, v.z);
                },
                getLinearVelocity: function() {
                    return this.velocity;
                }
            }
        },

        // Stats
        health: 100,
        maxHealth: 100,
        inventory: []
    });

    return entity;
};
