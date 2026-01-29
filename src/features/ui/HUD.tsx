import type React from "react";
import { useEffect, useState } from "react";
import { interactionState } from "../../ecs/systems/InteractionSystem";

export const HUD: React.FC = () => {
	const [label, setLabel] = useState("");

	useEffect(() => {
		// Poll interaction state (simpler than subscription for this prototype)
		const interval = setInterval(() => {
			setLabel(interactionState.label);
		}, 100);
		return () => clearInterval(interval);
	}, []);

	if (!label) return null;

	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
			<div className="flex flex-col items-center gap-2">
				<div className="w-1 h-1 bg-white rounded-full opacity-30 mb-8" />{" "}
				{/* Reticle */}
				<div className="glass-metallic border-filigree px-6 py-3 rounded-sm text-white text-xs font-bold tracking-widest uppercase animate-in fade-in zoom-in duration-300">
					<span className="text-[#9d00ff] mr-3 glow-text">[E]</span>
					{label}
				</div>
			</div>
		</div>
	);
};
