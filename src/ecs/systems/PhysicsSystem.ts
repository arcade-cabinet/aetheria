import { world } from '../World';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

// This system synchronizes the physical world (Babylon/Havok) with the logical world (Miniplex)
// It runs every frame.
export const PhysicsSystem = () => {
  // Query entities that have both a physics body and a mesh
  // In a real app, we might check for a 'Dynamic' tag
  for (const entity of world.with('physics', 'mesh')) {
    // Sync Mesh Position -> Entity Logic Position
    // This allows AI/Logic to read position without referencing the heavy Mesh directly
    if (!entity.position) {
      entity.position = new Vector3();
    }

    if (entity.mesh) {
        entity.position.copyFrom(entity.mesh.position);
    }
  }
};
