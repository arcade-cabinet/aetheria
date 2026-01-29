import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { GameView } from './src/game/GameView';
import { NewGameModal } from './src/features/ui/NewGameModal';
import { type CharacterClass } from './src/game/Classes';
import { HUD } from './src/features/ui/HUD';
import { TouchControls } from './src/features/ui/TouchControls';
import { NarrativeUI } from './src/features/ui/NarrativeUI';
import { PersistenceManager } from './src/features/persistence/PersistenceManager';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Set initial system colors
        await SystemUI.setBackgroundColorAsync('#050005');
        await NavigationBar.setBackgroundColorAsync('#050005');
        await NavigationBar.setVisibilityAsync('hidden'); // Immersive mode
        
        // 2. Initialize Persistence
        await PersistenceManager.init();
        
        // 3. Load fonts, assets, etc here if needed
        // await Font.loadAsync({ ... });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately!
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const handleStart = (seed: string, cls: CharacterClass) => {
    console.log(`Starting game with seed: ${seed}, class: ${cls.name}`);
    setShowModal(false);
    setInGame(true);
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
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