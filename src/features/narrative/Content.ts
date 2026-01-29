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

export const QUEST_INTO_DEPTHS: Quest = {
    id: "quest_into_depths",
    title: "Into the Depths",
    description: "The Anchor's resonance points to the Sunken Cathedral. Something there calls to the void within you.",
    requiredLevel: 2,
    objectives: [
        {
            id: "obj_find_altar",
            description: "Inspect the Dark Altar in the Sunken Cathedral",
            type: "TALK",
            targetId: "crypt_altar",
            count: 1,
            current: 0,
            isOptional: false
        },
        {
            id: "obj_retrieve_key",
            description: "Retrieve the Void Key",
            type: "TALK", // Using TALK as interaction trigger for now
            targetId: "void_key_chest",
            count: 1,
            current: 0,
            isOptional: false
        }
    ],
    rewards: {
        xp: 500,
        gold: 100,
        unlocksMinion: false
    },
    status: "LOCKED"
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

export const DIALOGUE_ALTAR: DialogueTree = {
    id: "dialogue_altar",
    rootNodeId: "root",
    nodes: {
        "root": {
            id: "root",
            speaker: "Dark Altar",
            text: "Whispers of a thousand dead souls emanate from the cold stone. A key rests upon it, pulsing with anti-light.",
            options: [
                {
                    id: "opt_take",
                    text: "[Take] Claim the Void Key.",
                    nextNodeId: "node_taken",
                    triggerEvent: "COMPLETE_QUEST_INTO_DEPTHS" // Simplified for demo
                }
            ]
        },
        "node_taken": {
            id: "node_taken",
            speaker: "System",
            text: "The key burns cold in your hand. The path to the Void Gate is now open.",
            options: [
                {
                    id: "opt_finish",
                    text: "Done.",
                    nextNodeId: undefined
                }
            ]
        }
    }
};
