import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { GameManager } from './src/game/GameManager';
import { audioManager } from './src/features/audio/AudioManager';

import { TestbedManager } from './src/game/TestbedManager';
import { DebugOverlay } from './src/features/ui/DebugOverlay';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [isTestbed, setIsTestbed] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Set initial system colors
        await SystemUI.setBackgroundColorAsync('#050005');
        await NavigationBar.setBackgroundColorAsync('#050005');
        await NavigationBar.setVisibilityAsync('hidden'); // Immersive mode
        
        // 2. Initialize Audio
        await audioManager.init();
        // Play spooky ambient exploration music
        audioManager.playAmbient("Retro_Spooky_Soundscape_The_Whispering_Shadows_Dungeon_Clement_Panchout_2016");

        // 3. Initialize Persistence
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

  const handleStart = async (seed: string, cls: CharacterClass) => {
    console.log(`Starting game with seed: ${seed}, class: ${cls.name}`);
    await GameManager.init(); 
    setShowModal(false);
    setInGame(true);
  };

  const handleTestbed = async () => {
      console.log("Starting Testbed...");
      await TestbedManager.init();
      setShowModal(false);
      setInGame(true);
      setIsTestbed(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        
        {inGame ? (
          <View style={{ flex: 1 }}>
              <GameView />
              {/* UI Overlay Layer */}
              <View style={styles.overlay} pointerEvents="box-none">
                  {isTestbed ? <DebugOverlay /> : <HUD />}
                  {!isTestbed && <NarrativeUI />}
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
          onTestbed={handleTestbed}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050005' },
  landing: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject }
});