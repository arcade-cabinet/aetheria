import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Chunk } from "./Chunk";
import { worldDB } from "../persistence/SqliteDatabase";
import { LayoutGenerator } from "../gen/LayoutGenerator";
import { assetRegistry } from "../../ecs/AssetRegistry";

export class ChunkManager {
    private chunks: Map<string, Chunk> = new Map();
    private loadingChunks: Set<string> = new Set();
    private chunkSize: number = 16;
    private renderDistance: number = 2; // Radius in chunks

    constructor(private scene: Scene) {}

    async update(playerPosition: Vector3) {
        const centerChunkX = Math.round(playerPosition.x / this.chunkSize);
        const centerChunkZ = Math.round(playerPosition.z / this.chunkSize);

        const activeKeys = new Set<string>();
        const chunksToLoad: { key: string; x: number; z: number }[] = [];

        // 1. Identify Needed Chunks
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                const chunkX = centerChunkX + x;
                const chunkZ = centerChunkZ + z;
                const key = `${chunkX},${chunkZ}`;
                activeKeys.add(key);

                if (!this.chunks.has(key) && !this.loadingChunks.has(key)) {
                    chunksToLoad.push({ key, x: chunkX, z: chunkZ });
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

        // 3. Load New Chunks (Async)
        if (chunksToLoad.length > 0) {
            // Mark as loading to prevent duplicate triggers
            chunksToLoad.forEach(c => this.loadingChunks.add(c.key));

            // Process sequentially or parallel? Parallel is fine if assetRegistry handles dedupe.
            await Promise.all(chunksToLoad.map(async (c) => {
                try {
                    console.log(`[ChunkManager] Loading Chunk: ${c.x}, ${c.z}`);
                    // A. Get Layout (DB or Gen)
                    let layout = await worldDB.getChunkLayout(c.x, c.z);
                    if (!layout) {
                        layout = LayoutGenerator.generateChunk(c.x, c.z, this.chunkSize);
                        await worldDB.saveChunkLayout(c.x, c.z, layout);
                        console.log(`[ChunkManager] Generated New Chunk: ${c.x}, ${c.z}`);
                    }

                    // B. Identify Assets
                    const requiredAssets = new Set<string>();
                    layout!.forEach(item => {
                        if (item.assetId) requiredAssets.add(item.assetId);
                    });

                    // C. Hotload Assets
                    await assetRegistry.loadAssets(Array.from(requiredAssets));

                    // D. Spawn (Check if still needed!)
                    // If player moved extremely fast, maybe we don't need it?
                    // For simplicity, we spawn. Unload logic next frame will kill it if far.
                    if (!this.chunks.has(c.key)) {
                        this.chunks.set(c.key, new Chunk(this.scene, c.x, c.z, this.chunkSize, layout!));
                    }
                } catch (e) {
                    console.error(`Failed to load chunk ${c.key}`, e);
                } finally {
                    this.loadingChunks.delete(c.key);
                }
            }));
        }
    }

    dispose() {
        for (const chunk of this.chunks.values()) {
            chunk.dispose();
        }
        this.chunks.clear();
        this.loadingChunks.clear();
    }
}
