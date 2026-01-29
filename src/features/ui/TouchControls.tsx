import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { input } from '../../ecs/systems/ControllerSystem';

export const TouchControls = () => {
    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* D-Pad / Joystick Area (Left) */}
            <View style={styles.dpad}>
                <TouchableOpacity 
                    style={styles.btnUp} 
                    onPressIn={() => input.w = true} 
                    onPressOut={() => input.w = false}
                    testID="ctrl-up"
                />
                <TouchableOpacity 
                    style={styles.btnDown} 
                    onPressIn={() => input.s = true} 
                    onPressOut={() => input.s = false}
                    testID="ctrl-down"
                />
                <TouchableOpacity 
                    style={styles.btnLeft} 
                    onPressIn={() => input.a = true} 
                    onPressOut={() => input.a = false}
                    testID="ctrl-left"
                />
                <TouchableOpacity 
                    style={styles.btnRight} 
                    onPressIn={() => input.d = true} 
                    onPressOut={() => input.d = false}
                    testID="ctrl-right"
                />
            </View>

            {/* Action Buttons (Right) */}
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.btnAction, { backgroundColor: 'rgba(255,0,0,0.5)' }]} 
                    onPress={() => {
                        input.attack = true;
                    }}
                    testID="ctrl-attack"
                >
                    <Text style={styles.btnText}>A</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.btnAction} 
                    onPress={() => {
                        input.interact = true;
                        // InteractionSystem will reset it to false after consuming
                    }}
                    testID="ctrl-interact"
                >
                    <Text style={styles.btnText}>E</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 30 },
    dpad: { width: 150, height: 150, position: 'relative' },
    btnUp: { position: 'absolute', top: 0, left: 50, width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)' },
    btnDown: { position: 'absolute', bottom: 0, left: 50, width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)' },
    btnLeft: { position: 'absolute', top: 50, left: 0, width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)' },
    btnRight: { position: 'absolute', top: 50, right: 0, width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)' },
    
    actions: { flexDirection: 'row', gap: 20 },
    btnAction: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(157,0,255,0.5)', justifyContent: 'center', alignItems: 'center', borderColor: '#fff', borderWidth: 2 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 24 }
});
