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
    const [selectedClass, setSelectedClass] = useState<CharacterClass>(CLASSES[4]); // Default Wanderer
    const [rollCount, setRollCount] = useState(0);

    // Initial seed
    useEffect(() => {
        setSeed(generateSeedPhrase());
    }, []);

    // Deterministic stats based on seed + roll count + class base
    const currentStats = useMemo(() => {
        const rng = createRng(`${seed}-${rollCount}`);
        const roll = () => Math.floor(rng() * 6) + 1; // 1-6 bonus

        return {
            strength: selectedClass.stats.strength + roll(),
            dexterity: selectedClass.stats.dexterity + roll(),
            intelligence: selectedClass.stats.intelligence + roll(),
            vitality: selectedClass.stats.vitality + roll(),
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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-gothic animate-in fade-in zoom-in duration-300">
            <div className="relative w-full max-w-2xl glass-metallic border-filigree p-8 rounded-lg flex flex-col gap-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                
                {/* Header */}
                <div className="text-center border-b border-[#7a7052] pb-4">
                    <h2 className="text-2xl text-[#c0b283] tracking-[0.2em] uppercase glow-text">Construct Reality</h2>
                    <p className="text-xs text-[#8a805d] mt-2">Define the parameters of your existence.</p>
                </div>

                {/* Seed Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#8a805d] uppercase tracking-widest">World Seed</label>
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

                {/* Class Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#8a805d] uppercase tracking-widest">Origin</label>
                    <div className="grid grid-cols-5 gap-2">
                        {CLASSES.map((cls) => (
                            <button
                                key={cls.id}
                                type="button"
                                onClick={() => {
                                    setSelectedClass(cls);
                                    setRollCount(0);
                                }}
                                className={`
                                    flex flex-col items-center justify-center p-2 border transition-all duration-300
                                    ${selectedClass.id === cls.id 
                                        ? "bg-[#2d0a35] border-[#9d00ff] shadow-[0_0_10px_rgba(157,0,255,0.4)]" 
                                        : "bg-black/30 border-[#7a7052] opacity-70 hover:opacity-100 hover:border-[#c0b283]"}
                                `}
                            >
                                <div className="w-8 h-8 bg-gray-700 rounded-full mb-2" />
                                <span className="text-[10px] text-center text-[#ede7ff] leading-tight">{cls.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details & Stat Rolling */}
                <div className="flex gap-6 p-4 bg-black/40 border border-[#7a7052]/50 rounded relative">
                    <div className="flex-1">
                        <h3 className="text-[#c0b283] text-lg font-bold">{selectedClass.name}</h3>
                        <p className="text-sm text-gray-400 mt-1 italic leading-relaxed">"{selectedClass.description}"</p>
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
                            className="mt-2 py-1 border border-[#7a7052]/50 text-[#8a805d] hover:text-[#c0b283] text-[10px] uppercase tracking-tighter transition-all"
                        >
                            Roll Stats
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
                        Return
                    </button>
                    
                    <AetheriaButton onClick={() => onStart(seed, selectedClass, currentStats)}>
                        Embark
                    </AetheriaButton>
                </div>

            </div>
        </div>
    );
};
