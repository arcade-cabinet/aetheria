export interface CharacterClass {
    id: string;
    name: string;
    description: string;
    assetId: string;
    stats: {
        strength: number;
        dexterity: number;
        intelligence: number;
        vitality: number;
    };
}

export const CLASSES: CharacterClass[] = [
    {
        id: "knight",
        name: "Risen Vanguard",
        description: "A skeletal warrior clinging to the memory of honor. Durable and heavy.",
        assetId: "Skeleton_Warrior", 
        stats: { strength: 8, dexterity: 3, intelligence: 2, vitality: 7 }
    },
    {
        id: "rogue",
        name: "Bone Stalker",
        description: "A nimble shade of death, striking from the dark corners.",
        assetId: "Skeleton_Rogue",
        stats: { strength: 3, dexterity: 9, intelligence: 4, vitality: 4 }
    },
    {
        id: "wizard",
        name: "Lich Acolyte",
        description: "A channeler of the entropic void. Fragile but potent.",
        assetId: "Skeleton_Mage",
        stats: { strength: 2, dexterity: 4, intelligence: 9, vitality: 3 }
    },
    {
        id: "cleric",
        name: "Crypt Keeper",
        description: "A guardian of the dead, preserving what remains of order.",
        assetId: "Skeleton_Mage",
        stats: { strength: 5, dexterity: 3, intelligence: 6, vitality: 6 }
    },
    {
        id: "wanderer",
        name: "Fractured Rib",
        description: "A bare skeleton with no past, ready to be shaped by the void.",
        assetId: "Skeleton_Minion",
        stats: { strength: 5, dexterity: 5, intelligence: 5, vitality: 5 }
    }
];
