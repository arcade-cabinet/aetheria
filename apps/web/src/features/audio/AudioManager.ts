import * as Tone from "tone";

class AudioManager {
	private players: Map<string, Tone.Player> = new Map();
	private currentAmbient: Tone.Player | null = null;

	async init() {
		await Tone.start();
		console.log("Audio Context Started");
	}

	async playAmbient(url: string) {
		if (this.currentAmbient) {
			this.currentAmbient.stop();
		}

		const player = await this.getOrCreatePlayer(url);
		player.loop = true;
		player.volume.value = -12; // Start quiet
		player.start();
		this.currentAmbient = player;
	}

	async playSfx(url: string, volume: number = -6) {
		const player = await this.getOrCreatePlayer(url);
		player.volume.value = volume;
		player.start();
	}

	private async getOrCreatePlayer(url: string): Promise<Tone.Player> {
		if (this.players.has(url)) {
			return this.players.get(url)!;
		}

		return new Promise((resolve) => {
			const player = new Tone.Player(url, () => {
				this.players.set(url, player);
				player.toDestination();
				resolve(player);
			});
		});
	}
}

export const audioManager = new AudioManager();
