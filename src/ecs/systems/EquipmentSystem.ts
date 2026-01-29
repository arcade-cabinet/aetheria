import { world } from "../World";

export const EquipmentSystem = () => {
    const player = world.with("isPlayer", "equipment", "damage", "maxHealth").first;
    if (!player) return;

    // Base Stats (Reset before bonuses?)
    // This is tricky without "baseStats" component.
    // Production Solution: Add baseStats component.
};

export const equipItem = (entity: any, slot: string, itemId: string) => {
    if (!entity.equipment) entity.equipment = {};
    
    // 1. Move current item to inventory (if any)
    const current = entity.equipment[slot];
    if (current) {
        entity.inventory.push(current);
    }
    
    // 2. Set new equipment
    entity.equipment[slot] = itemId;
    
    // 3. Remove from inventory
    const idx = entity.inventory.indexOf(itemId);
    if (idx !== -1) entity.inventory.splice(idx, 1);
    
    console.log(`Equipped ${itemId} in ${slot}`);
    
    // 4. Trigger Stat Recalculation (In the future)
};
