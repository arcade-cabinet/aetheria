import type React from "react";
import { useMemo } from "react";
import { useEntityQuery } from "../../ecs/World";
import { NarrativeUI } from "./NarrativeUI";

export const HUD: React.FC = () => {
    // ... existing queries ...
    const player = useEntityQuery((e) => !!e.isPlayer)[0];

    const healthPercent = useMemo(() => {
        if (!player || !player.health || !player.maxHealth) return 0;
        return (player.health / player.maxHealth) * 100;
    }, [player?.health, player?.maxHealth]);

    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            <NarrativeUI />
            
            {/* Health Bar (Bottom Left) */}
            <div className="absolute bottom-8 left-8 w-64 glass-metallic p-4 border-filigree rounded-sm pointer-events-auto hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex justify-between mb-2">
                    <span className="text-[#c0b283] text-xs font-bold uppercase tracking-widest">Vitality</span>
                    <span className="text-[#ede7ff] text-xs font-mono">{player?.health || 0} / {player?.maxHealth || 0}</span>
                </div>
                <div className="w-full h-2 bg-black/50 border border-[#7a7052]/30 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[#4a0e5c] to-[#9d00ff] transition-all duration-300"
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
            </div>

            {/* Inventory (Bottom Right) */}
            <div className="absolute bottom-8 right-8 w-64 glass-metallic p-4 border-filigree rounded-sm flex flex-col gap-2 pointer-events-auto hover:scale-105 transition-transform duration-300 shadow-lg">
                 <span className="text-[#c0b283] text-xs font-bold uppercase tracking-widest mb-2">Inventory</span>
                 <div className="grid grid-cols-4 gap-2">
                    {/* Placeholder Slots */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-black/40 border border-[#7a7052]/30 flex items-center justify-center hover:border-[#9d00ff] transition-colors cursor-help">
                            {player?.inventory && player.inventory[i] ? (
                                <span className="text-xs text-[#ede7ff]">?</span> // Icon placeholder
                            ) : null}
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};
