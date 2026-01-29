# Active Context

## Current Focus
Phase 2: "The Living World" & "The Spine".
-   **Goal:** Solidify the "New Game" flow and the first "Quest" loop.
-   **Immediate Tasks:**
    1.  Generate Class Portraits using Blender (`bpy`).
    2.  Implement "Anchor Point" logic in `LayoutGenerator` for the Starting Town.
    3.  Verify the full loop: Landing -> Portraits -> Embark -> Anchor Town -> Quest Interaction -> Minion Spawn.

## Recent Changes
-   **Pivot:** Player is now a Skeleton (Dread Knight/Assassin/Warlock).
-   **Narrative:** Implemented Quest/Dialogue systems.
-   **AI:** Added Minion and Enemy systems.
-   **UI:** Restored "Jules" aesthetic. Refactored New Game Modal.
-   **Testing:** Added Vitest/Playwright config.

## Open Questions/Risks
-   **Blender Automation:** Can we reliably run `bpy` in this environment? (Verified: Blender 5.0.1 is available).
-   **Performance:** ECS loop with many entities (Minions/Enemies) needs monitoring.
-   **Asset Scale:** KayKit vs Quaternius scale consistency needs verification in-game.
