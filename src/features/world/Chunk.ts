import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import { createBlock } from "../../ecs/factories/createBlock";
import { type Entity, world } from "../../ecs/World";

export class Chunk {
	public entities: Entity[] = [];

	constructor(
		private scene: Scene,
		public x: number,
		public z: number,
		public size: number = 16,
	) {
		this.generate();
	}

import { LayoutGenerator } from "../../gen/LayoutGenerator";

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

        // 1. Ground (Static Base)
        const groundPos = new Vector3(worldX, -1, worldZ);
        const ground = createBlock(this.scene, {
            position: groundPos,
            size: { width: this.size, height: 1, depth: this.size },
            isStatic: true,
            color: new Color3(0.1, 0.1, 0.12),
        });
        this.entities.push(ground);

        // 2. Procedural Layout
        const layout = LayoutGenerator.generateChunk(this.x, this.z, this.size);
        
        layout.forEach(item => {
            const absPos = item.position.add(new Vector3(worldX, 0, worldZ));
            
            // Adjust drop height for dynamic items if not already set high
            if (!item.isStatic && absPos.y < 5) {
                absPos.y += 15;
            }

            const entity = createBlock(this.scene, {
                position: absPos,
                rotation: item.rotation,
                size: { width: 1, height: 1, depth: 1 }, // Default size, asset will override visually
                isStatic: item.isStatic,
                assetId: item.assetId
            });
            this.entities.push(entity);
        });
    }

    dispose() {
		this.entities.forEach((entity) => {
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
