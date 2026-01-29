import { Audio } from 'expo-av';
import { AudioMap } from './AudioMap';

class AudioManager {
    private currentAmbient: Audio.Sound | null = null;

    async init() {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
            console.log("Audio System Initialized");
        } catch (e) {
            console.warn("Audio Init Failed", e);
        }
    }

    async playAmbient(id: string) {
        if (this.currentAmbient) {
            await this.currentAmbient.stopAsync();
            await this.currentAmbient.unloadAsync();
        }

        const source = AudioMap[id];
        if (!source) {
            console.warn(`Ambient Audio not found: ${id}`);
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            source,
            { isLooping: true, volume: 0.4 }
        );
        
        this.currentAmbient = sound;
        await sound.playAsync();
    }

    async playSfx(id: string, volume: number = 1.0) {
        const source = AudioMap[id];
        if (!source) return;

        const { sound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: true, volume }
        );
        
        // Unload after play?
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    }
}

export const audioManager = new AudioManager();