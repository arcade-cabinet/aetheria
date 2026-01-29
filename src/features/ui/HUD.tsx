import type React from "react";
import { useEffect, useState } from "react";
import { interactionState } from "../../ecs/systems/InteractionSystem";
import { world } from "../../ecs/World";

export const HUD: React.FC = () => {
    const [label, setLabel] = useState("");
    const [inventory, setInventory] = useState<string[]>([]);

    useEffect(() => {
        // Poll interaction state & inventory
        const interval = setInterval(() => {
            setLabel(interactionState.label);
            
            const player = world.with("isPlayer", "inventory").first;
            if (player && player.inventory) {
                // Check if changed to avoid render churn (simple ref check or length)
                if (player.inventory.length !== inventory.length) {
                     setInventory([...player.inventory]);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [inventory.length]); // Dependency on length to re-bind if needed, but polling handles updates

    return (
        <>
            {/* Interaction Prompt (Center) */}
            {label && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-1 h-1 bg-white rounded-full opacity-30 mb-8" />
                        <div className="glass-metallic border-filigree px-6 py-3 rounded-sm text-white text-xs font-bold tracking-widest uppercase animate-in fade-in zoom-in duration-300">
                            <span className="text-[#9d00ff] mr-3 glow-text">[E]</span>
                            {label}
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory (Bottom Right) */}
            <div className="absolute bottom-24 right-6 pointer-events-none flex flex-col gap-2 items-end">
                {inventory.map((item, i) => (
                    <div key={i} className="glass-metallic border-filigree px-4 py-2 text-xs text-[#c0b283] animate-in slide-in-from-right duration-300">
                        {item}
                    </div>
                ))}
                {inventory.length > 0 && (
                    <div className="text-[10px] text-[#7a7052] uppercase tracking-widest mt-1">Inventory</div>
                )}
            </div>
        </>
    );
};

