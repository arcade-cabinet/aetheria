import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

class AssetRegistry {
    private meshes: Map<string, AbstractMesh> = new Map();

    /**
     * Registers a mesh (or hierarchy) under a specific name.
     * Disables the mesh so it acts as a blueprint.
     */
    register(name: string, mesh: AbstractMesh) {
        mesh.setEnabled(false); // Ensure blueprint is hidden
        this.meshes.set(name, mesh);
    }

    /**
     * Retrieves the source mesh by name.
     */
    get(name: string): AbstractMesh | undefined {
        return this.meshes.get(name);
    }
    
    /**
     * Instantiates a new copy of the asset.
     * This is the primary way to spawn objects into the world.
     */
    instantiate(name: string, newName?: string): AbstractMesh | null {
        const source = this.get(name);
        if (!source) {
            console.warn(`AssetRegistry: Could not find asset '${name}'`);
            return null;
        }
        
        // Clone the mesh. 
        // For complex hierarchies (GLBs), we might need instantiateHierarchy, 
        // but clone is often sufficient for simple props.
        // If the source is a root node (__root__), we likely want to instantiateHierarchy.
        const clone = source.instantiateHierarchy(null, { doNotInstantiate: false });
        if (clone) {
            clone.name = newName || `${name}_instance`;
            clone.setEnabled(true);
        }
        return clone as AbstractMesh;
    }
}

export const assetRegistry = new AssetRegistry();
