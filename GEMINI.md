# Gemini Agent Context: Aetheria

This file serves as the persistent memory and operational directive for the Gemini Agent working on "Aetheria: The Fractured Realm".

## 1. Project Vision
**"Aetheria: The Fractured Realm"** is a procedural simulationist RPG with a "Dark Gothic" aesthetic.
*   **Core Pillar:** The player is a **Risen Skeleton** (Dread Knight, Assassin, Warlock).
*   **The Spine:** A structured 3-Hour Campaign (Anchors: Awakening -> Cathedral -> Void Gate) embedded in a procedural world.
*   **Mechanics:** Physics-based ECS (Havok + Miniplex). Simulationist interaction.
*   **Aesthetic:** "Jules" UI (Glass/Metal/Serif), Dark/Foggy Atmosphere, Curated Gothic Assets (KayKit).

## 2. Architecture & Systems
The codebase is structured around a React + BabylonJS + Miniplex stack.

### Key Systems (ECS)
*   **PhysicsSystem:** Havok integration.
*   **ControllerSystem:** Kinematic character controller (WASD/Jump).
*   **AssemblerSystem:** World interaction/building (Locked/Falling blocks).
*   **InteractionSystem:** Raycasting for pickup/inspect/dialogue.
*   **NarrativeSystem:** Triggers Dialogue/Quest updates based on interaction.
*   **IndicatorSystem:** Manages UI billboards (!, ?, ...) above entities.
*   **MinionSystem:** AI for companion following/behavior.
*   **EnemySystem:** AI for hostile skeleton behavior.
*   **QuestSystem:** Side-effects for quest completion (e.g., spawning Minion).

### Data Spine (Zod Schemas)
*   `src/game/schema/GameSchema.ts`: Definitions for Quests, Dialogue, Minions.
*   `src/game/schema/WorldSchema.ts`: Definitions for World Config and Anchor Points.
*   `src/features/narrative/Content.ts`: Static data implementation of the spine.

### Asset Pipeline
*   **Source:** `public/assets/models`.
*   **Manifest:** Generated via script.
*   **Portraits:** Generated via Blender (`scripts/generate_portraits.py`).

## 3. Operational Protocol

### Autonomy Loop
1.  **Read Context:** Always consult `GEMINI.md` and `memory-bank/activeContext.md` first.
2.  **Plan:** Break tasks into atomic steps. Update `activeContext.md` *before* execution.
3.  **Execute:** Implement code with strict adherence to "No Shortcuts". No placeholders.
4.  **Verify:** Run `pnpm build` and `pnpm vitest` (where applicable).
5.  **Document:** Update `memory-bank` to reflect changes.
6.  **Commit:** Use conventional commits.

### Commit Strategy
*   **Granularity:** Atomic functional changes. One feature/fix per commit.
*   **Message Format:** `type(scope): description` (e.g., `feat(narrative): implement dialogue UI`).
*   **Frequency:** Commit after every verified step.

## 4. Active Context (Snapshot)
*   **Phase:** Phase 2 - "The Living World".
*   **Current State:**
    *   Anchors (Start, Crypt, Void) implemented in layout.
    *   Narrative system (Quests/Dialogue) active.
    *   Indicators (!/?) functional.
    *   Minion spawns after Quest 1.
*   **Next Priorities:**
    *   **Content Filling:** Flesh out the "Sunken Cathedral" and "Void Gate" layouts with actual gameplay density (enemies, loot).
    *   **Combat Polish:** Enemy AI needs attack logic and damage dealing. Player needs attack logic.
    *   **Save/Load:** Ensure `SqliteDatabase` persists Quest State and Inventory.

## 5. Self-Correction & Feedback
*   **Rule:** If a test fails or build breaks, STOP. Analyze. Fix. Do not proceed to next task.
*   **Rule:** If unsure about a design decision, check `productContext.md` for alignment with "Dark Gothic" vision.
