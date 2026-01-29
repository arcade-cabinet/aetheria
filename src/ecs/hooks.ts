import { useState, useEffect } from 'react';
import { world } from './World';

export const usePlayer = () => {
    // Simple polling hook to sync ECS player state to React UI
    // In production, use miniplex-react or a proper store subscription
    const [playerData, setPlayerData] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const player = world.with("isPlayer").first;
            if (player) {
                // Clone relevant props to trigger React diff
                setPlayerData({
                    health: player.health,
                    maxHealth: player.maxHealth,
                    inventory: [...(player.inventory || [])]
                });
            }
        }, 100); // 10Hz UI update

        return () => clearInterval(interval);
    }, []);

    return playerData;
};
