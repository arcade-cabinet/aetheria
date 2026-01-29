import { world } from "../World";
import { getItem } from "../../features/inventory/ItemDatabase";

export const EquipmentSystem = () => {
    // 1. Recalculate Stats for all entities with equipment
    for (const entity of world.with("equipment", "baseStats", "damage", "maxHealth")) {
        let extraDamage = 0;
        let extraHealth = 0;

        // Sum bonuses from all slots
        for (const slot in entity.equipment) {
            const itemId = entity.equipment[slot];
            const item = getItem(itemId);
            if (item && item.stats) {
                extraDamage += item.stats.damage || 0;
                extraHealth += item.stats.armor || 0; // Armor adds to health for now
            }
        }

        // Apply
        entity.damage = entity.baseStats!.damage + extraDamage;
        entity.maxHealth = entity.baseStats!.maxHealth + extraHealth;
    }
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
