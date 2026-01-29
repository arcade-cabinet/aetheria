import { world } from "../../ecs/World";
import { LayoutGenerator, type LayoutItem } from "./LayoutGenerator";
import { worldDB } from "../persistence/SqliteDatabase";
import { Vector3, Quaternion } from "yuka";
import RAPIER from "@dimforge/rapier3d-compat";
import { getPhysicsWorld } from "../../ecs/systems/PhysicsSystem";

export class Chunk {
    public x: number;
    public z: number;
    private size: number;
    private entityIds: number[] = [];

    constructor(x: number, z: number, size: number) {
        this.x = x;
        this.z = z;
        this.size = size;
    }

    async load() {
        // 1. Get Layout
        let layout = await worldDB.getChunkLayout(this.x, this.z);
        if (!layout) {
            layout = LayoutGenerator.generateChunk(this.x, this.z, this.size);
            await worldDB.saveChunkLayout(this.x, this.z, layout);
        }

        // 2. Spawn Entities
        const pw = getPhysicsWorld();
        const worldX = this.x * this.size;
        const worldZ = this.z * this.size;

        layout.forEach((item: LayoutItem) => {
            // Convert local to absolute
            const absPos = new Vector3(
                item.position.x + worldX,
                item.position.y,
                item.position.z + worldZ
            );

            // Create Physics Body
            const bodyDesc = item.isStatic 
                ? RAPIER.RigidBodyDesc.fixed() 
                : RAPIER.RigidBodyDesc.dynamic();
            
            bodyDesc.setTranslation(absPos.x, absPos.y, absPos.z);
            
            const body = pw.createRigidBody(bodyDesc);
            
            // Default cuboid for now
            const colDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1);
            pw.createCollider(colDesc, body);

            const entity = world.add({
                assetId: item.assetId,
                position: absPos,
                rotation: item.rotation || new Quaternion(),
                physicsBody: body,
                isStatic: item.isStatic,
                dialogueId: item.dialogueId,
                questTargetId: item.questTargetId,
                isInteractable: !!(item.dialogueId || item.questTargetId)
            });

            this.entityIds.push(entity.id);
        });
    }

    unload() {
        // Remove entities from world
        this.entityIds.forEach(id => {
            const entity = world.entities.find(e => e.id === id);
            if (entity) {
                // Remove physics body
                if (entity.physicsBody) {
                    getPhysicsWorld().removeRigidBody(entity.physicsBody);
                }
                world.remove(entity);
            }
        });
        this.entityIds = [];
    }
}

export class ChunkManager {
    private chunks: Map<string, Chunk> = new Map();
    private chunkSize: number = 50;
    private renderDistance: number = 1; // 1 means 3x3 grid

    async update(playerPosition: Vector3) {
        const cx = Math.floor(playerPosition.x / this.chunkSize);
        const cz = Math.floor(playerPosition.z / this.chunkSize);

        const activeKeys = new Set<string>();

        // Load new chunks
        for (let x = cx - this.renderDistance; x <= cx + this.renderDistance; x++) {
            for (let z = cz - this.renderDistance; z <= cz + this.renderDistance; z++) {
                const key = `${x},${z}`;
                activeKeys.add(key);

                if (!this.chunks.has(key)) {
                    const chunk = new Chunk(x, z, this.chunkSize);
                    this.chunks.set(key, chunk);
                    await chunk.load();
                }
            }
        }

        // Unload distant chunks
        for (const [key, chunk] of this.chunks.entries()) {
            if (!activeKeys.has(key)) {
                chunk.unload();
                this.chunks.delete(key);
            }
        }
    }
}

export const chunkManager = new ChunkManager();
