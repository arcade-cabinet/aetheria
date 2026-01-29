import { world } from '../World';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { PhysicsMotionType } from '@babylonjs/core/Physics/v2/IPhysicsEnginePlugin';

export const AssemblerSystem = () => {
  // Query only Falling blocks
  for (const entity of world.with('isBlock', 'physics', 'assemblerState')) {
    if (entity.assemblerState !== 'FALLING') continue;

    const body = entity.physics.body;
    const velocity = new Vector3();
    body.getLinearVelocityToRef(velocity);

    // Ensure we have a mesh
    if (!entity.mesh) continue;

    // Logic:
    // 1. Must be significantly below spawn height (Spawned at 20+, so check < 5)
    // 2. OR Must have been alive for X frames (not tracking frames here, so rely on position/velocity)
    // 3. Velocity must be near zero (settled)

    // Fix: Lowered Y threshold to 5 (near ground) to prevent mid-air locking.
    if (entity.mesh.position.y < 5 && velocity.length() < 0.1) {
       // Lock it
       body.setMotionType(PhysicsMotionType.STATIC);

       body.setLinearVelocity(Vector3.Zero());
       body.setAngularVelocity(Vector3.Zero());

       entity.mesh.freezeWorldMatrix();

       entity.assemblerState = 'LOCKED';

       console.log("Block Locked at", entity.mesh.position.toString());
    }
  }
};
