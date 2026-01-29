import React, { useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HavokPlugin } from '@babylonjs/core/Physics/v2/Plugins/havokPlugin';
import HavokPhysics from '@babylonjs/havok';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/core/Physics/physicsEngineComponent'; // Side-effect for physics

import { PostProcess } from './PostProcess';

interface GameSceneProps {
  onSceneReady: (scene: Scene) => void;
}

export const GameScene: React.FC<GameSceneProps> = ({ onSceneReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    let scene: Scene;
    let havokPlugin: HavokPlugin;

    const init = async () => {
      // Initialize Havok
      const havokInstance = await HavokPhysics();
      havokPlugin = new HavokPlugin(true, havokInstance);

      scene = new Scene(engine);
      scene.clearColor = new Color4(0.02, 0.02, 0.02, 1); // Dark void base

      // Enable Physics
      scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

      // Setup Post Process
      PostProcess(scene);

      // Notify parent
      onSceneReady(scene);
      setLoaded(true);

      engine.runRenderLoop(() => {
        scene.render();
      });
    };

    init();

    const resize = () => {
      engine.resize();
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
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
