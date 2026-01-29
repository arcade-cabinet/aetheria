import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuestStore } from '../narrative/QuestManager';
import { useDialogueStore } from '../narrative/DialogueManager';

export const NarrativeUI = () => {
    const { activeQuestId, quests } = useQuestStore();
    const { isOpen, currentNode, selectOption } = useDialogueStore();

    const activeQuest = activeQuestId ? quests[activeQuestId] : null;

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Quest Tracker (Top Right) */}
            {activeQuest && (
                <View style={styles.tracker}>
                    <Text style={styles.trackerHeader}>Current Objective</Text>
                    <Text style={styles.questTitle}>{activeQuest.title}</Text>
                    {activeQuest.objectives.map(obj => (
                        <View key={obj.id} style={styles.objectiveRow}>
                            <Text style={styles.objectiveText}>- {obj.description}</Text>
                            <Text style={styles.objectiveText}>{obj.current}/{obj.count}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Dialogue Modal (Center Bottom) */}
            {isOpen && currentNode && (
                <View style={styles.dialogueContainer}>
                    <View style={styles.dialogueBox}>
                        <Text style={styles.speaker}>{currentNode.speaker}</Text>
                        <Text style={styles.text}>"{currentNode.text}"</Text>
                        
                        <View style={styles.options}>
                            {currentNode.options.map(opt => (
                                <TouchableOpacity 
                                    key={opt.id} 
                                    style={styles.optionBtn}
                                    onPress={() => selectOption(opt.nextNodeId)}
                                >
                                    <Text style={styles.optionText}>▶ {opt.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject },
    
    tracker: { position: 'absolute', top: 60, right: 20, width: 250, backgroundColor: 'rgba(10,10,12,0.8)', borderColor: '#7a7052', borderWidth: 1, padding: 10, borderRadius: 4 },
    trackerHeader: { color: '#c0b283', fontSize: 10, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: 'rgba(122,112,82,0.3)', marginBottom: 5, paddingBottom: 2 },
    questTitle: { color: '#ede7ff', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
    objectiveRow: { flexDirection: 'row', justifyContent: 'space-between' },
    objectiveText: { color: '#999', fontSize: 10 },

    dialogueContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 100 },
    dialogueBox: { width: '90%', maxWidth: 600, backgroundColor: 'rgba(10,10,12,0.9)', borderColor: '#7a7052', borderWidth: 1, padding: 20, borderRadius: 8 },
    speaker: { color: '#9d00ff', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 5 },
    text: { color: '#ede7ff', fontSize: 16, fontFamily: 'System', marginBottom: 20, borderLeftWidth: 2, borderLeftColor: '#c0b283', paddingLeft: 10 },
    options: { gap: 10 },
    optionBtn: { backgroundColor: 'rgba(0,0,0,0.5)', borderColor: '#7a7052', borderWidth: 1, padding: 10, borderRadius: 4 },
    optionText: { color: '#c0b283', fontSize: 12, textTransform: 'uppercase' }
});
