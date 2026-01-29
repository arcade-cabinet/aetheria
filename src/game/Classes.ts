export interface StatBounds {
    min: number;
    max: number;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    cooldown: number; // Seconds
    damageScale?: number; // % of primary stat
    cost?: number; // Mana/Energy
}

export interface CharacterClass {
    id: string; // 'warrior', 'rogue', 'mage'
    name: string;
    description: string;
    assetId: string;
    stats: {
        strength: StatBounds;
        dexterity: StatBounds;
        intelligence: StatBounds;
        vitality: StatBounds;
    };
    skills: Skill[];
}

export const CLASSES: CharacterClass[] = [
    {
        id: "warrior",
        name: "Skeleton Warrior",
        description: "A relentless fighter clad in rusted mail. Excel at close combat and durability.",
        assetId: "Skeleton_Warrior", 
        stats: { 
            strength: { min: 8, max: 12 },
            dexterity: { min: 3, max: 6 },
            intelligence: { min: 1, max: 4 },
            vitality: { min: 8, max: 12 }
        },
        skills: [
            {
                id: "bone_shield",
                name: "Bone Shield",
                description: "Reinforce your skeletal frame, reducing incoming damage.",
                cooldown: 12,
                cost: 20
            }
        ]
    },
    {
        id: "rogue",
        name: "Skeleton Rogue",
        description: "A silent killer who strikes from the shadows. High damage but fragile.",
        assetId: "Skeleton_Rogue",
        stats: { 
            strength: { min: 4, max: 7 },
            dexterity: { min: 9, max: 14 },
            intelligence: { min: 4, max: 8 },
            vitality: { min: 4, max: 8 }
        },
        skills: [
            {
                id: "shadow_strike",
                name: "Shadow Strike",
                description: "Dash through the veil to strike an enemy from behind.",
                cooldown: 8,
                damageScale: 1.5,
                cost: 15
            }
        ]
    },
    {
        id: "mage",
        name: "Skeleton Mage",
        description: "A wielder of dark arts, blasting foes from a distance.",
        assetId: "Skeleton_Mage",
        stats: { 
            strength: { min: 2, max: 5 },
            dexterity: { min: 4, max: 8 },
            intelligence: { min: 10, max: 15 },
            vitality: { min: 3, max: 7 }
        },
        skills: [
            {
                id: "soul_bolt",
                name: "Soul Bolt",
                description: "Fire a projectile of pure necrotic energy.",
                cooldown: 2,
                damageScale: 1.2,
                cost: 5
            }
        ]
    }
];