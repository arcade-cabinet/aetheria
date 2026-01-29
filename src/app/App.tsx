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
import { initE2ESystem, E2ESystem } from "../test/e2e/E2ESystem";
import { PersistenceManager } from "../features/persistence/PersistenceManager";
import { useQuestStore } from "../features/narrative/QuestManager";
import { HUD } from "../features/ui/HUD";
import { NarrativeUI } from "../features/ui/NarrativeUI";
import type { CharacterClass } from "../game/Classes";

const App: React.FC = () => {

	const [loadingProgress, setLoadingProgress] = useState(0);
	const [loadingLabel, setLoadingLabel] = useState("Initializing...");
	const [isLoaded, setIsLoaded] = useState(false);
    const [gameConfig, setGameConfig] = useState<{seed: string, cls: CharacterClass, stats: Record<string, number>} | null>(null);

	const onSceneReady = (scene: Scene) => {
        // 1. Audio & Persistence
        audioManager.init();
        PersistenceManager.init(); // Loads SAVED state if any
        initE2ESystem();
        
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
            E2ESystem();
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
		<div className="relative w-full h-screen bg-black overflow-hidden select-none">
			{/* 1. Game Canvas Layer */}
			<div className="absolute inset-0 z-0" id="game-container">
                {gameConfig && (
                    <GameScene 
                        onSceneReady={onSceneReady} 
                        onProgress={handleProgress}
                        onLoaded={() => setIsLoaded(true)}
                        config={gameConfig}
                    />
                )}
			</div>

			{/* 2. Unified UI Overlay (Single Layer) */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
                {/* Top: Narrative/Quest Tracker */}
                <div className="w-full flex justify-end p-6">
                    {isLoaded && <NarrativeUI />}
                </div>

                {/* Bottom: HUD (Health/Inv) */}
                <div className="w-full flex justify-between p-8 items-end">
                    {isLoaded && <HUD />}
                </div>

                {/* Overlays (Modal/Loading) */}
                <Layout 
                    loadingProgress={loadingProgress} 
                    loadingLabel={loadingLabel}
                    isLoaded={isLoaded} 
                    onStartGame={handleStartGame}
                />
            </div>
		</div>
	);
};

export default App;