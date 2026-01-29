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
                <div className="w-1 h-1 bg-white rounded-full opacity-50 mb-4" /> {/* Reticle */}
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/10 text-white text-sm font-medium animate-in fade-in zoom-in duration-200">
                    <span className="text-yellow-400 font-bold mr-2">[E]</span>
                    {label}
                </div>
            </div>
        </div>
    );
};
