# Active Context

## Current Focus
**Phase 2: Procedural Generation & Polish.**
We have just completed the Phase 1 Foundation and "The Drop" mechanic. We are now refining the layout algorithms.

## Recent Changes
-   **Asset Independence:** Removed external GitHub URLs for textures/particles. Used local AmbientCG/Babylon assets.
-   **Environment:** Added local EXR support (`DayEnvironmentHDRI005`).
-   **Polish:** Added `ImpactFX` (Dust) and `AudioManager` (Ambient Music + Thuds).
-   **Layout:** Created `LayoutGenerator.ts` to abstract generation logic from `Chunk.ts`.

## Next Steps
1.  **Refine LayoutGenerator:** Move from random scatter to structured rooms (WFC or BSP).
2.  **Architect Mode:** Allow user to place blocks (Raycast + Input).
3.  **Performance:** Monitor "The Drop" with many chunks. Maybe throttle drops?

## Active Decisions
-   **Scale:** We decided on 1u = 1m. Characters are scaled 0.45x. Environment 1.0x.
-   **Physics:** We use `PhysicsShapeType.CAPSULE` for players and `BOX` for almost everything else (for stability).
