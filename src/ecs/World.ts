import { World } from "miniplex";
import { Vector3, Quaternion } from "yuka";
import type { RigidBody } from "@dimforge/rapier3d-compat";

export type Entity = {
	// Core
    modelId?: number; // Filament entity ID
	physicsBody?: RigidBody;

	// State
	position?: Vector3; 
    rotation?: Quaternion;
	velocity?: Vector3;

	// Tags
	isPlayer?: boolean;
	isGround?: boolean;
	isBlock?: boolean;
    isMinion?: boolean;
    isEnemy?: boolean;

	// Assembler State
	assemblerState?: "FALLING" | "LOCKED";
	targetPosition?: Vector3;

    // Interaction
    isInteractable?: boolean;
    interactionRange?: number;
    
    // Narrative & Quests
    dialogueId?: string;
    questTargetId?: string;
    indicatorType?: "QUEST_AVAILABLE" | "QUEST_TARGET" | "INTERACT";
    
    // Inventory & Equipment
    inventory?: string[];
    equipment?: Record<string, string>; // Slot -> ItemID
    interactableType?: "PICKUP" | "INSPECT";
    assetId?: string;

    // Combat
    health?: number;
    maxHealth?: number;
    damage?: number;
    baseStats?: {
        maxHealth: number;
        damage: number;
    };
    attackCooldown?: number;
    xpValue?: number;
    isHazard?: boolean;
    isDead?: boolean;
    
    // Progression
    xp?: number;
    level?: number;
    targetXP?: number;
    
    // AI
    ownerId?: number;
    aiState?: "IDLE" | "FOLLOW" | "CHASE" | "ATTACK";
    targetEntityId?: number;
    detectionRange?: number;
    attackRange?: number;
    attackCooldown?: number;
    moveSpeed?: number;
    
    // FX
    isDamageText?: boolean;
    text?: string;
    lifetime?: number;
};

export const world = new World<Entity>();

// Expose for E2E
if (typeof window !== "undefined") {
    (window as any).world = world;
}
