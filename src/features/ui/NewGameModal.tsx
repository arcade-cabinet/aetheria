import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { CLASSES, type CharacterClass } from '../../game/Classes';
// import { generateSeedPhrase } from '../features/gen/SeedGenerator'; // Need to check if this is ported
// We need a PRNG for RN. seedrandom works.

interface NewGameModalProps {
    visible: boolean;
    onStart: (seed: string, cls: CharacterClass) => void;
    onCancel: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({ visible, onStart, onCancel }) => {
    const [seed, setSeed] = useState("Darkness");
    const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.header}>Rise from the Grave</Text>
                    
                    {/* Seed */}
                    <Text style={styles.label}>Soul Signature</Text>
                    <View style={styles.row}>
                        <TextInput 
                            style={styles.input} 
                            value={seed} 
                            onChangeText={setSeed} 
                            placeholderTextColor="#8a805d"
                            testID="seed-input"
                        />
                    </View>

                    {/* Classes */}
                    <Text style={styles.label}>Archetype</Text>
                    <View style={styles.classRow}>
                        {CLASSES.map(cls => (
                            <TouchableOpacity 
                                key={cls.id} 
                                onPress={() => setSelectedClass(cls)}
                                style={[styles.classCard, selectedClass.id === cls.id && styles.selectedCard]}
                                testID={`class-select-${cls.id}`}
                            >
                                <Image 
                                    source={
                                        cls.id === 'dread_knight' ? require('../../../assets/ui/portraits/dread_knight.png') :
                                        cls.id === 'assassin' ? require('../../../assets/ui/portraits/assassin.png') :
                                        require('../../../assets/ui/portraits/warlock.png')
                                    } 
                                    style={styles.portrait}
                                /> 
                                <Text style={styles.classText}>{cls.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={styles.cancelText}>Return</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.startButton} 
                            onPress={() => onStart(seed, selectedClass)}
                            testID="start-button"
                        >
                            <Text style={styles.startText}>Awaken</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    container: { width: '90%', backgroundColor: '#0e020e', borderColor: '#7a7052', borderWidth: 1, padding: 20, borderRadius: 8 },
    header: { color: '#c0b283', fontSize: 24, textAlign: 'center', marginBottom: 20, fontFamily: 'System' }, // Need custom font
    label: { color: '#8a805d', fontSize: 12, textTransform: 'uppercase', marginBottom: 5 },
    row: { flexDirection: 'row', marginBottom: 20 },
    input: { flex: 1, backgroundColor: '#000', borderColor: '#7a7052', borderWidth: 1, color: '#ede7ff', padding: 10 },
    classRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 20 },
    classCard: { flex: 1, alignItems: 'center', padding: 10, borderColor: '#7a7052', borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    selectedCard: { borderColor: '#9d00ff', backgroundColor: '#2d0a35' },
    portrait: { width: '100%', aspectRatio: 0.75, marginBottom: 5, borderRadius: 2 },
    portraitPlaceholder: { width: '100%', aspectRatio: 0.75, backgroundColor: '#000', marginBottom: 5 },
    classText: { color: '#ede7ff', fontSize: 10, textAlign: 'center' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    startButton: { backgroundColor: '#1a1412', borderColor: '#8a805d', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 20 },
    startText: { color: '#c0b283', fontWeight: 'bold' },
    cancelText: { color: '#8a805d' }
});
