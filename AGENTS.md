# **Project Aetheria: Master Architecture & Design Document (v4.0 \- Havok Edition)**

## **1\. Project Vision & IP Definition**

**Title:** Aetheria: The Fractured Realm

**Genre:** Procedural Simulationist RPG (Mobile-First)

**Concept:** The world is not fixed; it is reconstructed daily by the "World-Singers." The player is an *Architect*, exploring stabilizing realities.

**Visual Identity ("The Gothic Aether"):**

* **Aesthetic:** Dark Gothic RPG. Deep ebony woods, dark metals, glowing filigrees, and organic traceries.
* **Palette:**
  * --ebony-base: #050505 (Deep Void)
  * --wood-ebony: #1a120b (Rich Dark Wood)
  * --metal-dark: #2a2a35 (Cold Iron)
  * --purple-regal: #3b0b45 (Deepest Purple)
  * --purple-glow: #9d00ff (Magic/Filigree Glow)
  * --filigree-gold: #c0b283 (Antique Tracery)
* **Visual Polish (Mandatory):**
  * All 3D scenes MUST use **GlowLayer** (for neon runes and filigree).
  * All 3D scenes MUST use **SSAO2** (for depth in procedural geometry).
  * UI must use backdrop-filter: blur(12px).

## **2\. Tech Stack (Rebalanced)**

* **Core:** React 19 \+ Vite \+ TypeScript.  
* **State:** zustand (Game State) \+ miniplex (ECS).  
* **3D Engine:** @babylonjs/core (v7.0+).  
* **Physics:** @babylonjs/havok (WASM-based high-performance physics). **CRITICAL UPGRADE.**  
* **AI:** yuka (Navigation & FSM).  
* **Audio:** tone (Procedural Score).  
* **UI Animation:** framer-motion (Preferred for React 19\) OR animejs.  
* **Utils:** seedrandom (Determinism), simplex-noise.

## **3\. Architecture: The Havok-ECS Bridge**

We are moving from simple collisions to **Havok V2 Physics**.

### **3.1. The Physics Loop**

Miniplex is the "Brain", Babylon/Havok is the "Body".

1. **Miniplex** stores logic state (isFalling, health).  
2. **Havok** stores physical state (velocity, mass).  
3. **RenderLoop:**  
   * *Read:* Get mesh position from Physics Body.  
   * *Logic:* InputSystem applies *Forces/Impulses* (not direct position manipulation).  
   * *Write:* Physics engine updates Mesh position automatically.

### **3.2. Character Controller (The "Capsule")**

Instead of a simple mesh, the Player is a **PhysicsAggregate** (Type: PhysicsShapeType.CAPSULE).

* **Movement:** Do NOT set position directly. Set body.setLinearVelocity().  
* **Jump:** Apply body.applyImpulse(upVector).  
* **Ground Check:** Use scene.onAfterPhysicsObservable with a ShapeCast or Raycast downwards.

## **4\. World Systems: The "Heavy" Assembler**

With Havok, the "Assembler" (World Builder) becomes a physics simulation.

### **4.1. Dynamic Construction**

* **The "Drop":**  
  1. Chunk loads.  
  2. Entities (Walls, Props) spawn at Y=50.  
  3. **Physics:** Entities have PhysicsAggregate (Box) with mass: 10\.  
  4. **Constraint:** They fall via real gravity.  
  5. **Locking:** When velocity \~= 0 after impact, set body.setMassProperties({ mass: 0 }) (Turn Kinematic) to "lock" them into the world structure permanently.

### **4.2. Debris & Juice**

* **Impact:** When a falling wall hits the ground (Physics Collision Event), spawn SolidParticleSystem dust.  
* **Camera Shake:** Apply a momentary impulse to the Camera container based on the mass of the object that landed.

## **5\. Procedural Humanoid Generation (Havok Integration)**

### **5.1. The Physics Rig**

The "Block-Rig" is no longer just visual.

* **Torso/Limbs:** Primitive meshes.  
* **Ragdoll Potential:** Connect limbs using PhysicsConstraint.BallAndSocket.  
* **State:**  
  * *Alive:* Kinematic animation (procedural sine-waves driving rotation).  
  * *Dead:* Enable Physics on all limbs \-\> Instant Ragdoll.

## **6\. Directory Structure (Refined)**

src/  
â”œâ”€â”€ app/  
â”‚   â”œâ”€â”€ App.tsx             \# Providers (Havok, Tone, Zustand)  
â”‚   â””â”€â”€ store.ts            \# Global Session State  
â”œâ”€â”€ ecs/  
â”‚   â”œâ”€â”€ World.ts            \# Miniplex Instance  
â”‚   â”œâ”€â”€ systems/  
â”‚   â”‚   â”œâ”€â”€ PhysicsSystem.ts    \# Syncs Miniplex \<-\> Havok  
â”‚   â”‚   â”œâ”€â”€ ControllerSystem.ts \# Input \-\> Velocity  
â”‚   â”‚   â””â”€â”€ AssemblerSystem.ts  \# Generates & Drops blocks  
â”‚   â””â”€â”€ factories/          \# Entity Creators (createPlayer, createWall)  
â”œâ”€â”€ features/  
â”‚   â”œâ”€â”€ ui/                 \# React HUD (Inventory, Stats)  
â”‚   â”œâ”€â”€ audio/              \# Tone.js synths  
â”‚   â””â”€â”€ gen/                \# Procedural Algorithms (Noise, DNA)  
â””â”€â”€ scene/  
    â”œâ”€â”€ GameScene.tsx       \# Babylon Canvas & Havok Init  
    â””â”€â”€ PostProcess.tsx     \# SSAO, Glow, ColorGrading

## **8. Asset Policy (Hybrid)**

We employ a pragmatic mix of **Procedural Generation** (Terrain, Layouts) and **High-Quality CC0 Assets** (Models, Audio).

*   **Proc-Gen:** Used for World Layout (Dungeons, Towns), Terrain Heightmaps, and dynamic composition.
*   **Static Assets:** Used for Character Meshes, Props, and specific Architectural Elements (Quaternius, KayKit, Kenney).
*   **Integration:** Assets are "Bridged" into the ECS via `LoaderSystem` and categorized by logical domain (not by pack origin).
*   **License:** STRICTLY CC0 or equivalent permissive licenses.