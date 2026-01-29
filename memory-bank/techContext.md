# Tech Context

## Technology Stack
*   **Framework:** Expo (React Native 0.76+).
*   **Language:** TypeScript 5.0+.
*   **3D Engine:** `react-native-filament` (Google Filament).
*   **ECS:** `miniplex`.
*   **AI/Math:** `yuka`.
*   **Persistence:** `expo-sqlite`.
*   **State Management:** `zustand`.
*   **Testing:** `maestro` (E2E).

## Development Environment
*   **Build Tool:** Expo CLI (`npx expo`).
*   **Simulator:** iOS Simulator (iPad Pro/iPhone) or Android Emulator.
*   **Package Manager:** pnpm.

## Directory Structure
*   `/`: Root Expo App.
    *   `App.tsx`: Entry point.
    *   `src/`: Application source code.
        *   `game/`: Core game logic and 3D View.
        *   `ecs/`: Entity Component System.
        *   `features/`: Domain features (UI, Gen, Narrative).
    *   `assets/`: Static assets (models, images).
    *   `.maestro/`: E2E test flows.
    *   `ios/`, `android/`: Generated native code (Prebuild).

## Key Constraints
*   **No Web DOM:** Logic must be pure JS/TS.
*   **Filament Assets:** Models must be `.glb`.
*   **Navigation:** Custom state-based navigation (no `react-navigation` heavy stack needed yet, currently overlay-based).
