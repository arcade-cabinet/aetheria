import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import type { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import type { Scene } from "@babylonjs/core/scene";
import { assetRegistry } from "../AssetRegistry";
import { type Entity, world } from "../World";

interface BlockOptions {
	position: Vector3;
	size?: { width: number; height: number; depth: number };
	isStatic?: boolean;
	color?: Color3;
	assetId?: string; // Optional: logical ID for CC0 asset
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
		size = { width: 2, height: 2, depth: 2 },
		isStatic = false,
		color,
		assetId,
	} = options;

	let mesh;

	// 1. Try to load Asset
	if (assetId) {
		const asset = assetRegistry.instantiate(assetId);
		if (asset) {
			mesh = asset;
			// Scale to fit target size?
			// For now, let's assume the asset is roughly 1x1x1 or we want to normalize it.
			// Getting bounding info is tricky if it's not computed yet.
			// A simple approach: Don't force scale unless explicitly needed.
			// But for "Blocks", we usually want predictable sizes.
			// Let's rely on the asset's native size for now to avoid distortion,
			// OR applying a scale factor if the user requested a specific "Block" dimension
			// that differs significantly from the asset.
			// A safer bet for this MVP is: Use asset as is, position it.
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

	// Physics
	// Mass 0 for static (ground/walls), 10 for falling blocks
	const mass = isStatic ? 0 : 10;
	
	// Use BOX impostor for everything for stability, even if visual is a mesh.
	// This is standard game dev practice (simple collider, complex visual).
	// We use the 'size' for the collider dimensions to match the logical block size.
	const physics = new PhysicsAggregate(
		mesh,
		PhysicsShapeType.BOX,
		{ mass, restitution: 0.1, extents: new Vector3(size.width, size.height, size.depth) },
		scene,
	);

	const entity = world.add({
		mesh,
		physics,
		position: new Vector3().copyFrom(position),
		velocity: new Vector3(0, 0, 0),
		isBlock: true,
		assemblerState: isStatic ? undefined : "FALLING",
	});

	return entity;
};
