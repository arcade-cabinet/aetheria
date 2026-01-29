import { useState, useEffect } from 'react';
import { world } from './World';

import { equipItem } from './systems/EquipmentSystem';

export const usePlayer = () => {
    // Simple polling hook to sync ECS player state to React UI
    // In production, use miniplex-react or a proper store subscription
    const [playerData, setPlayerData] = useState<any>(null);

    const equip = (slot: string, itemId: string) => {
        const player = world.with("isPlayer").first;
        if (player) {
            equipItem(player, slot, itemId);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const player = world.with("isPlayer").first;
            if (player) {
                // Clone relevant props to trigger React diff
                setPlayerData({
                    health: player.health,
                    maxHealth: player.maxHealth,
                    level: player.level,
                    xp: player.xp,
                    targetXP: player.targetXP,
                    inventory: [...(player.inventory || [])],
                    equipment: { ...(player.equipment || {}) }
                });
            }
        }, 100); // 10Hz UI update

        return () => clearInterval(interval);
    }, []);

    return { player: playerData, equip };
};
