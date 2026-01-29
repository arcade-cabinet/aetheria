import { z } from "zod";

// --- Dialogue System ---

export const DialogueOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    nextNodeId: z.string().optional(), // If null, ends dialogue
    requiredFlag: z.string().optional(), // Logic gate (e.g. "HAS_MET_GOVERNOR")
    triggerEvent: z.string().optional(), // Effect (e.g. "START_QUEST_01")
});

export const DialogueNodeSchema = z.object({
    id: z.string(),
    speaker: z.string(), // "Governor", "Minion", "Stranger"
    text: z.string(),
    options: z.array(DialogueOptionSchema),
});

export const DialogueTreeSchema = z.object({
    id: z.string(),
    rootNodeId: z.string(),
    nodes: z.record(z.string(), DialogueNodeSchema), // Map ID -> Node
});

// --- Quest System (The Spine) ---

export const QuestObjectiveSchema = z.object({
    id: z.string(),
    description: z.string(),
    type: z.enum(["KILL", "FETCH", "TALK", "EXPLORE"]),
    targetId: z.string(), // "Skeleton_Minion", "Ruins_Entrance"
    count: z.number().default(1),
    current: z.number().default(0),
    isOptional: z.boolean().default(false),
});

export const QuestSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    giverId: z.string().optional(),
    
    // Logic
    prerequisiteQuestId: z.string().optional(),
    requiredLevel: z.number().default(1),
    
    // Objectives
    objectives: z.array(QuestObjectiveSchema),
    
    // Rewards
    rewards: z.object({
        xp: z.number().default(0),
        gold: z.number().default(0),
        items: z.array(z.string()).optional(), // Item IDs
        unlocksMinion: z.boolean().default(false), // The "Igor" unlock
    }),

    // State
    status: z.enum(["LOCKED", "AVAILABLE", "ACTIVE", "COMPLETED", "FAILED"]).default("LOCKED"),
});

// --- Minion System ---

export const MinionSchema = z.object({
    id: z.string(),
    name: z.string(),
    class: z.enum(["Carrier", "Defender", "Scout"]),
    level: z.number().default(1),
    xp: z.number().default(0),
    stats: z.object({
        strength: z.number(),
        loyalty: z.number(), // Governance mechanic?
    }),
    equipment: z.object({
        mainHand: z.string().optional(),
        offHand: z.string().optional(),
    }),
});

export type DialogueTree = z.infer<typeof DialogueTreeSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type Minion = z.infer<typeof MinionSchema>;
