import type { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { World } from "miniplex";
import { useState, useEffect } from "react";

export type Entity = {
	// Core
	mesh?: AbstractMesh;
	physics?: PhysicsAggregate;

	// State
	position?: Vector3; // For logic reference, though Mesh has it too
	velocity?: Vector3;

	// Tags
	isPlayer?: boolean;
	isGround?: boolean;
	isBlock?: boolean;

	// Assembler State
	assemblerState?: "FALLING" | "LOCKED";
	targetPosition?: Vector3; // Where it should ideally end up (for snapping)

    // Interaction
    isInteractable?: boolean;
    interactionRange?: number;
    
    // AI & Behavior
    isMinion?: boolean;
    isEnemy?: boolean;
    ownerId?: number; // For minions (Player ID)
    aiState?: "IDLE" | "FOLLOW" | "CHASE" | "ATTACK";
    targetEntityId?: number; // Entity ID to chase/attack
    detectionRange?: number;
    attackRange?: number;
    moveSpeed?: number;

    // Narrative & Quests
    dialogueId?: string;       // ID of the dialogue tree to trigger
    questTargetId?: string;    // ID matching a QuestObjective target
    indicatorType?: "QUEST_AVAILABLE" | "QUEST_TARGET" | "INTERACT"; // Visual cue state
    indicatorMesh?: import("@babylonjs/core/Meshes/abstractMesh").AbstractMesh; // Reference to the billboard mesh
    
    // FX
    isDamageText?: boolean;
    text?: string;
    lifetime?: number; // Frames or ms remaining

    inventory?: string[];
    interactableType?: "PICKUP" | "INSPECT";
    assetId?: string;

    // Combat
    health?: number;
    maxHealth?: number;
    damage?: number; // Damage this entity deals on contact
    isHazard?: boolean;
    isDead?: boolean;
};

export const world = new World<Entity>();

export const useEntityQuery = (predicate: (e: Entity) => boolean) => {
    const [entities, setEntities] = useState<Entity[]>([]);

    useEffect(() => {
        const update = () => {
            const result: Entity[] = [];
            for (const e of world.entities) {
                if (predicate(e)) result.push(e);
            }
            setEntities(result);
        };

        update();
        const sub1 = world.onEntityAdded.subscribe(update);
        const sub2 = world.onEntityRemoved.subscribe(update);
        // Note: This won't trigger on component updates, only add/remove entity.
        // For HP updates, we might need a more granular subscription or polling.
        // For HUD, polling (or useFrame in r3f, but we are hybrid) is often safer for changing values.
        // We'll stick to this for list stability, but HUD might need polling for values.
        
        return () => {
            sub1();
            sub2();
        };
    }, []);

    // Forcing update on HP change is tricky without MobX or similar.
    // We'll rely on React re-render cycle or add a simple poller for HUD values?
    // Let's add a poller for HUD specifically in the HUD component, 
    // or just assume re-renders happen often enough (they won't unless parent updates).
    // I'll add a dirty hack to force update every 100ms for this hook to be useful for HP.
    
    useEffect(() => {
        const interval = setInterval(() => {
             setEntities(prev => [...prev]); // Force re-render? No, only if array ref changes.
             // Actually, we need to re-evaluate the predicate or just values.
             // Let's just return the entities reference.
             // If we want reactive HP, we need a better store.
             // But for now, let's keep it simple.
             const result: Entity[] = [];
             for (const e of world.entities) {
                 if (predicate(e)) result.push(e);
             }
             setEntities(result);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return entities;
};
