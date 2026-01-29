import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";

export interface LayoutItem {
    position: Vector3;
    rotation?: Quaternion;
    assetId: string;
    isStatic: boolean;
    isHazard?: boolean;
    damage?: number;
}

export class LayoutGenerator {
    static generateChunk(chunkX: number, chunkZ: number, size: number): LayoutItem[] {
        const items: LayoutItem[] = [];
        const seed = Math.sin(chunkX * 12.9898 + chunkZ * 78.233) * 43758.5453;
        const rng = (offset: number) => {
            const s = seed + offset;
            return (Math.sin(s) + 1) / 2;
        };

        // Grid Settings
        const TILE_SIZE = 2; // Matches asset scale
        const GRID_W = Math.floor(size / TILE_SIZE); // 8
        const offset = size / 2;

        // 1. Generate Floor (Ruins style: some missing)
        for (let x = 0; x < GRID_W; x++) {
            for (let z = 0; z < GRID_W; z++) {
                if (rng(x * z) > 0.2) { // 80% floor coverage
                    const posX = (x * TILE_SIZE) - offset + (TILE_SIZE / 2);
                    const posZ = (z * TILE_SIZE) - offset + (TILE_SIZE / 2);
                    
                    // Trap Chance
                    const isTrap = rng(x * z + 50) > 0.95;

                    items.push({
                        position: new Vector3(posX, 0, posZ), // Floor is at 0
                        assetId: isTrap ? "floor_tile_big_spikes" : "Floor_Brick",
                        isStatic: true,
                        isHazard: isTrap,
                        damage: isTrap ? 20 : 0
                    });

                    // 2. Walls/Pillars (Sparse)
                    const p = rng(x * z + 100);
                    if (p > 0.95 && !isTrap) {
                         items.push({
                            position: new Vector3(posX, 0, posZ),
                            assetId: "Wall_Plaster_Straight",
                            isStatic: true,
                            rotation: Quaternion.FromEulerAngles(0, rng(x)*Math.PI, 0)
                        });
                    } else if (p > 0.85 && p <= 0.95 && !isTrap) {
                        // Prop
                        items.push({
                            position: new Vector3(posX, 5 + rng(x)*10, posZ), // Drop it
                            assetId: rng(x+z) > 0.5 ? "Barrel" : "Chest_Wood",
                            isStatic: false
                        });
                    }
                }
            }
        }

        return items;
    }
}
