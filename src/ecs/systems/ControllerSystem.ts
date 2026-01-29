import { world } from '../World';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

// Simple Input State
const input = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};

const onKeyDown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  if (key in input) input[key as keyof typeof input] = true;
};

const onKeyUp = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  if (key in input) input[key as keyof typeof input] = false;
};

let initialized = false;

export const initController = () => {
    if (initialized) return;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    initialized = true;
};

export const disposeController = () => {
    if (!initialized) return;
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    initialized = false;
};

// Reusable vectors
const _currentVel = new Vector3();
const _moveDir = new Vector3();
const _jumpImpulse = new Vector3(0, 0, 0);
const _velTemp = new Vector3();

export const ControllerSystem = () => {
  if (!initialized) initController();

  // Config
  const speed = 10;
  const jumpForce = 15;

  // Added 'mesh' to query to ensure safety
  for (const entity of world.with('isPlayer', 'physics', 'mesh')) {
    const { physics } = entity;
    const body = physics.body;

    // 1. Get current velocity
    body.getLinearVelocityToRef(_currentVel);

    // 2. Calculate desired movement (XZ plane)
    _moveDir.setAll(0);
    if (input.w) _moveDir.z += 1;
    if (input.s) _moveDir.z -= 1;
    if (input.a) _moveDir.x -= 1;
    if (input.d) _moveDir.x += 1;

    // Normalize
    if (_moveDir.length() > 0) {
      _moveDir.normalize();
      _moveDir.scaleInPlace(speed);
    }

    // 3. Apply Velocity
    // Preserve Y velocity (Gravity), override X/Z
    _velTemp.set(_moveDir.x, _currentVel.y, _moveDir.z);
    body.setLinearVelocity(_velTemp);

    // 4. Jump
    if (input.space && Math.abs(_currentVel.y) < 0.1) {
        _jumpImpulse.set(0, jumpForce, 0);
        // Entity.mesh is guaranteed by query
        body.applyImpulse(_jumpImpulse, entity.mesh.getAbsolutePosition());
    }
  }
};
