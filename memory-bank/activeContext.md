# Active Context

## Current Focus
**Phase 3-5: Gameplay Loop & Combat Foundation.**
We have successfully implemented the "Dungeon Room" layout generator, inventory system, and pickup logic. We have also added the **Combat Foundation** (Hazards, Damage, Death).

## Recent Changes
-   **Optimization:** Asset loading is now filtered to prioritizing medieval/nature/props/player packs, limited to 200 items, to prevent "Stuck at 0%" loading issues.
-   **Landing Page:** Updated to use correct `/assets/ui/splash.png` branding.
-   **LayoutGenerator:** Generates structured rooms with floor grids, walls, and props using a deterministic RNG. Includes **Spike Traps** (Hazards).
-   **Inventory System:** Added `inventory` component to Player and `PICKUP/INSPECT` logic to `InteractionSystem`.
-   **Combat System:**
    -   `PhysicsSystem`: Detects collision with `isHazard` entities and applies damage.
    -   `HealthSystem`: Handles death (respawn) and health clamping.
    -   `HUD`: Displays Health Bar and Inventory.
-   **ECS:** Updated `Entity` type and `createBlock` factory to support `health`, `damage`, `isHazard`.

## Next Steps
1.  **AI Enemies:** Add moving entities that chase the player.
2.  **Combat Actions:** Add "Attack" (Swing sword).
3.  **Content:** Add more layouts (Corridors, Special Rooms).

## Active Decisions
-   **Layout:** 2x2 Grid size matches asset scale.
-   **Interaction:** 'E' key for pickup. Raycast range 3m.
-   **Combat:** Collision-based damage (Hazards). Simple Respawn.