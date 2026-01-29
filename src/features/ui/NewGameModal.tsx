import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { generateSeedPhrase, createRng } from "../gen/SeedGenerator";
import { CLASSES, type CharacterClass } from "../../game/Classes";
import { AetheriaButton } from "./Button";

interface NewGameModalProps {
    onStart: (seed: string, characterClass: CharacterClass, stats: Record<string, number>) => void;
    onCancel: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({ onStart, onCancel }) => {
    const [seed, setSeed] = useState("");
    const [selectedClass, setSelectedClass] = useState<CharacterClass>(CLASSES[0]); // Default Warrior
    const [rollCount, setRollCount] = useState(0);

    // Initial seed
    useEffect(() => {
        setSeed(generateSeedPhrase());
    }, []);

    // Deterministic stats based on seed + roll count + class bounds
    const currentStats = useMemo(() => {
        const rng = createRng(`${seed}-${rollCount}-${selectedClass.id}`);
        
        // Helper to roll between min and max (inclusive)
        const rollStat = (bounds: { min: number, max: number }) => {
            return Math.floor(rng() * (bounds.max - bounds.min + 1)) + bounds.min;
        };

        return {
            strength: rollStat(selectedClass.stats.strength),
            dexterity: rollStat(selectedClass.stats.dexterity),
            intelligence: rollStat(selectedClass.stats.intelligence),
            vitality: rollStat(selectedClass.stats.vitality),
        };
    }, [seed, selectedClass, rollCount]);

    const handleShuffleSeed = () => {
        setSeed(generateSeedPhrase());
        setRollCount(0);
    };

    const handleRollStats = () => {
        setRollCount(prev => prev + 1);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-gothic animate-in fade-in zoom-in duration-300 pointer-events-auto">
            <div className="relative w-full max-w-2xl glass-metallic border-filigree p-8 rounded-lg flex flex-col gap-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                
                {/* Header */}
                <div className="text-center border-b border-[#7a7052] pb-4">
                    <h2 className="text-2xl text-[#c0b283] tracking-[0.2em] uppercase glow-text">Rise from the Grave</h2>
                    <p className="text-xs text-[#8a805d] mt-2">Who were you before the fall?</p>
                </div>

                {/* Seed Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#8a805d] uppercase tracking-widest">Soul Signature (Seed)</label>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={seed} 
                            onChange={(e) => setSeed(e.target.value)}
                            className="flex-grow bg-black/50 border border-[#7a7052] text-[#ede7ff] px-4 py-3 font-mono text-sm focus:border-[#9d00ff] outline-none transition-colors"
                        />
                        <button 
                            type="button"
                            onClick={handleShuffleSeed}
                            className="px-4 py-2 border border-[#7a7052] text-[#c0b283] hover:text-[#9d00ff] hover:border-[#9d00ff] transition-all flex items-center gap-2"
                            title="Shuffle Seed"
                        >
                            <span className="text-lg">🎲</span>
                        </button>
                    </div>
                </div>

                {/* Class Selection - Joint Selector */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#8a805d] uppercase tracking-widest">Archetype</label>
                    <div className="flex justify-between gap-2">
                        {CLASSES.map((cls) => (
                            <button
                                key={cls.id}
                                type="button"
                                onClick={() => {
                                    setSelectedClass(cls);
                                    setRollCount(0);
                                }}
                                className={`
                                    flex-1 flex flex-col items-center p-1 border transition-all duration-300 group relative
                                    ${selectedClass.id === cls.id 
                                        ? "bg-[#2d0a35] border-[#9d00ff] shadow-[0_0_15px_rgba(157,0,255,0.4)] z-10 scale-105" 
                                        : "bg-black/30 border-[#7a7052] opacity-70 hover:opacity-100 hover:border-[#c0b283] hover:bg-[#1a120b]"}
                                `}
                            >
                                {/* Portrait Placeholder */}
                                <div className={`w-full aspect-[3/4] mb-2 overflow-hidden border-b ${selectedClass.id === cls.id ? "border-[#9d00ff]" : "border-[#7a7052]"}`}>
                                    <img 
                                        src={`/assets/ui/portraits/${cls.id}.png`} 
                                        alt={cls.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 ${selectedClass.id === cls.id ? "scale-110" : "scale-100 opacity-70 group-hover:opacity-100"}`}
                                    />
                                </div>
                                <span className={`text-[10px] text-center font-bold uppercase tracking-wider ${selectedClass.id === cls.id ? "text-[#ede7ff]" : "text-[#8a805d]"}`}>
                                    {cls.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details & Stat Rolling */}
                <div className="flex gap-6 p-4 bg-black/40 border border-[#7a7052]/50 rounded relative">
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-[#c0b283] text-lg font-bold">{selectedClass.name}</h3>
                            <p className="text-sm text-gray-400 mt-1 italic leading-relaxed">"{selectedClass.description}"</p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-[#7a7052]/30">
                            <label className="text-[10px] text-[#8a805d] uppercase tracking-widest mb-1 block">Primary Skill</label>
                            <div className="text-[#ede7ff] text-sm font-bold">{selectedClass.skills[0].name}</div>
                            <div className="text-xs text-gray-500">{selectedClass.skills[0].description}</div>
                        </div>
                    </div>
                    
                    <div className="w-[1px] bg-[#7a7052]/30" />
                    
                    <div className="w-1/3 text-sm flex flex-col gap-1">
                        <div className="flex justify-between"><span className="text-gray-500 uppercase text-[10px]">STR</span> <span className="text-[#ede7ff] font-mono">{currentStats.strength}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 uppercase text-[10px]">DEX</span> <span className="text-[#ede7ff] font-mono">{currentStats.dexterity}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 uppercase text-[10px]">INT</span> <span className="text-[#ede7ff] font-mono">{currentStats.intelligence}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 uppercase text-[10px]">VIT</span> <span className="text-[#ede7ff] font-mono">{currentStats.vitality}</span></div>
                        
                        <button 
                            type="button"
                            onClick={handleRollStats}
                            className="mt-4 py-2 border border-[#7a7052] bg-[#1a120b] text-[#c0b283] hover:text-[#9d00ff] hover:border-[#9d00ff] text-[10px] uppercase tracking-widest transition-all shadow-lg"
                        >
                            Re-Roll Stats
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-4">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="text-[#8a805d] hover:text-[#c0b283] text-sm uppercase tracking-widest transition-colors"
                    >
                        Return to Void
                    </button>
                    
                    <AetheriaButton onClick={() => onStart(seed, selectedClass, currentStats)}>
                        Awaken
                    </AetheriaButton>
                </div>

            </div>
        </div>
    );
};
