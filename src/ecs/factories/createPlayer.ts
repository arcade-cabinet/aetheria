import { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { PhysicsAggregate } from '@babylonjs/core/Physics/v2/physicsAggregate';
import { PhysicsShapeType } from '@babylonjs/core/Physics/v2/IPhysicsEnginePlugin';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { world, Entity } from '../World';

export const createPlayer = (scene: Scene, position: Vector3): Entity => {
  // Visuals
  const mesh = MeshBuilder.CreateCapsule("player", { height: 2, radius: 0.5 }, scene);
  mesh.position.copyFrom(position);

  // Physics (Capsule)
  // Mass 1 for dynamic movement, Restitution 0 to prevent bouncing
  const physics = new PhysicsAggregate(mesh, PhysicsShapeType.CAPSULE, { mass: 1, restitution: 0.0, friction: 0.0 }, scene);

  // Lock rotation to prevent tipping over (Character Controller behavior)
  physics.body.setMassProperties({
    inertia: new Vector3(0, 0, 0)
  });

  const entity = world.add({
    mesh,
    physics,
    isPlayer: true,
    position: new Vector3().copyFrom(position),
    velocity: new Vector3(0, 0, 0)
  });

  return entity;
};
