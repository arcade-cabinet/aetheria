# **Aetheria: Procedural Generation & Assembly Protocols**

## **1\. Core Philosophy: "The Blueprint & The Drop"**

World generation in Aetheria is a two-step process:

1. **The Blueprint (Logic):** A strictly deterministic algorithm runs instantly using seedrandom to calculate exactly where every wall, floor, and prop *should* be. It creates a virtual grid of data.  
2. **The Drop (Simulation):** The game engine reads the Blueprint and physically spawns entities high in the sky, letting Havok physics handle the visual arrival of the world.

## **2\. The Spatial Grid**

All generation is based on a strict 3D integer grid to ensure watertight geometry (no gaps between meshes).

* **Unit Size:** 1 Unit \= 2 Meters (Standard Babylon/Havok scale).  
* **Vertical Slice:** 1 Floor \= 2 Units (4 Meters).  
* **Coordinate System:** (GridX, GridY, GridZ).  
* **World Space Conversion:**  
  * WorldX \= GridX \* TileSize  
  * WorldY \= GridY \* WallHeight  
  * WorldZ \= GridZ \* TileSize

## **3\. The Socket System (Snapping Logic)**

To prevent a door opening into a solid wall, or a roof floating over nothing, we use a **Socket Matching System** (simplified Wave Function Collapse).

### **3.1. Socket Definitions**

Every module (Asset) has 6 Sockets (North, South, East, West, Top, Bottom).

**Socket Types:**

* 0: **VOID** (Empty air, expects nothing).  
* 1: **SOLID** (Solid wall/floor face, can abut other solids).  
* 2: **OPEN** (No geometry, allows movement/connection).  
* 3: **DOOR** (Requires a matching DOOR socket).  
* 4: **SUPPORT** (Requires a foundation below).

### **3.2. Asset Definitions (JSON/Object Structure)**

const ModuleRegistry \= {  
  "Wall\_Solid": {  
    sockets: { N: 1, S: 1, E: 0, W: 0, Top: 1, Bottom: 1 },  
    mesh: "wall\_solid.glb",  
    mass: 50  
  },  
  "Wall\_Door": {  
    sockets: { N: 3, S: 3, E: 0, W: 0, Top: 1, Bottom: 1 },  
    mesh: "wall\_door.glb",  
    mass: 40  
  },  
  "Floor\_Stone": {  
    sockets: { N: 1, S: 1, E: 1, W: 1, Top: 2, Bottom: 1 },  
    mesh: "floor\_stone.glb",  
    mass: 100  
  }  
}

## **4\. Algorithms: Structure Generation**

### **4.1. The Room Grower (Random Walk)**

Used for Dungeons and Interiors.

1. Start at (0,0,0). Place a **Floor**. Add to OpenList.  
2. Pick random tile from OpenList.  
3. Pick random direction (N, S, E, W).  
4. If target is empty:  
   * Place **Floor**.  
   * Add to OpenList.  
   * Decrement MaxRooms.  
5. Repeat until MaxRooms \== 0\.  
6. **Wall Pass:** Iterate all Floor tiles. If a neighbor is Empty, place a **Wall** on that edge.

### **4.2. The Building Extruder (Towns)**

Used for Inns, Towers, Shops.

1. **Footprint:** Define a rectangle (e.g., 4x6).  
2. **Extrude:** Repeat footprint for n stories.  
3. **Carve:** Remove random internal blocks to create balconies or vaulted ceilings.  
4. **Roofing:**  
   * Identify top-most blocks.  
   * Apply **Roof Modules** based on neighbors (Corner, Slope, Peak).

## **5\. The "Assembler" (Physics Integration)**

This is the runtime system that turns the **Blueprint** into the visual game world.

### **5.1. The Drop Queue**

The Assembler does not spawn everything at once (CPU spike). It uses a **Priority Queue**.

1. **Priority 1:** Floors (So players/objects don't fall to void).  
2. **Priority 2:** Walls & Pillars.  
3. **Priority 3:** Roofs & Decor.

### **5.2. The Physics State Machine**

Each block goes through these states:

1. **PHASE\_SPAWN:**  
   * Instantiate Mesh at TargetPos \+ Vector3(0, 50, 0).  
   * Attach HavokPhysicsAggregate (Body).  
   * Apply slight random angular velocity (for tumbling effect).  
   * Apply Gravity.  
2. **PHASE\_FALL:**  
   * System monitors position.  
   * *Optional:* If Position.y \< TargetPos.y, apply upward force (damping) to prevent clipping through the ground too hard.  
3. **PHASE\_IMPACT:**  
   * Detected via onCollision observable or velocity check.  
   * **Juice:** Spawn DustParticleSystem. Shake Camera. Play Thud.mp3.  
4. **PHASE\_LOCK (The Snap):**  
   * If velocity.length() \< 0.1 OR time\_since\_impact \> 1s:  
     * **Dispose Physics Body.** (Critical for performance).  
     * **Hard Snap:** Set Mesh.position \= Blueprint.TargetPosition.  
     * **Freeze:** Set Mesh.freezeWorldMatrix().  
     * **Merge:** (Optimization) Mark for merging into static world geometry if needed.

## **6\. Terrain Integration**

### **6.1. Heightmap Logic**

We do not use flat planes.

* **Noise Source:** Simplex Noise.  
* **Sampling:** For a building at (x, z), sample the terrain height at all 4 corners.  
* **Foundation:** The "Base Y" of the building is the *highest* terrain point sampled.  
* **Underpinning:** The engine generates "Foundation Blocks" extending downwards from the floor to the terrain mesh to fill gaps (preventing floating houses).

### **6.2. Pathfinding NavMesh (Yuka)**

1. Once a Chunk is "Locked" (all blocks processed):  
2. The NavMeshGenerator scans the grid.  
3. Walkable Surfaces (Floors without Walls above them) become NavNodes.  
4. Connections are created between adjacent walkable nodes.  
5. This graph is passed to the Yuka entity for NPC pathfinding.

## **7\. Data Structures (TypeScript)**

### **7.1. The Blueprint Data**

interface BlueprintNode {  
    gridPos: Vector3; // {x: 5, y: 0, z: 2}  
    assetId: string;  // "Wall\_Stone\_01"  
    rotation: number; // 0, 90, 180, 270  
    variant: number;  // For texture variation  
}

interface WorldChunk {  
    id: string; // "chunk\_10\_-5"  
    nodes: BlueprintNode\[\];  
    isBuilt: boolean;  
}

### **7.2. The Assembler Job**

interface AssemblerJob {  
    node: BlueprintNode;  
    mesh: BABYLON.AbstractMesh;  
    physics: BABYLON.PhysicsAggregate;  
    status: 'FALLING' | 'SETTLING' | 'LOCKED';  
}  
