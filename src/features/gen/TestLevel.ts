import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { createBlock } from '../../ecs/factories/createBlock';
import { createPlayer } from '../../ecs/factories/createPlayer';

export const loadTestLevel = (scene: Scene) => {
    // 1. Lighting
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    light.groundColor = new Color3(0.1, 0.1, 0.1);

    // 2. Static Ground
    createBlock(scene, {
        position: new Vector3(0, -1, 0),
        size: { width: 50, height: 2, depth: 50 },
        isStatic: true,
        color: new Color3(0.1, 0.1, 0.15) // Dark Blue-Grey
    });

    // 3. Falling Walls (Test Assembler)
    for (let i = 0; i < 5; i++) {
        const x = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        const y = 20 + i * 3;

        const entity = createBlock(scene, {
            position: new Vector3(x, y, z),
            size: { width: 2, height: 2, depth: 2 },
            isStatic: false, // Dynamic
            color: new Color3(0.8, 0.2, 0.8) // Neon Purple
        });

        entity.assemblerState = 'FALLING';
    }

    // 4. Player
    const playerEntity = createPlayer(scene, new Vector3(0, 10, -10));

    // 5. Camera (Follow Player)
    if (playerEntity.mesh) {
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 20, playerEntity.mesh.position, scene);
        camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

        // Lock camera target to player mesh
        camera.lockedTarget = playerEntity.mesh;
    }
};
