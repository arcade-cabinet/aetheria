import type { Scene } from "@babylonjs/core/scene";
import type React from "react";
import { useState } from "react";
import { AssemblerSystem } from "../ecs/systems/AssemblerSystem";
import { ControllerSystem } from "../ecs/systems/ControllerSystem";
import { PhysicsSystem } from "../ecs/systems/PhysicsSystem";
import { loadTestLevel } from "../features/gen/TestLevel";
import { GameScene } from "../scene/GameScene";
import { Layout } from "./Layout";

const App: React.FC = () => {

	const [loadingProgress, setLoadingProgress] = useState(0);

	const [loadingLabel, setLoadingLabel] = useState("Initializing...");

	const [isLoaded, setIsLoaded] = useState(false);



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

			<Layout 

				loadingProgress={loadingProgress} 

				loadingLabel={loadingLabel}

				isLoaded={isLoaded} 

			/>

		</div>

	);

};

export default App;
