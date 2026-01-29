import { Vector3 } from "yuka";
import { world } from "../World";

// Input State
export const input = {
	w: false,
	a: false,
	s: false,
	d: false,
	space: false,
};

const _moveDir = new Vector3();

export const ControllerSystem = () => {
	const speed = 8;
	const jumpImpulse = 20;

	for (const entity of world.with("isPlayer", "physicsBody")) {
		const body = entity.physicsBody;
        const curVel = body.linvel();

		_moveDir.set(0, 0, 0);
		if (input.w) _moveDir.z -= 1;
		if (input.s) _moveDir.z += 1;
		if (input.a) _moveDir.x -= 1;
		if (input.d) _moveDir.x += 1;

		if (_moveDir.length() > 0) {
			_moveDir.normalize();
			_moveDir.multiplyScalar(speed);
		}

        // Apply Horizontal Velocity, keep Vertical Velocity (gravity)
        body.setLinvel({ x: _moveDir.x, y: curVel.y, z: _moveDir.z }, true);

        // Jump
        if (input.space && Math.abs(curVel.y) < 0.01) { // Simple ground check
            body.applyImpulse({ x: 0, y: jumpImpulse, z: 0 }, true);
        }
	}
};