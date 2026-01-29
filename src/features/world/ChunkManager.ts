import type { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import { Chunk } from "./Chunk";

export class ChunkManager {
	private chunks: Map<string, Chunk> = new Map();
	private chunkSize: number = 16;
	private renderDistance: number = 2; // Radius in chunks

	constructor(private scene: Scene) {}

	update(playerPosition: Vector3) {
		const centerChunkX = Math.round(playerPosition.x / this.chunkSize);
		const centerChunkZ = Math.round(playerPosition.z / this.chunkSize);

		const activeKeys = new Set<string>();

		// 1. Load/Generate required chunks
		for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
			for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
				const chunkX = centerChunkX + x;
				const chunkZ = centerChunkZ + z;
				const key = `${chunkX},${chunkZ}`;
				activeKeys.add(key);

				if (!this.chunks.has(key)) {
					this.chunks.set(
						key,
						new Chunk(this.scene, chunkX, chunkZ, this.chunkSize),
					);
				}
			}
		}

		// 2. Unload distant chunks
		for (const [key, chunk] of this.chunks) {
			if (!activeKeys.has(key)) {
				chunk.dispose();
				this.chunks.delete(key);
			}
		}
	}

	dispose() {
		for (const chunk of this.chunks.values()) {
			chunk.dispose();
		}
		this.chunks.clear();
	}
}
