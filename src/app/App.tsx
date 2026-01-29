import type { Scene } from "@babylonjs/core/scene";
import type React from "react";
import { useState } from "react";
import { AssemblerSystem } from "../ecs/systems/AssemblerSystem";
import { ControllerSystem } from "../ecs/systems/ControllerSystem";
import { PhysicsSystem } from "../ecs/systems/PhysicsSystem";
import { GameScene } from "../scene/GameScene";
import { Layout } from "./Layout";
import { audioManager } from "../features/audio/AudioManager";
import { InteractionSystem } from "../ecs/systems/InteractionSystem";
import { HealthSystem } from "../ecs/systems/HealthSystem";
import { MinionSystem } from "../ecs/systems/MinionSystem";
import { EnemySystem } from "../ecs/systems/EnemySystem";
import { QuestSystem } from "../ecs/systems/QuestSystem";
import { NarrativeSystem } from "../ecs/systems/NarrativeSystem";
import { IndicatorSystem } from "../ecs/systems/IndicatorSystem";
import { DamageTextSystem } from "../ecs/systems/DamageTextSystem";
import { CombatSystem } from "../ecs/systems/CombatSystem";
import { HUD } from "../features/ui/HUD";
import type { CharacterClass } from "../game/Classes";

import { PersistenceManager } from "../features/persistence/PersistenceManager";
import { useQuestStore } from "../features/narrative/QuestManager";

const App: React.FC = () => {

	const [loadingProgress, setLoadingProgress] = useState(0);
	const [loadingLabel, setLoadingLabel] = useState("Initializing...");
	const [isLoaded, setIsLoaded] = useState(false);
    const [gameConfig, setGameConfig] = useState<{seed: string, cls: CharacterClass, stats: Record<string, number>} | null>(null);

	const onSceneReady = (scene: Scene) => {
        // 1. Audio & Persistence
        audioManager.init();
        PersistenceManager.init(); // Loads SAVED state if any
        
        audioManager.playAmbient("/assets/music/exploration/Retro_ Spooky Soundscape_ The Whispering Shadows Dungeon _Clement Panchout 2016.wav");

		// 2. Register Systems Loop
		scene.onBeforeRenderObservable.add(() => {
			PhysicsSystem();
			ControllerSystem();
			AssemblerSystem(scene);
			InteractionSystem(scene);
            HealthSystem();
            MinionSystem();
            EnemySystem();
            CombatSystem(scene);
            QuestSystem(scene);
            NarrativeSystem();
            IndicatorSystem(scene);
            DamageTextSystem(scene);
		});
	};

	const handleProgress = (progress: number, label?: string) => {
		setLoadingProgress(progress);
		if (label) setLoadingLabel(label);
	};

    const handleStartGame = (seed: string, cls: CharacterClass, stats: Record<string, number>) => {
        // For now, ALWAYS reset on new game trigger from UI. 
        // In future, "Continue" button would skip this.
        useQuestStore.getState().reset();
        setGameConfig({seed, cls, stats});
    };

	return (
		<div className="relative w-full h-screen bg-black overflow-hidden">
			{/* Game Layer */}
			<div className="absolute inset-0 z-0">
                {gameConfig && (
                    <GameScene 
                        onSceneReady={onSceneReady} 
                        onProgress={handleProgress}
                        onLoaded={() => setIsLoaded(true)}
                        config={gameConfig}
                    />
                )}
			</div>

			{/* UI Layer */}
            {isLoaded && <HUD />}

			<Layout 
				loadingProgress={loadingProgress} 
				loadingLabel={loadingLabel}
				isLoaded={isLoaded} 
                onStartGame={handleStartGame}
			/>
		</div>
	);
};

export default App;