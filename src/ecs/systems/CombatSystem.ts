import { world } from "../World";
import { useQuestStore } from "../../features/narrative/QuestManager";
import { input } from "./ControllerSystem";

const DAMAGE_COOLDOWN = 60; // Frames (1 sec)

export const CombatSystem = () => {
    const player = world.with("isPlayer", "health", "damage").first;
    if (!player) return;

    // 1. Enemy Attacks Player
    for (const enemy of world.with("isEnemy", "aiState", "attackRange", "damage")) {
        if (enemy.aiState === "ATTACK") {
            const dist = enemy.position.distanceTo(player.position);
            if (dist <= enemy.attackRange) {
                // Initialize cooldown if missing
                if (typeof enemy.attackCooldown === 'undefined') enemy.attackCooldown = 0;

                if (enemy.attackCooldown <= 0) {
                    // Deal Damage
                    player.health -= enemy.damage;
                    console.log(`Player hit! Health: ${player.health}`);
                    
                    // Reset Cooldown
                    enemy.attackCooldown = DAMAGE_COOLDOWN;

                    // Death Check
                    if (player.health <= 0) {
                        console.log("GAME OVER");
                        // Trigger Game Over UI (Not implemented yet)
                    }
                } else {
                    enemy.attackCooldown--;
                }
            }
        }
    }

    // 2. Player Attacks (Area of Effect forward?)
    if (input.attack) {
        console.log("Player Attacking!");
        // Find enemies in range
        const ATTACK_RANGE = 3;
        for (const enemy of world.with("isEnemy", "health")) {
            const dist = enemy.position.distanceTo(player.position);
            if (dist <= ATTACK_RANGE) {
                enemy.health -= player.damage || 10;
                console.log(`Enemy Hit! Health: ${enemy.health}`);
                
                if (enemy.health <= 0) {
                    console.log("Enemy Defeated");
                    
                    // Award XP
                    if (enemy.xpValue) {
                        player.xp += enemy.xpValue;
                        console.log(`Gained ${enemy.xpValue} XP. Total: ${player.xp}`);
                    }
                    
                    world.remove(enemy);
                    
                    // XP / Loot logic here
                }
            }
        }
        input.attack = false; // Reset input (Single frame)
    }
};
