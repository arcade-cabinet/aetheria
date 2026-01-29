import { Engine } from "@babylonjs/core/Engines/engine";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import {
	AssetsManager,
} from "@babylonjs/core/Misc/assetsManager";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Materials/Textures/Loaders/exrTextureLoader";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import type React from "react";
import { useEffect, useRef } from "react";
import "@babylonjs/core/Physics/physicsEngineComponent";

import { assetRegistry } from "../ecs/AssetRegistry";
import { disposeController } from "../ecs/systems/ControllerSystem";
import { world } from "../ecs/World";
import { ChunkManager } from "../features/world/ChunkManager";
import { PostProcess } from "./PostProcess";

interface GameSceneProps {
	onSceneReady: (scene: Scene) => void;
	onProgress: (progress: number, label?: string) => void;
	onLoaded: () => void;
}

export const GameScene: React.FC<GameSceneProps> = ({
	onSceneReady,
	onProgress,
	onLoaded,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const onSceneReadyRef = useRef(onSceneReady);
	const onProgressRef = useRef(onProgress);
	const onLoadedRef = useRef(onLoaded);

	// Keep refs up to date
	useEffect(() => {
		onSceneReadyRef.current = onSceneReady;
		onProgressRef.current = onProgress;
		onLoadedRef.current = onLoaded;
	}, [onSceneReady, onProgress, onLoaded]);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const engine = new Engine(canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true,
		});

		let scene: Scene | null = null;
		let chunkManager: ChunkManager | null = null;
		let mounted = true;

		const init = async () => {
			try {
				// Initialize Havok
				const havokInstance = await HavokPhysics();

				if (!mounted) return; // Abort if unmounted

				const havokPlugin = new HavokPlugin(true, havokInstance);

				scene = new Scene(engine);
				scene.clearColor = new Color4(0.01, 0.01, 0.01, 1);

				scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

				// Setup Environment (Local Assets Only)
				// We use createDefaultSkybox or just environmentTexture
				// Use the .exr if possible (needs HDR loader) or the .png tonemapped version
				// For simplicity and immediate compatibility, we'll use the environment texture setter
				const envTexture = CubeTexture.CreateFromPrefilteredData(
					"/assets/env/DayEnvironmentHDRI005_1K_HDR.exr",
					scene,
				);
				scene.environmentTexture = envTexture;

				PostProcess(scene);

				chunkManager = new ChunkManager(scene);

				// Asset Loading
				const assetsManager = new AssetsManager(scene);
				assetsManager.useDefaultLoadingScreen = false;

				try {
					const response = await fetch("/assets/manifest.json");
					const assets = await response.json();

                    // 1. Initialize Registry (Map IDs to Paths)
                    assetRegistry.init(scene, assets);

                    // 2. Preload Critical Assets (Player, UI props)
                    // We assume 'BaseCharacter' is the ID for the player model
                    const criticalAssets = ["BaseCharacter"]; 
                    
                    // Also maybe load a few common props to ensure the first chunk pops in fast?
                    // e.g. "Floor_Brick", "Wall_Plaster_Straight"
                    // But ChunkManager will handle that. We just need Player for now.
                    
                    onProgressRef.current(10, "Loading Assets...");
                    await assetRegistry.loadAssets(criticalAssets);

				} catch (e) {
					console.warn("Could not load asset manifest or critical assets.", e);
				}

                // Finish Init
                onProgressRef.current(100, "Initializing World...");
                onLoadedRef.current();
                onSceneReadyRef.current(scene!);

                engine.runRenderLoop(() => {
                    if (scene) {
                        scene.render();
                        
                        // Chunking Logic
                        const players = world.with("isPlayer", "position");
                        // Assuming single player for now
                        for (const player of players) {
                            if (player.position) {
                                chunkManager?.update(player.position);
                                break; // Only update for one (local) player
                            }
                        }
                    }
                });
                window.addEventListener("resize", resize);
			} catch (e) {
				console.error("Failed to initialize game scene", e);
				// Cleanup if init failed halfway
				scene?.dispose();
				engine?.dispose();
			}
		};

		init();

		const resize = () => {
			engine.resize();
		};

		return () => {
			mounted = false;
			window.removeEventListener("resize", resize);
			engine.stopRenderLoop();
			disposeController(); // Clean up controller listeners
			chunkManager?.dispose();
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
