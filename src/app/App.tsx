import React from 'react';
import { GameScene } from '../scene/GameScene';
import { Layout } from './Layout';
import { Scene } from '@babylonjs/core/scene';
import { PhysicsSystem } from '../ecs/systems/PhysicsSystem';
import { ControllerSystem } from '../ecs/systems/ControllerSystem';
import { AssemblerSystem } from '../ecs/systems/AssemblerSystem';
import { loadTestLevel } from '../features/gen/TestLevel';

const App: React.FC = () => {
  const onSceneReady = (scene: Scene) => {
    // 1. Load Level
    loadTestLevel(scene);

    // 2. Register Systems Loop
    scene.onBeforeRenderObservable.add(() => {
        PhysicsSystem();
        ControllerSystem();
        AssemblerSystem();
    });
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Game Layer */}
      <div className="absolute inset-0 z-0">
         <GameScene onSceneReady={onSceneReady} />
      </div>

      {/* UI Layer */}
      <Layout />
    </div>
  );
};

export default App;
