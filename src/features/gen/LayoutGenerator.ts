import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export interface LayoutItem {
    position: Vector3;
    assetId: string;
    rotation?: number;
    isStatic: boolean;
}

export class LayoutGenerator {
    static generateChunk(chunkX: number, chunkZ: number, size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        // Simple deterministic pseudo-random
        const seed = Math.sin(chunkX * 12.9898 + chunkZ * 78.233) * 43758.5453;
        const rng = (offset: number) => {
            const s = seed + offset;
            return (Math.sin(s) + 1) / 2;
        };

        // 1. Centerpiece (50% chance)
        if (rng(1) > 0.5) {
            items.push({
                position: new Vector3(0, 0, 0), // Local to chunk center
                assetId: rng(2) > 0.5 ? "Table_Large" : "Chest_Wood",
                isStatic: true // Heavy items static? Or drop them? Let's drop them.
            });
        }

        // 2. Scatter Props (Rocks/Trees)
        const count = Math.floor(rng(3) * 5);
        for (let i = 0; i < count; i++) {
            const x = (rng(4 + i) - 0.5) * size;
            const z = (rng(10 + i) - 0.5) * size;
            
            items.push({
                position: new Vector3(x, 20 + i * 2, z), // Drop height
                assetId: rng(20 + i) > 0.7 ? "Rock_Medium_1" : "Barrel",
                isStatic: false
            });
        }

        return items;
    }
}
