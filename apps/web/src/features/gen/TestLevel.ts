import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import { createPlayer } from "../../ecs/factories/createPlayer";

export const loadTestLevel = (scene: Scene) => {
	// 1. Lighting
	const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
	light.intensity = 0.7;
	light.groundColor = new Color3(0.1, 0.1, 0.1);

	// 2. Player
	// Spawn at (0, 10, 0) to drop onto the chunk-generated ground (at y=-1)
	const playerEntity = createPlayer(scene, new Vector3(0, 10, 0));

	// 3. Camera (Follow Player)
	if (playerEntity.mesh) {
		const camera = new ArcRotateCamera(
			"camera",
			-Math.PI / 2,
			Math.PI / 3,
			20,
			playerEntity.mesh.position,
			scene,
		);
		camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

		// Lock camera target to player mesh
		camera.lockedTarget = playerEntity.mesh;
	}
};
