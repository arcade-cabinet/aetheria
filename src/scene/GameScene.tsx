import React, { useEffect, useRef } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HavokPlugin } from '@babylonjs/core/Physics/v2/Plugins/havokPlugin';
import HavokPhysics from '@babylonjs/havok';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/core/Physics/physicsEngineComponent';

import { PostProcess } from './PostProcess';
import { disposeController } from '../ecs/systems/ControllerSystem';

interface GameSceneProps {
  onSceneReady: (scene: Scene) => void;
}

export const GameScene: React.FC<GameSceneProps> = ({ onSceneReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onSceneReadyRef = useRef(onSceneReady);

  // Keep ref up to date
  useEffect(() => {
    onSceneReadyRef.current = onSceneReady;
  }, [onSceneReady]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    let scene: Scene | null = null;
    let mounted = true;

    const init = async () => {
      try {
        const havokInstance = await HavokPhysics();
        if (!mounted) return;

        const havokPlugin = new HavokPlugin(true, havokInstance);
        scene = new Scene(engine);
        scene.clearColor = new Color4(0.02, 0.02, 0.02, 1);
        scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);
        PostProcess(scene);

        if (mounted) {
          onSceneReadyRef.current(scene);
          engine.runRenderLoop(() => {
            if (scene) scene.render();
          });
        }
      } catch (err) {
        // Optional: report error to UI/logger
        console.error('Failed to initialize Havok', err);
        engine.dispose();
      }
    };

    init();

    const resize = () => {
      engine.resize();
    };

    window.addEventListener('resize', resize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', resize);
      disposeController(); // Clean up controller listeners
      scene?.dispose();
      engine?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block outline-none touch-none"
    />
  );
};
