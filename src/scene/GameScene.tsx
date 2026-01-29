import { Engine } from "@babylonjs/core/Engines/engine";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AssetsManager, MeshAssetTask, AssetTaskState } from "@babylonjs/core/Misc/assetsManager";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { Scene } from "@babylonjs/core/scene";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import "@babylonjs/core/Materials/Textures/Loaders/exrTextureLoader";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import type React from "react";
import { useEffect, useRef } from "react";
import "@babylonjs/core/Physics/physicsEngineComponent";

import { disposeController } from "../ecs/systems/ControllerSystem";
import { assetRegistry } from "../ecs/AssetRegistry";
import { PostProcess } from "./PostProcess";
import { ChunkManager } from "../features/world/ChunkManager";
import { world } from "../ecs/World";

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
                    scene
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

					// Load a subset to avoid overwhelming memory/network for this demo if list is huge
					// For now, load all, but disable them.
					assets.forEach((path: string) => {
						const filename = path.split("/").pop()!;
						const rootUrl = path.substring(0, path.lastIndexOf("/") + 1);

						// Use MeshAssetTask to get type safety
						const task = assetsManager.addMeshTask(
							filename.replace(/\.(gltf|glb)$/, ""), // Task name = Asset ID
							"",
							rootUrl,
							filename,
						);
						
						task.onSuccess = (t) => {
							t.loadedMeshes.forEach((m) => {
								m.setEnabled(false); // Hide until needed
								m.checkCollisions = false;
							});
						};
						task.onError = () => {
							console.warn(`Failed to load asset: ${path}`);
						};
					});
				} catch (e) {
					console.warn("Could not load asset manifest, skipping pre-load.", e);
				}

				assetsManager.onProgress = (remaining, total, task) => {
					const progress = ((total - remaining) / total) * 100;
					onProgressRef.current(progress, `Loading ${task.name}...`);
				};

				assetsManager.onFinish = (tasks) => {
					if (!mounted) return;

					// Register loaded assets
					tasks.forEach(task => {
						if (task instanceof MeshAssetTask && task.taskState === AssetTaskState.DONE) {
							// We register the first mesh (root usually) or process them
							if (task.loadedMeshes.length > 0) {
								assetRegistry.register(task.name, task.loadedMeshes[0]);
							}
						}
					});

					onProgressRef.current(100, "Initializing World...");
					onLoadedRef.current();
					onSceneReadyRef.current(scene!);

					engine.runRenderLoop(() => {
						if (scene) {
							scene.render();
							
							// Chunking Logic
							const players = world.with('isPlayer', 'position');
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
				};

				// Start loading
				assetsManager.load();
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