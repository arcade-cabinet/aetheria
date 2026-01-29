import { Scene } from '@babylonjs/core/scene';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { SSAO2RenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline';

export const PostProcess = (scene: Scene) => {
  // Glow Layer for Neon effects
  const glow = new GlowLayer("glow", scene);
  glow.intensity = 0.6;

  // SSAO2 for depth
  // Note: SSAO2 can be expensive on mobile, might need config tweaking or checking device capabilities.
  // For now, enabling as per strict mandate.
  const ssao = new SSAO2RenderingPipeline("ssao", scene, 0.75);
  ssao.radius = 2;
  ssao.totalStrength = 1.2;
  ssao.expensiveBlur = false; // Optimization
  ssao.samples = 16;
  ssao.maxZ = 250;

  // Attach to all cameras (currently none, but will attach when cameras are added)
  scene.onNewCameraAddedObservable.add((camera) => {
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
  });
};
