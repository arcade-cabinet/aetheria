import { Ray } from "@babylonjs/core/Culling/ray";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
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
    const hit = scene.pickWithRay(ray, (mesh) => {
        // Filter: Must be an entity in our world?
        // For now, collide with anything that matches a world entity
        return true; 
    });

    interactionState.target = null;
    interactionState.label = "";

    if (hit && hit.pickedMesh) {
        // Reverse lookup Entity from Mesh
        // Miniplex doesn't have a direct Mesh->Entity map unless we maintain it.
        // We can iterate or add userData to mesh.
        // Optimization: Add entity reference to mesh.metadata
        
        const mesh = hit.pickedMesh;
        if (mesh.metadata && mesh.metadata.entityId) {
             // We need to look up by ID? Miniplex entities are objects.
             // We can iterate world.entities to find matching mesh. Slow.
             // Better: Store Entity on Mesh.metadata.entity (Careful with circular refs/GC)
             // Or just assume 'name' tells us something.
             
             // For this phase, let's just check if it's a "Prop"
             if (mesh.name.includes("Rock")) {
                 interactionState.label = "Inspect Stone";
             } else if (mesh.name.includes("Tree")) {
                 interactionState.label = "Chop Tree";
             }
        }
    }
};
