import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GameView } from './src/game/GameView';
import { NewGameModal } from './src/features/ui/NewGameModal';
import { type CharacterClass } from './src/game/Classes';
import { HUD } from './src/features/ui/HUD';
import { TouchControls } from './src/features/ui/TouchControls';
import { NarrativeUI } from './src/features/ui/NarrativeUI';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleStart = (seed: string, cls: CharacterClass) => {
    console.log(`Starting game with seed: ${seed}, class: ${cls.name}`);
    setShowModal(false);
    setInGame(true);
    // Initialize ECS here
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {inGame ? (
        <View style={{ flex: 1 }}>
            <GameView />
            {/* UI Overlay Layer */}
            <View style={styles.overlay} pointerEvents="box-none">
                <HUD />
                <NarrativeUI />
                <TouchControls />
            </View>
        </View>
      ) : (
        <View style={styles.landing}>
            {/* Landing BG */}
        </View>
      )}

      <NewGameModal 
        visible={showModal} 
        onStart={handleStart} 
        onCancel={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050005' },
  landing: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject }
});