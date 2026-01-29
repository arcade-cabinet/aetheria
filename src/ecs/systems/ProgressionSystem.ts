import { world } from "../World";
import { spawnDamageText } from "./DamageTextSystem";

export const ProgressionSystem = () => {
    const player = world.with("isPlayer", "xp", "level", "targetXP", "position").first;
    if (!player) return;

    if (player.xp >= player.targetXP) {
        // Level Up!
        player.xp -= player.targetXP;
        player.level += 1;
        player.targetXP = player.level * 100;
        
        // Stat Scaling
        player.maxHealth += 20;
        player.health = player.maxHealth;
        
        if (player.damage) {
            player.damage += 5;
        }

        console.log(`LEVEL UP! Now Level ${player.level}`);
        spawnDamageText(`LEVEL UP! (${player.level})`, player.position);
    }
};
