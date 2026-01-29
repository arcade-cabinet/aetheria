import { World } from 'miniplex';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { PhysicsAggregate } from '@babylonjs/core/Physics/v2/physicsAggregate';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export type Entity = {
  // Core
  mesh?: AbstractMesh;
  physics?: PhysicsAggregate;

  // State
  position?: Vector3; // For logic reference, though Mesh has it too
  velocity?: Vector3;

  // Tags
  isPlayer?: boolean;
  isGround?: boolean;
  isBlock?: boolean;

  // Assembler State
  assemblerState?: 'FALLING' | 'LOCKED';
  targetPosition?: Vector3; // Where it should ideally end up (for snapping)
};

export const world = new World<Entity>();
