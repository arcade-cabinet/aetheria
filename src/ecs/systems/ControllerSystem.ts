import { Vector3 } from "yuka";
import { world } from "../World";

// Input State (Need React Native Touch Controls / Joystick)
// For now, mock input or expose global for testing
export const input = {
	w: false,
	a: false,
	s: false,
	d: false,
	space: false,
};

// Reusable vectors
const _currentVel = new Vector3();
const _moveDir = new Vector3();

export const ControllerSystem = () => {
	const speed = 10;
	const jumpForce = 15;

	for (const entity of world.with("isPlayer", "physics")) {
		const { physics } = entity;
		const body = physics.body;

        // Shim logic
        const cur = body.getLinearVelocity();
		_currentVel.set(cur.x, cur.y, cur.z);

		_moveDir.set(0, 0, 0);
		if (input.w) _moveDir.z -= 1; // Yuka Z is different? Babylon Z+ is forward. Yuka Z+ is backward (OpenGL)?
        // Assuming Standard: Z- is forward.
        // Let's stick to logic parity.

		if (input.s) _moveDir.z += 1;
		if (input.a) _moveDir.x -= 1;
		if (input.d) _moveDir.x += 1;

		if (_moveDir.length() > 0) {
			_moveDir.normalize();
			_moveDir.multiplyScalar(speed);
		}

		body.setLinearVelocity({ x: _moveDir.x, y: _currentVel.y, z: _moveDir.z });
	}
};
