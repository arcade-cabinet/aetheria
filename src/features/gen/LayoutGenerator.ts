import { Vector3, Quaternion } from "yuka";
import { createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import { WORLD_CONFIG } from "../narrative/Content";

export interface LayoutItem {
    position: Vector3;
    rotation?: Quaternion;
    assetId: string;
    isStatic: boolean;
    isHazard?: boolean;
    damage?: number;
    // Narrative
    dialogueId?: string;
    questTargetId?: string;
}

// Global deterministic noise
let biomeNoise = createNoise2D(seedrandom("default"));
let terrainNoise = createNoise2D(seedrandom("default"));

export const setSeed = (seed: string) => {
    const rng = seedrandom(seed);
    biomeNoise = createNoise2D(rng);
    terrainNoise = createNoise2D(rng);
};

enum Biome {
    WASTELAND = "Wasteland",
    FOREST = "Dark Forest",
    RUINS = "Ancient Ruins"
}

export class LayoutGenerator {
    static getBiome(x: number, z: number): Biome {
        // Large scale noise (Scale 0.1 means features are ~10 chunks wide)
        const n = biomeNoise(x * 0.1, z * 0.1);
        if (n < -0.2) return Biome.RUINS;
        if (n > 0.3) return Biome.FOREST;
        return Biome.WASTELAND;
    }

    static generateChunk(chunkX: number, chunkZ: number, size: number): LayoutItem[] {
        // 1. Check for Anchor Point (The Spine)
        const anchor = WORLD_CONFIG.anchors.find(a => a.chunkX === chunkX && a.chunkZ === chunkZ);
        
        if (anchor) {
            // console.log(`Generating Anchor: ${anchor.name}`);
            return this.generateAnchor(anchor.layoutId, size);
        }

        // 2. Procedural Biome (Filler)
        const biome = this.getBiome(chunkX, chunkZ);
        
        switch (biome) {
            case Biome.RUINS: return this.generateRuins(chunkX, chunkZ, size);
            case Biome.FOREST: return this.generateForest(chunkX, chunkZ, size);
            default: return this.generateWasteland(chunkX, chunkZ);
        }
    }

    private static generateAnchor(layoutId: string, size: number): LayoutItem[] {
        switch (layoutId) {
            case "STARTING_TOWN": return this.generateStartingTown(size);
            case "CRYPT": return this.generateCrypt(size);
            case "VOID_GATE": return this.generateVoidGate(size);
            default: return [];
        }
    }

    private static generateStartingTown(size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        const TILE_SIZE = 2; 
        const GRID_W = Math.floor(size / TILE_SIZE); 
        const offset = size / 2;
        const rng = (offset: number) => Math.sin(offset * 123.45); // Local deterministic random

        // 1. Paved Central Square with Decay
        for (let x = 0; x < GRID_W; x++) {
            for (let z = 0; z < GRID_W; z++) {
                const posX = (x * TILE_SIZE) - offset + (TILE_SIZE / 2);
                const posZ = (z * TILE_SIZE) - offset + (TILE_SIZE / 2);
                
                // 80% Brick, 20% Dirt (Decay)
                const isBrick = Math.abs(rng(x * z)) > 0.2;
                
                items.push({
                    position: new Vector3(posX, 0, posZ),
                    assetId: isBrick ? "Floor_Brick" : "Floor_Dirt",
                    isStatic: true
                });

                // Scatter Props (Low density)
                if (isBrick && Math.abs(rng(x + z)) > 0.9) {
                    const propType = Math.abs(rng(x)) > 0.5 ? "Barrel" : "Bench";
                    items.push({
                        position: new Vector3(posX, 0, posZ),
                        assetId: propType,
                        isStatic: false, // Props have physics? Maybe static for now to avoid chaos
                        rotation: new Quaternion().fromEuler(0, rng(z) * Math.PI, 0)
                    });
                }
            }
        }

        // 2. The Anchor (Quest Giver) - Centered
        items.push({
            position: new Vector3(0, 1, 0),
            assetId: "chest_gold",
            isStatic: true,
            dialogueId: "dialogue_anchor",
            questTargetId: "ancient_anchor"
        });

        // 3. Perimeter Columns
        items.push({ position: new Vector3(-6, 0, -6), assetId: "Pillar_Square", isStatic: true });
        items.push({ position: new Vector3(6, 0, -6), assetId: "Pillar_Square", isStatic: true });
        items.push({ position: new Vector3(-6, 0, 6), assetId: "Pillar_Square", isStatic: true });
        items.push({ position: new Vector3(6, 0, 6), assetId: "Pillar_Square", isStatic: true });

        // 4. The Guide (Neutral NPC)
        items.push({
            position: new Vector3(3, 0, 3),
            assetId: "Skeleton_Mage",
            isStatic: false, // It's an entity
            dialogueId: "dialogue_guide" // Need to add this
        });

        return items;
    }

    private static generateCrypt(size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        const offset = size / 2;
        
        // Dark Stone Floor
        for (let x = 0; x < size/2; x++) {
            for (let z = 0; z < size/2; z++) {
                items.push({
                    position: new Vector3(x*2 - offset, 0, z*2 - offset),
                    assetId: "Floor_Dirt", // Muddy crypt floor
                    isStatic: true
                });
            }
        }

        // Columns & Sarcophagi
        items.push({ position: new Vector3(0, 0, 0), assetId: "Altar_Stone", isStatic: true });
        items.push({ position: new Vector3(4, 0, 4), assetId: "Column_Round", isStatic: true });
        items.push({ position: new Vector3(-4, 0, 4), assetId: "Column_Round", isStatic: true });
        
        // Quest Item: Void Key (Altar Interaction)
        items.push({
            position: new Vector3(0, 1, 0), // On top of Altar
            assetId: "chest_gold",
            isStatic: true,
            dialogueId: "dialogue_altar",
            questTargetId: "crypt_altar"
        });

        // Enemies (Dread Knights)
        items.push({ position: new Vector3(3, 0, 3), assetId: "Skeleton_Warrior", isStatic: false, damage: 10 });
        items.push({ position: new Vector3(-3, 0, 3), assetId: "Skeleton_Warrior", isStatic: false, damage: 10 });
        
        return items;
    }

    private static generateVoidGate(size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        
        // Floating Platform Ring
        const radius = size / 3;
        const circumference = Math.floor(2 * Math.PI * radius);
        
        for (let i = 0; i < circumference; i += 2) {
            const angle = (i / circumference) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            items.push({
                position: new Vector3(x, 0, z),
                assetId: "Floor_Brick",
                isStatic: true
            });
        }
        
        // The Gate (Massive Arch)
        const gateWidth = size / 4;
        items.push({ position: new Vector3(-gateWidth, 0, radius), assetId: "Pillar_Obelisk", isStatic: true });
        items.push({ position: new Vector3(gateWidth, 0, radius), assetId: "Pillar_Obelisk", isStatic: true });
        
        // Central Trigger
        items.push({
            position: new Vector3(0, 1, radius),
            assetId: "Altar_Stone", // Placeholder for actual gate trigger
            isStatic: true,
            questTargetId: "void_gate_trigger"
        });
        
        return items;
    }

    private static generateRuins(chunkX: number, chunkZ: number, size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        const seedVal = Math.sin(chunkX * 12.98 + chunkZ * 78.23) * 43758.54;
        const localRng = (offset: number) => (Math.sin(seedVal + offset) + 1) / 2;

        const TILE_SIZE = 2; 
        const GRID_W = Math.floor(size / TILE_SIZE); 
        const offset = size / 2;

        for (let x = 0; x < GRID_W; x++) {
            for (let z = 0; z < GRID_W; z++) {
                if (localRng(x * z) > 0.3) { 
                    const posX = (x * TILE_SIZE) - offset + (TILE_SIZE / 2);
                    const posZ = (z * TILE_SIZE) - offset + (TILE_SIZE / 2);
                    
                    const isTrap = localRng(x * z + 50) > 0.95;

                    items.push({
                        position: new Vector3(posX, 0, posZ),
                        assetId: isTrap ? "floor_tile_big_spikes" : "Floor_Brick",
                        isStatic: true,
                        isHazard: isTrap,
                        damage: isTrap ? 20 : 0
                    });

                    // Walls
                    if (localRng(x * z + 100) > 0.9 && !isTrap) {
                         items.push({
                            position: new Vector3(posX, 0, posZ),
                            assetId: "Wall_Plaster_Straight",
                            isStatic: true,
                            rotation: new Quaternion().fromEuler(0, localRng(x)*Math.PI, 0)
                        });
                    } else if (localRng(x * z + 200) > 0.95 && !isTrap) {
                        items.push({
                            position: new Vector3(posX, 20, posZ), // Drop
                            assetId: "Chest_Wood",
                            isStatic: false
                        });
                    }
                }
            }
        }
        return items;
    }

    private static generateForest(chunkX: number, chunkZ: number, size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        // Dense trees, organic placement
        const count = 10 + Math.floor(Math.abs(terrainNoise(chunkX, chunkZ)) * 10); // 10-20 trees
        
        for (let i = 0; i < count; i++) {
            // Use deterministic random based on chunk + index
            // We use terrainNoise at higher freq for position jitter
            const rx = terrainNoise(chunkX * 10 + i, chunkZ * 10 + i);
            const rz = terrainNoise(chunkX * 10 + i + 100, chunkZ * 10 + i + 100);
            
            const x = rx * (size / 2);
            const z = rz * (size / 2);

            items.push({
                position: new Vector3(x, 20 + i, z), // Drop
                assetId: Math.abs(rx) > 0.5 ? "TwistedTree_1" : "Pine_1",
                isStatic: false,
                rotation: new Quaternion().fromEuler(0, rz * Math.PI * 2, 0)
            });
        }
        
        // Ground scatter (Rocks)
        for (let i = 0; i < 5; i++) {
             const sx = terrainNoise(chunkX * 20 + i, chunkZ * 20 + i);
             const sz = terrainNoise(chunkX * 20 + i + 50, chunkZ * 20 + i + 50);
             items.push({
                position: new Vector3(sx * (size/2), 20, sz * (size/2)),
                assetId: "Rock_Medium_1",
                isStatic: false
            });
        }

        return items;
    }

    private static generateWasteland(chunkX: number, chunkZ: number): LayoutItem[] {
        // Sparse rocks, open area
        const items: LayoutItem[] = [];
        const n = terrainNoise(chunkX, chunkZ);

        if (Math.abs(n) > 0.6) {
             // Occasional boulder
             items.push({
                position: new Vector3(0, 20, 0),
                assetId: "Rock_Medium_3",
                isStatic: false,
                isHazard: true,
                damage: 50
             });
        }

        // Random Potion spawn
        if (Math.abs(terrainNoise(chunkX * 10, chunkZ * 10)) > 0.8) {
            items.push({
                position: new Vector3(2, 0, 2),
                assetId: "Potion_1",
                isStatic: false
            });
        }

        return items;
    }
}
