import { Ray } from "@babylonjs/core/Culling/ray";
import { type Entity, world } from "../World";

// Interaction State (Global for UI)
export const interactionState = {
    target: null as Entity | null,
    label: "",
};

export const InteractionSystem = (scene: import("@babylonjs/core/scene").Scene) => {
    // 1. Get Player
    const player = world.with("isPlayer", "mesh").first;
    if (!player || !player.mesh) return;

    // 2. Cast Ray
    const origin = player.mesh.position.clone();
    origin.y += 0.5; // Eye height
    
    // Direction: Forward from mesh rotation
    const forward = player.mesh.forward;
    const ray = new Ray(origin, forward, 3); // 3m range

    // Simple picking
    const hit = scene.pickWithRay(ray, (_mesh) => {
        // Filter: Must be an entity in our world?
        return true; 
    });

    interactionState.target = null;
    interactionState.label = "";

    if (hit && hit.pickedMesh) {
        const mesh = hit.pickedMesh;
        
        // For this phase, let's just check if it's a "Prop"
        if (mesh.name.includes("Rock")) {
            interactionState.label = "Inspect Stone";
        } else if (mesh.name.includes("Tree")) {
            interactionState.label = "Chop Tree";
        }
    }
};