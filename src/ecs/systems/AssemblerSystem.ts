import { world } from '../World';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { PhysicsMotionType } from '@babylonjs/core/Physics/v2/IPhysicsEnginePlugin';

export const AssemblerSystem = () => {
  // Query only Falling blocks
  // Note: Miniplex queries are updated automatically.
  // We iterate entities that have these components.
  for (const entity of world.with('isBlock', 'physics', 'assemblerState')) {
    if (entity.assemblerState !== 'FALLING') continue;

    const body = entity.physics.body;
    const velocity = new Vector3();
    body.getLinearVelocityToRef(velocity);

    // Check if settled (Velocity near zero)
    // We check if it has been alive for a bit to avoid instant locking?
    // Or just check velocity. If it just spawned at Y=50, velocity is 0 until gravity hits.
    // So we check if Y is below a certain threshold or if frame count > X.
    // For now: Check if Y < 45 (it spawned at 50) AND velocity is low.

    // We assume the entity has a mesh
    if (!entity.mesh) continue;

    if (entity.mesh.position.y < 45 && velocity.length() < 0.1) {
       // Lock it
       // 1. Make Static
       body.setMotionType(PhysicsMotionType.STATIC);

       // 2. Zero out velocity just in case
       body.setLinearVelocity(Vector3.Zero());
       body.setAngularVelocity(Vector3.Zero());

       // 3. Freeze visual transform for performance
       entity.mesh.freezeWorldMatrix();

       // 4. Update State
       // We mutate the component directly. Miniplex will update archetypes if we *added/removed* components.
       // Changing a value is fine.
       entity.assemblerState = 'LOCKED';

       console.log("Block Locked at", entity.mesh.position.toString());
    }
  }
};
