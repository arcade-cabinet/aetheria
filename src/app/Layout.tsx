import type React from "react";
import { type ReactNode, useState } from "react";
import { BlackRoseLogo } from "../features/ui/BlackRoseLogo";
import { ProgressIndicator } from "../features/ui/ProgressIndicator";

interface LayoutProps {

	children?: ReactNode;

	loadingProgress?: number;

	loadingLabel?: string;

	isLoaded?: boolean;

}



export const Layout: React.FC<LayoutProps> = ({ children, loadingProgress = 0, loadingLabel = "Loading...", isLoaded = false }) => {

	const [started, setStarted] = useState(false);



	return (

		<div className="absolute inset-0 z-10 font-gothic pointer-events-none">

			{/* Landing Page Overlay */}

			{!started && (

				<div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-1000">

					{/* Main Graphical Logo */}

					<div className="relative mb-8 max-w-4xl w-full p-4 animate-fade-in-slow">

						<img

							src="/logo_title.jpg"

							alt="Aetheria: The Fractured Realm"

							className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(157,0,255,0.5)] mask-image-gradient"

						/>

						<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-20" />

					</div>



					{/* Organic Menu / Button */}

					<div className="mt-8">

						<button

							type="button"

							onClick={() => setStarted(true)}

							className="group relative px-16 py-5 bg-[#1a120b] border-2 border-[#7a7052] text-[#c0b283] hover:text-[#e0d0ff] hover:border-[#9d00ff] transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.9)]"

						>

							<span className="relative z-10 tracking-[0.3em] uppercase text-lg font-bold drop-shadow-md group-hover:drop-shadow-[0_0_10px_rgba(157,0,255,0.8)] transition-all">

								Enter the Realm

							</span>



							{/* Hover Effect - Eerie Purple fill */}

							<div className="absolute inset-0 bg-[#2d0a35] opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-md" />

						</button>

					</div>

				</div>			)}



			{/* Loading Screen Overlay (Visible after start, before load) */}

			{started && !isLoaded && (

				<div className="absolute inset-0 bg-[#050005] z-40 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-500">

					<div className="relative w-full h-full max-w-5xl max-h-[80vh] flex flex-col items-center justify-center p-8">

						{/* Responsive Splash Image */}

						<img 

							src="/assets/ui/splash.png" 

							alt="Loading..." 

							className="max-w-full max-h-[60vh] object-contain mb-8 drop-shadow-[0_0_50px_rgba(157,0,255,0.2)]"

						/>

						

						{/* Progress Bar */}

						<div className="w-full max-w-md">

							<ProgressIndicator progress={loadingProgress} label={loadingLabel} />

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
