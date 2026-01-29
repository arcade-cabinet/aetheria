# Gemini Agent Context: Aetheria

## 1. Project Vision
**"Aetheria: The Fractured Realm"** is a procedural simulationist RPG on Mobile.
*   **Core Pillar:** The player is a **Risen Skeleton** (Dread Knight, Assassin, Warlock).
*   **Platform:** **Mobile First** (iOS/Android) via Expo & React Native.
*   **Engine:** **Filament** (3D), **Miniplex** (ECS), **React Native** (UI).
*   **Aesthetic:** "Dark Gothic", Moonlight, Fog, 9-Slice Retro UI.

## 2. Architecture & Systems
The codebase is a standard **Expo** project structure.

### Key Systems
*   **GameView:** `src/game/GameView.tsx` - The 3D viewport using `react-native-filament`.
*   **ECS:** `src/ecs/` - Miniplex entity system. Logic is decoupled from the view.
    *   **Logic:** Uses `Yuka` for math (Vector3, Quaternion) to remain engine-agnostic.
*   **UI:** `src/features/ui/` - React Native components (HUD, Modal, TouchControls).
*   **Persistence:** `src/features/persistence/` - Uses `expo-sqlite` for native performance.

### Asset Pipeline
*   **Models:** `.glb` format in `assets/models`.
*   **Images:** `assets/ui` and `assets/textures`.
*   **Config:** `metro.config.js` handles asset resolution for Filament.

## 3. Operational Protocol

### Rules
*   **Commit First:** Always commit changes before running builds (`expo prebuild`, `expo run:ios`).
*   **Native Compatibility:** Do not use Web APIs (DOM, `window`, `document`) unless shimmed.
*   **Testing:** Use **Maestro** (`maestro test .maestro/flow.yaml`) for E2E.
*   **Cleanliness:** Keep the root clean. No `apps/` folders.

### Workflow
1.  **Modify Code.**
2.  **Verify (Types/Lint).**
3.  **Commit.**
4.  **Build/Run (Simulator).**
5.  **Test (Maestro).**

## 4. Active Context
*   **Phase:** Phase 3 - Mobile Foundation.
*   **Current State:**
    *   Expo project initialized and flattened.
    *   Core logic ported and refactored (Yuka).
    *   UI reimplemented 1:1.
    *   Maestro configured.
    *   iPad Build Verified.