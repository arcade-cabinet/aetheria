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
        name: "Oathbound Knight",
        description: "A staunch defender of the realm, clad in heavy armor.",
        assetId: "Knight_Male", // Maps to AssetRegistry ID
        stats: { strength: 8, dexterity: 3, intelligence: 2, vitality: 7 }
    },
    {
        id: "rogue",
        name: "Shadow Walker",
        description: "A master of stealth and precision strikes.",
        assetId: "Rogue",
        stats: { strength: 3, dexterity: 9, intelligence: 4, vitality: 4 }
    },
    {
        id: "wizard",
        name: "Void Scholar",
        description: "Wielder of forbidden arcane arts.",
        assetId: "Wizard",
        stats: { strength: 2, dexterity: 4, intelligence: 9, vitality: 3 }
    },
    {
        id: "cleric",
        name: "Aether Cleric",
        description: "Healer and protector against the encroaching dark.",
        assetId: "Cleric",
        stats: { strength: 5, dexterity: 3, intelligence: 6, vitality: 6 }
    },
    {
        id: "wanderer",
        name: "Fractured Soul",
        description: "A lost soul with no memory, adaptable to any path.",
        assetId: "BaseCharacter",
        stats: { strength: 5, dexterity: 5, intelligence: 5, vitality: 5 }
    }
];
