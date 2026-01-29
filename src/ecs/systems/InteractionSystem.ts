import { Ray } from "@babylonjs/core/Culling/ray";
import { type Entity, world } from "../World";

// Interaction State (Global for UI)
export const interactionState = {
    target: null as Entity | null,
    label: "",
};

// Input handling for E key
let ePressed = false;
window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "e") ePressed = true;
});
window.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "e") ePressed = false;
});

export const InteractionSystem = (scene: import("@babylonjs/core/scene").Scene) => {
    // 1. Get Player
    const player = world.with("isPlayer", "mesh", "inventory").first;
    if (!player || !player.mesh) return;

    // 2. Cast Ray
    const origin = player.mesh.position.clone();
    origin.y += 0.5; // Eye height
    
    // Direction: Forward from mesh rotation
    const forward = player.mesh.forward;
    const ray = new Ray(origin, forward, 3); // 3m range

    // Simple picking
    const hit = scene.pickWithRay(ray, (_mesh) => {
        return true; 
    });

    interactionState.target = null;
    interactionState.label = "";

    if (hit && hit.pickedMesh) {
        const mesh = hit.pickedMesh;
        
        // Find Entity
        // Optimization: In a real ECS, we'd use a map. Here we scan visible entities.
        let targetEntity: Entity | null = null;
        for (const entity of world.with("mesh", "interactableType")) {
            if (entity.mesh === mesh || entity.mesh === mesh.parent) {
                targetEntity = entity;
                break;
            }
        }

        if (targetEntity) {
            interactionState.target = targetEntity;
            if (targetEntity.interactableType === "PICKUP") {
                interactionState.label = `Take ${targetEntity.assetId}`;
                
                if (ePressed) {
                    // Action: Pickup
                    player.inventory?.push(targetEntity.assetId || "Unknown");
                    console.log("Picked up:", targetEntity.assetId);
                    
                    // Destroy world entity
                    if (targetEntity.mesh) targetEntity.mesh.dispose();
                    if (targetEntity.physics) targetEntity.physics.dispose();
                    world.remove(targetEntity);
                    
                    // Reset input to prevent multi-trigger
                    ePressed = false; 
                }
            } else {
                interactionState.label = `Inspect ${targetEntity.assetId}`;
            }
        }
    }
};
