import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { FilamentScene, FilamentView, Camera, Light } from 'react-native-filament';
import { WorldRenderer } from './WorldRenderer';
import { useGameLoop } from './GameLoop';
import { RenderState } from './RenderContext';
import { useDerivedValue } from 'react-native-reanimated';

export const GameView = () => {
  const cameraRef = useRef<Camera>(null);
  
  // Start ECS Loop
  useGameLoop();

  // Derived Camera Position for Filament
  // Camera takes [x, y, z] position and [x, y, z] lookAt
  const camPos = useDerivedValue(() => {
    return [RenderState.cameraPos.x.value, RenderState.cameraPos.y.value, RenderState.cameraPos.z.value] as [number, number, number];
  });

  const lookAtPos = useDerivedValue(() => {
    return [RenderState.playerPos.x.value, RenderState.playerPos.y.value, RenderState.playerPos.z.value] as [number, number, number];
  });

  return (
    <View style={styles.container}>
      <FilamentScene>
        {/* Production Camera Follow */}
        <Camera 
            ref={cameraRef} 
            position={camPos} 
            lookAt={lookAtPos} 
        />

        {/* Lighting (Moonlight) */}
        <Light 
            type="directional" 
            color="#aaccff" 
            intensity={100000} 
            direction={[-1, -2, -1]} 
            castShadows={true} 
        />
        <Light 
            type="ambient" 
            color="#405060" 
            intensity={5000} 
        />

        {/* ECS World Rendering */}
        <WorldRenderer />

      </FilamentScene>
      <FilamentView style={styles.view} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050510' },
  view: { flex: 1 },
});