import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlayer } from '../../ecs/hooks';

export const HUD = () => {
    const player = usePlayer();

    const healthPercent = useMemo(() => {
        if (!player || !player.health || !player.maxHealth) return 0;
        return (player.health / player.maxHealth) * 100;
    }, [player?.health, player?.maxHealth]);

    const xpPercent = useMemo(() => {
        if (!player || !player.xp || !player.targetXP) return 0;
        return (player.xp / player.targetXP) * 100;
    }, [player?.xp, player?.targetXP]);

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Crosshair */}
            <View style={styles.crosshairContainer} pointerEvents="none">
                <View style={styles.dot} />
                <View style={styles.lineH} />
                <View style={styles.lineV} />
            </View>

            {/* Health & Progression (Bottom Left) */}
            <View style={styles.healthPanel} testID="hud-health-panel">
                <View style={styles.row}>
                    <Text style={styles.label}>LVL {player?.level || 1}</Text>
                    <Text style={styles.value} testID="hud-health-value">{player?.health || 0} / {player?.maxHealth || 0} HP</Text>
                </View>
                
                {/* Health Bar */}
                <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: `${healthPercent}%`, backgroundColor: '#9d00ff' }]} testID="hud-health-bar" />
                </View>

                {/* XP Bar */}
                <View style={[styles.barContainer, { height: 4, marginTop: 4, borderColor: 'rgba(0, 255, 255, 0.2)' }]}>
                    <View style={[styles.barFill, { width: `${xpPercent}%`, backgroundColor: '#00ffff' }]} testID="hud-xp-bar" />
                </View>
            </View>

            {/* Inventory (Bottom Right) */}
            <View style={styles.inventoryPanel} testID="hud-inventory-panel">
                <Text style={styles.label}>Inventory</Text>
                <View style={styles.grid}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <View key={i} style={styles.slot} testID={`hud-inventory-slot-${i}`}>
                            {player?.inventory && player.inventory[i] ? (
                                <Text style={styles.slotText} testID={`hud-inventory-slot-${i}-item`}>?</Text>
                            ) : null}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end', padding: 20 },
    crosshairContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#9d00ff' },
    lineH: { position: 'absolute', width: 16, height: 1, backgroundColor: 'rgba(192,178,131,0.4)' },
    lineV: { position: 'absolute', width: 1, height: 16, backgroundColor: 'rgba(192,178,131,0.4)' },
    
    healthPanel: { width: '30%', maxWidth: 300, minWidth: 200, backgroundColor: 'rgba(10,10,12,0.8)', borderColor: '#7a7052', borderWidth: 1, padding: 12, borderRadius: 4 },
    inventoryPanel: { width: '30%', maxWidth: 300, minWidth: 200, backgroundColor: 'rgba(10,10,12,0.8)', borderColor: '#7a7052', borderWidth: 1, padding: 12, borderRadius: 4 },
    
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { color: '#c0b283', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
    value: { color: '#ede7ff', fontSize: 10, fontFamily: 'System' }, // Monospace if possible
    
    barContainer: { height: 8, backgroundColor: '#000', borderColor: 'rgba(122,112,82,0.3)', borderWidth: 1, borderRadius: 4, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: '#9d00ff' },
    
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    slot: { width: 30, height: 30, backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(122,112,82,0.3)', borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    slotText: { color: '#ede7ff', fontSize: 10 }
});
