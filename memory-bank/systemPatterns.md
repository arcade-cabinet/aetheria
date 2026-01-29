# System Patterns

## Architecture: ECS + Physics Bridge
The core loop separates Logic (Miniplex) from Physics (Havok).

-   **ECS (Miniplex):** Stores state (`assemblerState`, `health`).
-   **Physics (Havok):** Simulations collisions and velocity.
-   **Bridge (`PhysicsSystem`):** Syncs Mesh transforms back to ECS data for logic queries.
-   **Bridge (`AssemblerSystem`):** Monitors physics (velocity) to trigger logical state changes (`FALLING` -> `LOCKED`).

## World Generation: The Chunk System
-   **Infinite Grid:** `ChunkManager` updates based on player position.
-   **Hybrid Assets:**
    -   **Ground:** Procedural Box (Physics Static).
    -   **Props:** GLTF Assets (`AssetRegistry`).
    -   **Scale:** 1 Unit = 1 Meter. Characters scaled `0.45x`.
-   **LayoutGenerator:** `src/features/gen/LayoutGenerator.ts` provides deterministic layout data.

## Asset Pipeline
1.  **Local Files:** `public/assets/`. No external URLs.
2.  **Manifest:** Generated via script.
3.  **Registry:** `AssetRegistry` clones meshes.
4.  **Audio/FX:** `AudioManager` (Tone.js) and `ImpactFX` (Particles).

## Code Style
-   **Linting:** Biome (Strict).
-   **Imports:** `node:` protocol for built-ins.
-   **Type Safety:** No implicit `any`.
