# Tech Context

## Stack
-   **Engine:** React 19 + Babylon.js 7.
-   **Physics:** Havok (WASM).
-   **ECS:** Miniplex.
-   **Build:** Vite + Tailwind CSS 4.
-   **Test:** Vitest (Unit), Playwright (E2E).
-   **Languages:** TypeScript, Python (Blender Automation).

## Architecture
-   **ECS Loop:** `App.tsx` drives the main loop (`Physics`, `Controller`, `Assembler`, `Interaction`, `Health`, `Minion`, `Enemy`, `Quest`).
-   **State Management:**
    -   **Game State:** ECS (`World.ts`).
    -   **UI/Narrative:** Zustand (`QuestManager`, `DialogueManager`).
    -   **Assets:** `AssetRegistry` (Lazy loading).
-   **Data Spine:**
    -   `src/game/schema/GameSchema.ts`: Zod definitions for Quests, Dialogue, Minions.
    -   `src/features/narrative/Content.ts`: Static data for quests.
-   **World Generation:**
    -   `LayoutGenerator`: Handles Biomes (Ruins, Forest, Wasteland).
    -   **Anchor Points:** Fixed chunks (e.g., Starting Town at 0,0) override procedural noise.

## Asset Pipeline
-   **Source:** `public/assets/models`.
-   **Format:** `.glb` / `.gltf`.
-   **Automation:** Python scripts (Blender `bpy`) used for batch processing (e.g., generating portraits).
-   **Manifest:** Generated via `scripts/generate_manifest.js` (or inline node script).

## Testing Strategy
-   **Unit:** Logic-heavy components (`QuestManager`, `Classes`).
-   **E2E:** User flows (New Game, Gameplay Loop). Visual Regression for UI.