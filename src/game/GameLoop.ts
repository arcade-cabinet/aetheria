import { useEffect } from 'react';
import { PhysicsSystem } from '../ecs/systems/PhysicsSystem';
import { ControllerSystem } from '../ecs/systems/ControllerSystem';
import { EnemySystem } from '../ecs/systems/EnemySystem';
import { MinionSystem } from '../ecs/systems/MinionSystem';
import { CombatSystem } from '../ecs/systems/CombatSystem';
import { InteractionSystem } from '../ecs/systems/InteractionSystem';
import { ProgressionSystem } from '../ecs/systems/ProgressionSystem';

export const useGameLoop = () => {
    useEffect(() => {
        let running = true;
        const loop = () => {
            if (!running) return;
            
            // Run Systems
            ControllerSystem();
            EnemySystem();
            MinionSystem();
            CombatSystem();
            ProgressionSystem();
            InteractionSystem();
            PhysicsSystem();
            
            requestAnimationFrame(loop);
        };
        
        loop();
        return () => { running = false; };
    }, []);
};
