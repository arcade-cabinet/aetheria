import type React from "react";
import { useQuestStore } from "../narrative/QuestManager";
import { useDialogueStore } from "../narrative/DialogueManager";

export const NarrativeUI: React.FC = () => {
    const { activeQuestId, quests } = useQuestStore();
    const { isOpen, currentNode, selectOption } = useDialogueStore();

    const activeQuest = activeQuestId ? quests[activeQuestId] : null;

    return (
        <>
            {/* Quest Tracker (HUD Top Right) */}
            {activeQuest && (
                <div className="w-64 glass-metallic border-filigree p-4 rounded animate-in slide-in-from-right duration-500 pointer-events-auto hover:bg-[#1a120b] transition-colors shadow-lg">
                    <h3 className="text-[#c0b283] text-xs font-bold uppercase tracking-widest mb-2 border-b border-[#7a7052]/30 pb-1">
                        Current Objective
                    </h3>
                    <div className="text-[#ede7ff] text-sm font-bold mb-1">{activeQuest.title}</div>
                    <div className="flex flex-col gap-1">
                        {activeQuest.objectives.map(obj => (
                            <div key={obj.id} className="text-xs text-gray-400 flex justify-between">
                                <span>- {obj.description}</span>
                                <span>{obj.current}/{obj.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dialogue Modal (Center Bottom) */}
            {isOpen && currentNode && (
                <div className="absolute inset-x-0 bottom-12 z-50 flex justify-center pointer-events-auto backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-3xl glass-metallic border-filigree p-6 rounded-lg shadow-2xl mx-4">
                        
                        {/* Speaker Name */}
                        <div className="text-[#9d00ff] text-sm font-bold uppercase tracking-widest mb-2">
                            {currentNode.speaker}
                        </div>

                        {/* Text */}
                        <p className="text-[#ede7ff] text-lg font-serif leading-relaxed mb-6 border-l-2 border-[#c0b283] pl-4">
                            "{currentNode.text}"
                        </p>

                        {/* Options */}
                        <div className="flex flex-col gap-2 items-start">
                            {currentNode.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => selectOption(opt.nextNodeId)}
                                    className="px-4 py-2 bg-black/40 border border-[#7a7052] text-[#c0b283] hover:text-[#9d00ff] hover:border-[#9d00ff] hover:bg-[#2d0a35] transition-all text-left w-full rounded-sm text-sm uppercase tracking-wide"
                                >
                                    ▶ {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
