import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import type { Scene } from "@babylonjs/core/scene";

class AssetRegistry {
    private meshes: Map<string, AbstractMesh> = new Map();
    private manifestMap: Map<string, string> = new Map(); // ID -> Path
    private scene: Scene | null = null;
    private loadingPromises: Map<string, Promise<void>> = new Map();

    /**
     * Initialize with the Scene and Asset Manifest.
     * Does NOT load assets yet.
     */
    init(scene: Scene, manifestPaths: string[]) {
        this.scene = scene;
        manifestPaths.forEach(path => {
            const filename = path.split("/").pop()!;
            const id = filename.replace(/\.(gltf|glb)$/, "");
            this.manifestMap.set(id, path);
        });
    }

    /**
     * Ensures specific assets are loaded and ready.
     * Returns a promise that resolves when all requested assets are available.
     */
    async loadAssets(ids: string[]): Promise<void> {
        if (!this.scene) return;

        const missingIds = ids.filter(id => !this.meshes.has(id) && this.manifestMap.has(id));
        if (missingIds.length === 0) return;

        // Filter out those already loading
        const toLoad = missingIds.filter(id => !this.loadingPromises.has(id));
        
        if (toLoad.length === 0) {
            // Wait for existing promises
            await Promise.all(missingIds.map(id => this.loadingPromises.get(id)));
            return;
        }

        const manager = new AssetsManager(this.scene);
        manager.useDefaultLoadingScreen = false;

        const loadPromise = new Promise<void>((resolve) => {
            toLoad.forEach(id => {
                const path = this.manifestMap.get(id)!;
                const rootUrl = path.substring(0, path.lastIndexOf("/") + 1);
                const filename = path.substring(path.lastIndexOf("/") + 1);

                const task = manager.addMeshTask(id, "", rootUrl, filename);
                
                task.onSuccess = (t) => {
                    if (t.loadedMeshes.length > 0) {
                        const root = t.loadedMeshes[0];
                        root.setEnabled(false); // Hide blueprint
                        this.meshes.set(id, root);
                    }
                };
            });

            manager.onFinish = () => resolve();
            manager.load();
        });

        // Register promise for all these IDs
        toLoad.forEach(id => this.loadingPromises.set(id, loadPromise));

        await loadPromise;
        
        // Cleanup promises
        toLoad.forEach(id => this.loadingPromises.delete(id));
    }

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
            // Warn only if it SHOULD have been there (in manifest)
            if (this.manifestMap.has(name)) {
                console.warn(`AssetRegistry: Asset '${name}' requested but not loaded yet! Call loadAssets() first.`);
            }
            return null;
        }
        
        const clone = source.instantiateHierarchy(null, { doNotInstantiate: false });
        if (clone) {
            clone.name = newName || `${name}_instance`;
            clone.setEnabled(true);
        }
        return clone as AbstractMesh;
    }
    
    /**
     * Unload assets to free memory.
     * (Basic implementation: dispose blueprint)
     */
    unloadAssets(ids: string[]) {
        ids.forEach(id => {
            const mesh = this.meshes.get(id);
            if (mesh) {
                mesh.dispose();
                this.meshes.delete(id);
            }
        });
    }
}

export const assetRegistry = new AssetRegistry();
