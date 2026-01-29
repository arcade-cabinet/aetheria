# Active Context

## Current Focus
**Phase 3-5: Gameplay Loop & Content Expansion.**
We have successfully implemented the "Dungeon Room" layout generator, inventory system, and pickup logic. The core loop is functional.

## Recent Changes
-   **LayoutGenerator:** Now generates structured rooms with floor grids, walls, and props using a deterministic RNG.
-   **Inventory System:** Added `inventory` component to Player and `PICKUP/INSPECT` logic to `InteractionSystem`.
-   **HUD:** Now displays inventory items and interaction prompts.
-   **ECS:** Updated `Entity` type and `createBlock` factory to support new gameplay components.

## Next Steps
1.  **Gameplay Refinement:** Add "Health" and "Damage" (Combat).
2.  **Content:** Add more layouts (Corridors, Special Rooms) to `LayoutGenerator`.
3.  **Optimization:** Instanced Meshes for floors/walls (currently cloning meshes).

## Active Decisions
-   **Layout:** 2x2 Grid size matches asset scale.
-   **Interaction:** 'E' key for pickup. Raycast range 3m.