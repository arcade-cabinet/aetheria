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
             // We need to know a valid Asset ID. 
             // From manifest: "Rock_Medium_1", "TwistedTree_1", "Barrel"
             const propType = rand > 0.85 ? "TwistedTree_1" : "Rock_Medium_1";
             
             const prop = createBlock(this.scene, {
                 position: new Vector3(worldX, 0, worldZ), // On top of ground (ground is at -1, height 1 -> top at -0.5. So 0 is floating? adjust y)
                 // Ground top is at -1 + 0.5 = -0.5. 
                 // Prop origin is usually center? If asset is GLtf, pivot is usually bottom.
                 // createBlock MeshBuilder pivot is center.
                 // We'll approximate y=0.
                 size: { width: 1, height: 2, depth: 1 }, // Collider size approximation
                 isStatic: true,
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
