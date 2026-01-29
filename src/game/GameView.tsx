import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { FilamentScene, FilamentView, Camera, Light, Model } from 'react-native-filament';
import { useSharedValue } from 'react-native-reanimated';

export const GameView = () => {
  // Filament State
  const cameraRef = useRef<Camera>(null);

  return (
    <View style={styles.container}>
      <FilamentScene>
        {/* Camera */}
        <Camera 
            ref={cameraRef} 
            position={[0, 10, 10]} 
            lookAt={[0, 0, 0]} 
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

        {/* Entities (Placeholder Box for now until ECS hook) */}
        {/* <Model source={require('../../assets/models/environment/medieval/Floor_Brick.glb')} /> */}

      </FilamentScene>
      <FilamentView style={styles.view} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050510' }, // Dark Fog color
  view: { flex: 1 },
});
