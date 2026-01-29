import { useEffect } from 'react';
import { PhysicsSystem } from '../ecs/systems/PhysicsSystem';
import { ControllerSystem } from '../ecs/systems/ControllerSystem';
import { EnemySystem } from '../ecs/systems/EnemySystem';
import { MinionSystem } from '../ecs/systems/MinionSystem';

export const useGameLoop = () => {
    useEffect(() => {
        let running = true;
        const loop = () => {
            if (!running) return;
            
            // Run Systems
            ControllerSystem();
            EnemySystem();
            MinionSystem();
            PhysicsSystem();
            
            requestAnimationFrame(loop);
        };
        
        loop();
        return () => { running = false; };
    }, []);
};
