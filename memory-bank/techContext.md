# Tech Context

## Technology Stack
*   **Framework:** Expo 52 (SDK 52/54 compatible).
*   **Language:** TypeScript 5.0+.
*   **3D Engine:** `react-native-filament` (Google Filament).
*   **ECS:** `miniplex`.
*   **Physics:** `rapier3d-compat` (WASM/JS). Havok Native is blocked by RN limitations, Rapier is used for now.
*   **Math:** `yuka` (Engine-agnostic Vector3/Quaternion).
*   **Persistence:** `expo-sqlite`.
*   **State Management:** `zustand`.
*   **Testing:** `maestro` (E2E).
*   **System:** `expo-system-ui`, `expo-navigation-bar`, `expo-splash-screen`.

## Development Environment
*   **Build Tool:** Expo CLI (`npx expo`).
*   **Simulator:** iOS Simulator (iPad Pro/iPhone).
*   **Package Manager:** pnpm.

## Directory Structure
*   `/`: Root Expo App.
    *   `App.tsx`: Entry point (Native orchestration).
    *   `src/`:
        *   `game/`: Core game logic (`GameLoop`, `RenderContext`, `WorldRenderer`).
        *   `ecs/`: Systems & Factories (Physics, Controller).
        *   `features/`: Domain features (UI, Gen, Narrative).
    *   `assets/`: Static assets (`models/`, `ui/`).
    *   `.maestro/`: E2E test flows.
    *   `ios/`, `android/`: Generated native code.

## Key Constraints
*   **No Web DOM:** Logic must be pure JS/TS.
*   **Filament Assets:** Models must be `.glb`.
*   **Reanimated:** Used for high-frequency UI thread updates (Camera/Player transforms).