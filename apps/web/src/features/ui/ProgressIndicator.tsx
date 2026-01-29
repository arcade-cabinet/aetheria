import type React from "react";

interface ProgressIndicatorProps {
	progress: number; // 0 to 100
	label?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
	progress,
	label = "Loading...",
}) => {
	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md gap-4 p-4">
			{/* Label */}
			<div className="text-[#c0b283] font-gothic tracking-widest uppercase text-sm glow-text">
				{label}
			</div>

			{/* Bar Container */}
			<div className="relative w-full h-4 bg-[#050005] border border-[#7a7052] rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] overflow-hidden">
				{/* Fill */}
				<div
					className="h-full bg-gradient-to-r from-[#2d0a35] via-[#9d00ff] to-[#2d0a35] transition-all duration-300 ease-out relative"
					style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
				>
					{/* Shimmer/Pulse effect overlay */}
					<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-shimmer" />
				</div>
			</div>

			{/* Percentage */}
			<div className="text-[#7a7052] font-mono text-xs">
				{Math.round(progress)}%
			</div>
		</div>
	);
};
