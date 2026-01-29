import { world } from "../World";
import { input } from "./ControllerSystem";
import { useDialogueStore } from "../../features/narrative/DialogueManager";
import { useQuestStore } from "../../features/narrative/QuestManager";

// State for UI to display "Press E to Interact"
export const interactionState = {
    targetId: null as number | null,
    label: null as string | null
};

export const InteractionSystem = () => {
    // 1. Get Player
    const player = world.with("isPlayer", "position").first;
    if (!player) return;

    let closestTarget: any = null;
    let minDst = Infinity;

    // 2. Find Closest Interactable
    for (const entity of world.with("isInteractable", "position")) {
        const dist = entity.position.distanceTo(player.position);
        if (dist < (entity.interactionRange || 2.5) && dist < minDst) {
            minDst = dist;
            closestTarget = entity;
        }
    }

    // 3. Update State
    if (closestTarget) {
        interactionState.targetId = closestTarget.id;
        // Determine label
        if (closestTarget.dialogueId) interactionState.label = "Talk";
        else if (closestTarget.interactableType === "PICKUP") interactionState.label = "Pickup";
        else if (closestTarget.interactableType === "INSPECT") interactionState.label = "Inspect";
        else interactionState.label = "Interact";
    } else {
        interactionState.targetId = null;
        interactionState.label = null;
    }

    // 4. Handle Input
    // Note: input.interact should be true for ONE frame (pressed). 
    // TouchControls needs to reset it or we use a "justPressed" logic.
    // For now, assuming TouchControls sets it true, we consume it.
    
    if (input.interact && closestTarget) {
        console.log("Interacting with", closestTarget.assetId);
        
        // Narrative / Dialogue
        if (closestTarget.dialogueId) {
            useDialogueStore.getState().startDialogue(closestTarget.dialogueId);
        }
        
        // Quest Triggers
        if (closestTarget.questTargetId) {
            useQuestStore.getState().updateObjective(closestTarget.questTargetId, 1);
        }

        // Loot / Pickup
        if (closestTarget.interactableType === "PICKUP") {
            // Add to inventory (mock)
            console.log("Picked up item");
            world.remove(closestTarget); // Despawn
        }

        input.interact = false; // Consume input
    }
};
