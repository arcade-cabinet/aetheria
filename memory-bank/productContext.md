# Product Context

## Vision
"Aetheria: The Fractured Realm" is a procedural simulationist RPG with a "Dark Gothic" aesthetic. The player controls a "Risen" skeleton, awakening in a ruined world to rebuild or destroy. The game emphasizes physics-based interaction, emergent gameplay via ECS, and a strong narrative spine rooted in "The Old School" RPG tradition (Daggerfall).

## Core Pillars
1.  **The Risen:** The player is an undead skeleton (Dread Knight, Assassin, Warlock). Progression involves reclaiming power and unlocking companions (Minions).
2.  **The Spine:** A structured Main Quest and Dialogue system (Zod-schema backed) anchors the experience, providing purpose amidst the chaos.
3.  **The Living World:** A mix of "Anchor Towns" (Hand-crafted/Fixed logic) and "Procedural Filler" (Wilderness/Ruins).
4.  **Simulationist Physics:** Havok physics drives movement, combat, and interaction. Everything has mass and collision.
5.  **Gothic Organic Aesthetic:** Visuals are dark, textured (Stone, Wood, Bone), and atmospheric (Fog, Gloom). UI uses "Jules Aesthetic" (Glass Metallic, 9-Slice, Serif Typography).

## Key Features
-   **Class System:** 3 Archetypes (Dread Knight, Assassin, Warlock) with randomized starting stats (min/max bounds).
-   **Minion System:** Unlockable AI companions (e.g., "Igor") that assist in combat and carrying.
-   **Narrative Engine:** Quest and Dialogue Managers driven by structured data.
-   **Asset Pipeline:** Strictly curated Gothic assets (KayKit Skeletons, Dungeon Props). No modern/sci-fi elements.
-   **Procedural Generation:** Biome-based generation with support for Fixed Anchor Points (Starting Town).

## User Journey
1.  **Landing:** "Enter the Void" -> New Game Modal (Seed, Class Selection with Portraits, Stat Rolling).
2.  **Awakening:** Spawn in the "Starting Town" (Anchor). Interaction with "Ancient Anchor" starts the Main Quest.
3.  **Progression:** Explore procedural ruins, fight enemies (Skeleton/Zombie), loot props, unlock Minion.