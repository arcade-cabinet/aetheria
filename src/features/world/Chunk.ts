import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { createBlock } from "../../ecs/factories/createBlock";
import { world, Entity } from "../../ecs/World";

export class Chunk {
    public entities: Entity[] = [];
    
    constructor(
        private scene: Scene,
        public x: number,
        public z: number,
        public size: number = 16
    ) {
        this.generate();
    }

    generate() {
        const worldX = this.x * this.size;
        const worldZ = this.z * this.size;

        // 1. Ground (Procedural Base)
        // We position it at center of chunk? No, createBlock usually takes center.
        // Let's assume (0,0) is center of World.
        // Chunk (0,0) covers -8 to +8.
        const groundPos = new Vector3(worldX, -1, worldZ);
        
        const ground = createBlock(this.scene, {
            position: groundPos,
            size: { width: this.size, height: 1, depth: this.size },
            isStatic: true,
            color: new Color3(0.1, 0.1, 0.12), // Dark paved look
            // Future: assetId: "Floor_Paving_Module"
        });
        this.entities.push(ground);

        // 2. Props (Hybrid: Asset or Procedural)
        // Simple deterministic noise
        const seed = Math.sin(this.x * 12.9898 + this.z * 78.233) * 43758.5453;
        const rand = seed - Math.floor(seed);

        if (rand > 0.7) {
             // Place a generic prop (Rock)
             const propType = rand > 0.85 ? "TwistedTree_1" : "Rock_Medium_1";
             
             // The Drop: Spawn high up!
             const dropHeight = 10 + (rand * 20); // 10 to 30 units high

             const prop = createBlock(this.scene, {
                 position: new Vector3(worldX, dropHeight, worldZ), 
                 size: { width: 1, height: 2, depth: 1 }, 
                 isStatic: false, // DYNAMIC! It will fall.
                 assetId: propType 
             });
             this.entities.push(prop);
        }
    }

    dispose() {
        this.entities.forEach(entity => {
            world.remove(entity); // Remove from ECS
            if (entity.mesh) {
                entity.mesh.dispose();
            }
            if (entity.physics) {
                entity.physics.dispose();
            }
        });
        this.entities = [];
    }
}
