import { useEffect } from 'react';
import { PhysicsSystem } from '../ecs/systems/PhysicsSystem';
import { ControllerSystem } from '../ecs/systems/ControllerSystem';

export const useGameLoop = () => {
    useEffect(() => {
        let running = true;
        const loop = () => {
            if (!running) return;
            
            // Run Systems
            ControllerSystem();
            PhysicsSystem();
            
            requestAnimationFrame(loop);
        };
        
        loop();
        return () => { running = false; };
    }, []);
};
