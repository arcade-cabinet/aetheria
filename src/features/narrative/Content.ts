import type { Quest, DialogueTree } from "../../game/schema/GameSchema";
import type { WorldConfig } from "../../game/schema/WorldSchema";

export const WORLD_CONFIG: WorldConfig = {
    anchors: [
        {
            id: "anchor_start",
            chunkX: 0,
            chunkZ: 0,
            layoutId: "STARTING_TOWN",
            name: "The Awakening Site",
            description: "A ruined plaza where the Risen first emerge."
        },
        {
            id: "anchor_crypt",
            chunkX: 4,
            chunkZ: 4,
            layoutId: "CRYPT",
            name: "The Sunken Cathedral",
            description: "A bastion of the old gods, now drowning in shadows. Holds the Void Key."
        },
        {
            id: "anchor_void",
            chunkX: 8,
            chunkZ: 8,
            layoutId: "VOID_GATE",
            name: "The Void Gate",
            description: "The tear in reality. The final threshold."
        }
    ]
};

export const QUEST_AWAKENING: Quest = {
    id: "quest_awakening",
    title: "The Awakening",
    description: "Your bones rattle with a cold purpose. You must stabilize your existence before the void reclaims you.",
    requiredLevel: 1,
    objectives: [
        {
            id: "obj_find_anchor",
            description: "Inspect the Ancient Anchor",
            type: "TALK", // Interaction
            targetId: "ancient_anchor",
            count: 1,
            current: 0,
            isOptional: false
        }
    ],
    rewards: {
        xp: 100,
        gold: 0,
        unlocksMinion: true
    },
    status: "ACTIVE" // Starts active for now
};

export const DIALOGUE_ANCHOR: DialogueTree = {
    id: "dialogue_anchor",
    rootNodeId: "root",
    nodes: {
        "root": {
            id: "root",
            speaker: "Ancient Anchor",
            text: "The stone hums with a resonance that vibrates through your marrow. It seems to be waiting for a command.",
            options: [
                {
                    id: "opt_touch",
                    text: "[Attune] Channel your void energy into the stone.",
                    nextNodeId: "node_success",
                    triggerEvent: "COMPLETE_QUEST_AWAKENING"
                },
                {
                    id: "opt_leave",
                    text: "Leave it be.",
                    nextNodeId: undefined
                }
            ]
        },
        "node_success": {
            id: "node_success",
            speaker: "System",
            text: "Energy arcs from your hand. A shape coalesces from the dust nearby. A servant has answered the call.",
            options: [
                {
                    id: "opt_finish",
                    text: "Rise, minion.",
                    nextNodeId: undefined
                }
            ]
        }
    }
};
