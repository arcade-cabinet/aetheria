# Tech Context

## Core Stack
-   **Runtime:** Node.js (v20+ inferred), PNPM.
-   **Build:** Vite 6.
-   **Framework:** React 19.
-   **Engine:** BabylonJS 7.0+.
-   **Physics:** Havok (WASM).
-   **Audio:** Tone.js 15.

## Constraints
-   **Vite Chunking:** `manualChunks` configured to split `vendor`, `babylon`, `ecs`.
-   **Asset Limits:** 1K Textures preferred. EXR for Skybox.
-   **Browser:** WebGL2 / WebGPU ready.

## Development Setup
-   **Lint:** `pnpm check` (Biome).
-   **Build:** `pnpm build`.
-   **Scripts:** `scripts/audit_scale.py` (Blender) for asset verification.
