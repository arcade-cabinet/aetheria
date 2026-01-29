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
    onStartGame?: (seed: string, cls: CharacterClass, stats: Record<string, number>) => void;
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

    const handleEmbark = (seed: string, cls: CharacterClass, stats: Record<string, number>) => {
        setShowNewGame(false);
        setStarted(true);
        if (onStartGame) onStartGame(seed, cls, stats);
    };

	return (
		<div className="absolute inset-0 z-10 font-gothic pointer-events-none">
			{/* Landing Page Overlay */}
			{!started && !showNewGame && (
				<div className="absolute inset-0 bg-[#050005] z-50 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-1000">
					
					{/* Hero Section - Jules Aesthetic Arrangement */}
					<div className="flex flex-col items-center mb-12 animate-fade-in-slow">
						{/* Icon */}
						<div className="mb-8 scale-125 opacity-90">
							<BlackRoseLogo />
						</div>

						{/* Title */}
						<h1 className="text-6xl md:text-8xl text-[#c0b283] tracking-[0.15em] drop-shadow-[0_0_25px_rgba(192,178,131,0.2)] text-center font-normal uppercase">
							AETHERIA
						</h1>

						{/* Subtitle */}
						<div className="mt-6 flex items-center gap-6 text-[#8a805d] text-sm tracking-[0.4em] font-mono uppercase opacity-70">
							<span className="w-16 h-[1px] bg-gradient-to-l from-[#8a805d] to-transparent" />
							<span>The Fractured Realm</span>
							<span className="w-16 h-[1px] bg-gradient-to-r from-[#8a805d] to-transparent" />
						</div>
					</div>

					{/* Main Menu */}
					<div className="flex flex-col gap-4 mt-4 items-center w-full max-w-sm">
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