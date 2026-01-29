import type React from "react";
import { type ReactNode, useState } from "react";
import { BlackRoseLogo } from "../features/ui/BlackRoseLogo";
import { ProgressIndicator } from "../features/ui/ProgressIndicator";
import { AetheriaButton } from "../features/ui/Button";
import { NewGameModal } from "../features/ui/NewGameModal";
import type { CharacterClass } from "../game/Classes";

interface LayoutProps {
	children?: ReactNode;
	loadingProgress?: number;
	loadingLabel?: string;
	isLoaded?: boolean;
    onStartGame?: (seed: string, cls: CharacterClass) => void;
}

export const Layout: React.FC<LayoutProps> = ({
	children,
	loadingProgress = 0,
	loadingLabel = "Loading...",
	isLoaded = false,
    onStartGame
}) => {
	const [started, setStarted] = useState(false);
    const [showNewGame, setShowNewGame] = useState(false);

    const handleEmbark = (seed: string, cls: CharacterClass) => {
        setShowNewGame(false);
        setStarted(true);
        if (onStartGame) onStartGame(seed, cls);
    };

	return (
		<div className="absolute inset-0 z-10 font-gothic pointer-events-none">
			{/* Landing Page Overlay */}
			{!started && !showNewGame && (
				<div className="absolute inset-0 bg-[#050005] z-50 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-1000">
					
                    {/* Hero Section */}
					<div className="relative mb-8 max-w-4xl w-full p-4 flex flex-col items-center animate-fade-in-slow">
                        
                        {/* The Black Rose - Restored Brand Identity */}
                        <div className="w-24 h-24 mb-6 drop-shadow-[0_0_15px_rgba(157,0,255,0.6)] animate-pulse-slow">
                            <BlackRoseLogo className="w-full h-full text-[#9d00ff]" />
                        </div>
					</div>

					{/* Main Menu */}
					<div className="flex flex-col gap-4 mt-8 items-center w-full max-w-sm">
                        <AetheriaButton onClick={() => setShowNewGame(true)}>
                            New Game
                        </AetheriaButton>
                        
                        <AetheriaButton disabled>
                            Continue
                        </AetheriaButton>

                        <AetheriaButton onClick={() => console.log("Settings clicked")}>
                            Settings
                        </AetheriaButton>
					</div>
				</div>
			)}

            {/* New Game Modal */}
            {showNewGame && (
                <NewGameModal 
                    onStart={handleEmbark}
                    onCancel={() => setShowNewGame(false)}
                />
            )}

			{/* Loading Screen Overlay (Visible after start, before load) */}
			{started && !isLoaded && (
				<div className="absolute inset-0 bg-[#050005] z-40 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-500">
					<div className="relative w-full h-full max-w-5xl max-h-[80vh] flex flex-col items-center justify-center p-8">
						<img
							src="/assets/ui/splash.png"
							alt="Loading..."
							className="max-w-full max-h-[40vh] object-contain mb-12 drop-shadow-[0_0_50px_rgba(157,0,255,0.2)] opacity-80"
						/>
						<div className="w-full max-w-md">
							<ProgressIndicator
								progress={loadingProgress}
								label={loadingLabel}
							/>
						</div>
					</div>
				</div>
			)}

			{/* In-Game HUD (Visible after start AND loaded) */}
			<div
				className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-1000 ${started && isLoaded ? "opacity-100" : "opacity-0 invisible"}`}
			>
				{/* Top Bar */}
				<header className="w-full flex justify-between items-start">
					<div className="glass-metallic px-6 py-3 rounded-sm border-filigree pointer-events-auto flex items-center gap-4">
						<div className="w-8 h-8 opacity-80">
							<BlackRoseLogo className="w-full h-full" />
						</div>
						<div>
							<h1 className="text-[#c0b283] font-bold tracking-widest uppercase text-xs glow-text">
								Aetheria
							</h1>
							<div className="text-[10px] text-[#7a7052] font-mono mt-0.5">
								SYS.PHYSICS.ACTIVE
							</div>
						</div>
					</div>
				</header>

				{/* Main Content Area */}
				<main className="flex-grow flex items-center justify-center pointer-events-none">
					{children}
				</main>

				{/* Bottom Bar / HUD */}
				<footer className="w-full flex justify-center pointer-events-auto pb-4">
					<div className="glass-metallic px-12 py-3 rounded-sm border-filigree flex gap-8">
						<div className="text-center">
							<div className="text-[10px] text-[#8a805d] uppercase tracking-widest">
								Status
							</div>
							<div className="text-[#e0d0ff] text-xs glow-text">Stable</div>
						</div>
						<div className="w-[1px] h-full bg-[#8a805d]/30" />
						<div className="text-center">
							<div className="text-[10px] text-[#8a805d] uppercase tracking-widest">
								Ether
							</div>
							<div className="text-[#9d00ff] text-xs font-bold glow-text">
								100%
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
};