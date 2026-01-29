import { world } from '../World';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

// Simple Input State (singleton for now)
const input = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};

// Bind listeners
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key in input) input[key as keyof typeof input] = true;
});
window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key in input) input[key as keyof typeof input] = false;
});

export const ControllerSystem = () => {
  // Config
  const speed = 10;
  const jumpForce = 15; // Impulse magnitude

  for (const entity of world.with('isPlayer', 'physics')) {
    const { physics } = entity;
    const body = physics.body;

    // 1. Get current velocity
    const currentVel = new Vector3();
    body.getLinearVelocityToRef(currentVel);

    // 2. Calculate desired movement (XZ plane)
    const moveDir = new Vector3(0, 0, 0);
    if (input.w) moveDir.z += 1;
    if (input.s) moveDir.z -= 1;
    if (input.a) moveDir.x -= 1;
    if (input.d) moveDir.x += 1;

    // Normalize
    if (moveDir.length() > 0) {
      moveDir.normalize();
      moveDir.scaleInPlace(speed);
    }

    // 3. Apply Velocity
    // Preserve Y velocity (Gravity), override X/Z
    // Note: This is a "Kinematic Character Controller" approach using physics velocity
    body.setLinearVelocity(new Vector3(moveDir.x, currentVel.y, moveDir.z));

    // 4. Jump
    // Basic ground check (Raycast is better, but simple velocity check for Phase 1)
    if (input.space && Math.abs(currentVel.y) < 0.1) {
        // Apply Impulse
        body.applyImpulse(new Vector3(0, jumpForce, 0), entity.mesh!.getAbsolutePosition());
    }
  }
};
