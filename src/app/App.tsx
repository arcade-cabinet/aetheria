import type { Scene } from "@babylonjs/core/scene";
import type React from "react";
import { useState } from "react";
import { AssemblerSystem } from "../ecs/systems/AssemblerSystem";
import { ControllerSystem } from "../ecs/systems/ControllerSystem";
import { InteractionSystem } from "../ecs/systems/InteractionSystem";
import { PhysicsSystem } from "../ecs/systems/PhysicsSystem";
import { audioManager } from "../features/audio/AudioManager";
import { loadTestLevel } from "../features/gen/TestLevel";
import { HUD } from "../features/ui/HUD";
import { GameScene } from "../scene/GameScene";
import { Layout } from "./Layout";

const App: React.FC = () => {
	const [loadingProgress, setLoadingProgress] = useState(0);

	const [loadingLabel, setLoadingLabel] = useState("Initializing...");

	const [isLoaded, setIsLoaded] = useState(false);

	const onSceneReady = (scene: Scene) => {
		// 1. Load Level

		loadTestLevel(scene);

		// 2. Start Audio
		audioManager.init().then(() => {
			audioManager.playAmbient(
				"/assets/music/exploration/Retro_ Spooky Soundscape_ The Whispering Shadows Dungeon _Clement Panchout 2016.wav",
			);
		});

		// 3. Register Systems Loop

		scene.onBeforeRenderObservable.add(() => {
			PhysicsSystem();

			ControllerSystem();

			AssemblerSystem(scene);

			InteractionSystem(scene);
		});
	};

	const handleProgress = (progress: number, label?: string) => {
		setLoadingProgress(progress);

		if (label) setLoadingLabel(label);
	};

	return (
		<div className="relative w-full h-screen bg-black overflow-hidden">
			{/* Game Layer */}

			<div className="absolute inset-0 z-0">
				<GameScene
					onSceneReady={onSceneReady}
					onProgress={handleProgress}
					onLoaded={() => setIsLoaded(true)}
				/>
			</div>

			{/* UI Layer */}
			{isLoaded && <HUD />}

			<Layout
				loadingProgress={loadingProgress}
				loadingLabel={loadingLabel}
				isLoaded={isLoaded}
			/>
		</div>
	);
};

export default App;
