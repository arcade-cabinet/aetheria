import { world } from "../World";
import { makeMutable } from 'react-native-reanimated';

export interface DamageTextInfo {
    id: number;
    text: string;
    pos: { x: number, y: number, z: number };
    opacity: any; // SharedValue
}

// Global state for HUD to consume
export const damageTexts: DamageTextInfo[] = [];

export const DamageTextSystem = () => {
    const dt = 1/60;

    for (const entity of world.with("isDamageText", "text", "position", "lifetime")) {
        // 1. Move Up
        entity.position.y += 2 * dt;
        
        // 2. Reduce Lifetime
        entity.lifetime -= dt;

        if (entity.lifetime <= 0) {
            world.remove(entity);
            // Remove from global list
            const idx = damageTexts.findIndex(d => d.id === entity.id);
            if (idx !== -1) damageTexts.splice(idx, 1);
        }
    }
};

export const spawnDamageText = (text: string, pos: { x: number, y: number, z: number }) => {
    const entity = world.add({
        isDamageText: true,
        text,
        position: { x: pos.x, y: pos.y + 2, z: pos.z } as any, // Start above target
        lifetime: 1.0 // 1 second
    });

    damageTexts.push({
        id: entity.id,
        text,
        pos: entity.position as any,
        opacity: makeMutable(1)
    });
};
