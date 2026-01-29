# Active Context

## Current Focus
**Mobile-First Pivot & Stabilization**
The project has undergone a complete architectural pivot from a Web-based React/BabylonJS app to a **Native Mobile App** using **Expo**, **React Native**, and **Filament** (via `react-native-filament`). The repository has been flattened (no `apps/` workspace), with the legacy web code archived in `../aetheria-web-archive`.

## Recent Changes
*   **Architecture:**
    *   **Flattened Repo:** Root contains the Expo app (`App.tsx`, `app.json`, `ios/`, `android/`).
    *   **Legacy Archive:** Web version moved out of repo.
    *   **Git Hygiene:** Purged accidentally tracked `node_modules`.
*   **Tech Stack:**
    *   **Runtime:** Expo (Managed workflow + Prebuild).
    *   **3D Engine:** Google Filament (`react-native-filament`) for high-performance PBR on mobile.
    *   **UI:** React Native `StyleSheet` (replaced Tailwind).
    *   **Persistence:** `expo-sqlite` (Native) replaced `sql.js` (WASM).
    *   **System:** `expo-system-ui`, `expo-navigation-bar`, `expo-splash-screen`.
*   **Features:**
    *   **Ported Logic:** `gen`, `narrative`, `game` logic refactored to be engine-agnostic (using `Yuka` math).
    *   **UI Parity:** HUD, Narrative Modal, and New Game Modal reimplemented in RN.
    *   **Touch Controls:** On-screen D-Pad and Action button implemented.
*   **Testing:**
    *   **Maestro:** configured for mobile E2E (`.maestro/gameplay_loop.yaml`).
    *   **Simulator:** Verified build and launch on iPad Pro 11-inch (M5).

## Active Decisions
*   **Commit Policy:** **ALWAYS COMMIT before building.** This prevents `expo prebuild` from prompting about dirty working trees and ensures rollback safety.
*   **Native First:** All new features must be implemented for Mobile first. Web is deprecated.
*   **Filament:** Use `.glb` models. Lighting is set to "Moonlight" (Cool Blue).
*   **Assets:** Stored in `assets/` (root). Loaded via `require()` or `Asset.fromModule`.

## Next Steps
1.  **Gameplay Polish:** Connect `TouchControls` to the Physics System (currently shimmed) to enable actual movement.
2.  **Physics Integration:** Implement a proper physics bridge (Rapier or Cannon) for React Native, as Havok WASM is not directly supported in the Native view without a bridge.
3.  **Content Expansion:** Re-populate the world with the ported assets.