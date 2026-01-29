import { useEffect } from 'react';
import { PhysicsSystem } from '../ecs/systems/PhysicsSystem';
import { ControllerSystem } from '../ecs/systems/ControllerSystem';
import { EnemySystem } from '../ecs/systems/EnemySystem';
import { MinionSystem } from '../ecs/systems/MinionSystem';
import { CombatSystem } from '../ecs/systems/CombatSystem';
import { InteractionSystem } from '../ecs/systems/InteractionSystem';
import { ProgressionSystem } from '../ecs/systems/ProgressionSystem';
import { DamageTextSystem } from '../ecs/systems/DamageTextSystem';
import { IndicatorSystem } from '../ecs/systems/IndicatorSystem';
import { QuestSystem } from '../ecs/systems/QuestSystem';
import { NarrativeSystem } from '../ecs/systems/NarrativeSystem';
import { EquipmentSystem } from '../ecs/systems/EquipmentSystem';
import { chunkManager } from '../features/gen/ChunkManager';
import { world } from '../ecs/World';

let isUpdatingChunks = false;

export const useGameLoop = () => {
    useEffect(() => {
        let running = true;
        const loop = async () => {
            if (!running) return;
            
            const player = world.with("isPlayer", "position").first;

            // Run Systems
            ControllerSystem();
            EnemySystem();
            MinionSystem();
            CombatSystem();
            ProgressionSystem();
            HealthSystem();
            InteractionSystem();
            QuestSystem();
            NarrativeSystem();
            EquipmentSystem();
            DamageTextSystem();
            IndicatorSystem();
            PhysicsSystem();

            // Dynamic Chunk Loading
            if (player?.position && !isUpdatingChunks) {
                isUpdatingChunks = true;
                chunkManager.update(player.position).finally(() => {
                    isUpdatingChunks = false;
                });
            }
            
            requestAnimationFrame(loop);
        };
        
        loop();
        return () => { running = false; };
    }, []);
};
