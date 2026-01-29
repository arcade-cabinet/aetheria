import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { world } from '../../ecs/World';
import { usePlayer } from '../../ecs/hooks';

export const DebugOverlay = () => {
    const player = usePlayer();
    const [stats, setStats] = useState({ fps: 60, entities: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                fps: 60, // Placeholder
                entities: world.entities.length
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container} pointerEvents="none">
            <Text style={styles.text}>TESTBED MODE</Text>
            <Text style={styles.text}>Entities: {stats.entities}</Text>
            <Text style={styles.text}>Inv: {player?.inventory?.length || 0}</Text>
            <Text style={styles.text} testID="debug-player-health">HP: {player?.health}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 5 },
    text: { color: '#0f0', fontFamily: 'monospace', fontSize: 10 }
});
