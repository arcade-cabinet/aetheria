import type { Item } from "../../game/schema/ItemSchema";

export const ITEM_DATABASE: Record<string, Item> = {
    "Potion_1": {
        id: "Potion_1",
        name: "Essence of Void",
        description: "A chilling draft that mends fractured bone. Restores 30 HP.",
        type: "CONSUMABLE",
        stats: { healing: 30 },
        assetId: "Potion_1"
    },
    "Axe_Bronze": {
        id: "Axe_Bronze",
        name: "Bronze Executioner",
        description: "A heavy, rusted axe. Deals 15 damage.",
        type: "WEAPON",
        stats: { damage: 15 },
        assetId: "Axe_Bronze"
    },
    "Void_Key": {
        id: "Void_Key",
        name: "Void Key",
        description: "A key that exists in multiple planes. Essential for opening the Gate.",
        type: "QUEST",
        assetId: "chest_gold" // Uses chest model as placeholder for key? No, should be item
    }
};

export const getItem = (id: string): Item | null => {
    return ITEM_DATABASE[id] || null;
};
