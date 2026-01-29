import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import type { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Scene } from "@babylonjs/core/scene";
import { assetRegistry } from "../AssetRegistry";
import { type Entity, world } from "../World";

interface BlockOptions {
	position: Vector3;
	rotation?: Quaternion;
	size?: { width: number; height: number; depth: number };
	isStatic?: boolean;
	color?: Color3;
	assetId?: string; // Optional: logical ID for CC0 asset
    isHazard?: boolean;
    damage?: number;
    // Narrative
    dialogueId?: string;
    questTargetId?: string;
}

// Material Cache to prevent duplication
const materialCache = new Map<string, StandardMaterial>();

const getMaterial = (scene: Scene, color: Color3): StandardMaterial => {
	const key = color.toHexString();
	if (!materialCache.has(key)) {
		const mat = new StandardMaterial(`blockMat_${key}`, scene);
		mat.diffuseColor = color;
		mat.emissiveColor = color.scale(0.2);
		materialCache.set(key, mat);
	}
	return materialCache.get(key)!;
};

export const createBlock = (scene: Scene, options: BlockOptions): Entity => {
	const {
		position,
		rotation,
		size = { width: 2, height: 2, depth: 2 },
		isStatic = false,
		color,
		assetId,
        isHazard,
        damage,
        dialogueId,
        questTargetId
	} = options;

    let mesh: import("@babylonjs/core/Meshes/abstractMesh").AbstractMesh | null | undefined = null;

	// 1. Try to load Asset
	if (assetId) {
		const asset = assetRegistry.instantiate(assetId);
		if (asset) {
			mesh = asset;
		}
	}

	// 2. Fallback to Procedural Box
	if (!mesh) {
		mesh = MeshBuilder.CreateBox(
			"block",
			{ width: size.width, height: size.height, depth: size.depth },
			scene,
		);
		if (color) {
			mesh.material = getMaterial(scene, color);
		}
	}

	mesh.position.copyFrom(position);
    if (rotation) {
        mesh.rotationQuaternion = rotation;
    } else if (!mesh.rotationQuaternion) {
        mesh.rotationQuaternion = Quaternion.Identity();
    }

	// Physics
	const mass = isStatic ? 0 : 10;
	
	const physics = new PhysicsAggregate(
		mesh,
		PhysicsShapeType.BOX,
		{ mass, restitution: 0.1, extents: new Vector3(size.width, size.height, size.depth) },
		scene,
	);

    // Metadata for Interaction & Physics
    mesh.metadata = { 
        isBlock: true, 
        id: mesh.uniqueId,
        isHazard: isHazard,
        damage: damage
    };

	const entity = world.add({
		mesh,
		physics,
		position: new Vector3().copyFrom(position),
		velocity: new Vector3(0, 0, 0),
		isBlock: true,
		assemblerState: isStatic ? undefined : "FALLING",
        assetId: assetId || "Unknown",
        interactableType: isStatic ? "INSPECT" : "PICKUP",
        isHazard: isHazard,
        damage: damage,
        dialogueId: dialogueId,
        questTargetId: questTargetId
	});

	return entity;
};