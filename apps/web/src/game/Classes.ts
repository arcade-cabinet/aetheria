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
        id: "dread_knight",
        name: "Dread Knight",
        description: "A cursed juggernaut fueled by vengeance. Heavily armored and relentless.",
        assetId: "Skeleton_Warrior", 
        stats: { 
            strength: { min: 9, max: 13 },
            dexterity: { min: 2, max: 5 },
            intelligence: { min: 2, max: 5 },
            vitality: { min: 9, max: 13 }
        },
        skills: [
            {
                id: "bone_shield",
                name: "Grave Guard",
                description: "Summon a barrier of swirling bone fragments.",
                cooldown: 12,
                cost: 20
            }
        ]
    },
    {
        id: "assassin",
        name: "Assassin",
        description: "A silent executioner who stalks the gloom. Lethal but fragile.",
        assetId: "Skeleton_Rogue",
        stats: { 
            strength: { min: 4, max: 7 },
            dexterity: { min: 10, max: 15 },
            intelligence: { min: 5, max: 9 },
            vitality: { min: 3, max: 7 }
        },
        skills: [
            {
                id: "shadow_strike",
                name: "Shadow Step",
                description: "Vanish and reappear behind your prey for a critical strike.",
                cooldown: 8,
                damageScale: 1.5,
                cost: 15
            }
        ]
    },
    {
        id: "warlock",
        name: "Warlock",
        description: "A conduit for the entropic void. Destroys foes with forbidden power.",
        assetId: "Skeleton_Mage",
        stats: { 
            strength: { min: 2, max: 5 },
            dexterity: { min: 4, max: 8 },
            intelligence: { min: 11, max: 16 },
            vitality: { min: 3, max: 6 }
        },
        skills: [
            {
                id: "soul_bolt",
                name: "Void Bolt",
                description: "Hurl a bolt of unstable necrotic energy.",
                cooldown: 2,
                damageScale: 1.2,
                cost: 5
            }
        ]
    }
];