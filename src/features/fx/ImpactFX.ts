import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import type { Scene } from "@babylonjs/core/scene";

export const spawnImpactDust = (scene: Scene, position: Vector3) => {
	const particleSystem = new ParticleSystem("dust", 20, scene);

	// Use local AmbientCG grit texture for "dust"
	particleSystem.particleTexture = new Texture(
		"/assets/textures/environment/Rock018_1K-JPG_AmbientOcclusion.jpg",
		scene,
	);

	particleSystem.emitter = position;
	particleSystem.minEmitBox = new Vector3(-0.5, 0, -0.5);
	particleSystem.maxEmitBox = new Vector3(0.5, 0.2, 0.5);

	particleSystem.color1 = new Color4(0.4, 0.4, 0.4, 0.5);
	particleSystem.color2 = new Color4(0.2, 0.2, 0.2, 0.2);
	particleSystem.colorDead = new Color4(0, 0, 0, 0);

	particleSystem.minSize = 0.1;
	particleSystem.maxSize = 0.5;

	particleSystem.minLifeTime = 0.3;
	particleSystem.maxLifeTime = 0.8;

	particleSystem.emitRate = 100;
	particleSystem.manualEmitCount = 20;
	particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;

	particleSystem.gravity = new Vector3(0, -9.81, 0);
	particleSystem.direction1 = new Vector3(-1, 2, -1);
	particleSystem.direction2 = new Vector3(1, 4, 1);

	particleSystem.minAngularSpeed = 0;
	particleSystem.maxAngularSpeed = Math.PI;

	particleSystem.minEmitPower = 1;
	particleSystem.maxEmitPower = 3;
	particleSystem.updateSpeed = 0.005;

	particleSystem.start();

	// Auto dispose
	setTimeout(() => {
		particleSystem.dispose();
	}, 1000);
};
