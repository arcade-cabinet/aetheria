import { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { PhysicsAggregate } from '@babylonjs/core/Physics/v2/physicsAggregate';
import { PhysicsShapeType } from '@babylonjs/core/Physics/v2/IPhysicsEnginePlugin';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { world, Entity } from '../World';

interface BlockOptions {
    position: Vector3;
    size?: { width: number, height: number, depth: number };
    isStatic?: boolean;
    color?: Color3;
}

export const createBlock = (scene: Scene, options: BlockOptions): Entity => {
    const { position, size = { width: 2, height: 2, depth: 2 }, isStatic = false, color } = options;

    // Visuals
    const mesh = MeshBuilder.CreateBox("block", { width: size.width, height: size.height, depth: size.depth }, scene);
    mesh.position.copyFrom(position);

    if (color) {
        const mat = new StandardMaterial("blockMat", scene);
        mat.diffuseColor = color;
        mat.emissiveColor = color.scale(0.2); // Slight glow for Obsidian style
        mesh.material = mat;
    }

    // Physics
    // Mass 0 for static (ground/walls), 10 for falling blocks (as per GENERATION.md)
    const mass = isStatic ? 0 : 10;
    const physics = new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass, restitution: 0.1 }, scene);

    const entity = world.add({
        mesh,
        physics,
        position: new Vector3().copyFrom(position),
        velocity: new Vector3(0, 0, 0)
    });

    return entity;
};
