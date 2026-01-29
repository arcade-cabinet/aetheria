import { world } from "../World";
import { Vector3 } from "yuka";

export const HealthSystem = () => {
    for (const entity of world.with("health", "maxHealth")) {
        // Clamp Health
        if (entity.health > entity.maxHealth) entity.health = entity.maxHealth;

        // Death Check
        if (entity.health <= 0 && !entity.isDead) {
            entity.isDead = true;
            console.log(`Entity ${entity.id} (${entity.assetId}) DIED`);

            if (entity.isPlayer) {
                handlePlayerDeath(entity);
            } else {
                // Enemies/Minions handled by CombatSystem removal for now
            }
        }
    }
};

const handlePlayerDeath = (player: any) => {
    console.log("Respawning Player...");
    
    // 1. Reset Stats
    player.health = player.maxHealth;
    player.isDead = false;

    // 2. Teleport to Start (0, 5, 0)
    if (player.physicsBody) {
        player.physicsBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
        player.physicsBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    
    player.position.set(0, 5, 0);
};
