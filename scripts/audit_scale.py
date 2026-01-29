import bpy
import os
import mathutils
from pathlib import Path

# Configuration
ASSET_DIR = "public/assets/models"
# We'll sample a subset to be fast
SAMPLE_LIMIT = 50 

def reset_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def analyze_asset(filepath):
    reset_scene()
    
    try:
        if filepath.endswith(".glb") or filepath.endswith(".gltf"):
            bpy.ops.import_scene.gltf(filepath=filepath)
        elif filepath.endswith(".fbx"):
            bpy.ops.import_scene.fbx(filepath=filepath)
        else:
            return None
    except Exception as e:
        print(f"Failed to load {filepath}: {e}")
        return None

    # Calculate bounding box of all mesh objects
    min_v = mathutils.Vector((float('inf'), float('inf'), float('inf')))
    max_v = mathutils.Vector((float('-inf'), float('-inf'), float('-inf')))
    
    mesh_found = False
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            mesh_found = True
            # Apply transforms to get world space
            for v in obj.bound_box:
                world_v = obj.matrix_world @ mathutils.Vector(v)
                min_v.x = min(min_v.x, world_v.x)
                min_v.y = min(min_v.y, world_v.y)
                min_v.z = min(min_v.z, world_v.z)
                max_v.x = max(max_v.x, world_v.x)
                max_v.y = max(max_v.y, world_v.y)
                max_v.z = max(max_v.z, world_v.z)

    if not mesh_found:
        return None

    width = max_v.x - min_v.x
    depth = max_v.y - min_v.y # Blender Y is often Depth/Forward in some conventions, Z is up
    height = max_v.z - min_v.z

    return {
        "name": Path(filepath).name,
        "width": width,
        "depth": depth,
        "height": height,
        "path": filepath
    }

def main():
    print("=== ASSET SCALE AUDIT ===")
    
    categories = ["characters/humanoid", "environment/medieval", "environment/nature"]
    results = {}

    for cat in categories:
        search_path = os.path.join(ASSET_DIR, cat)
        if not os.path.exists(search_path):
            print(f"Skipping {cat}, path not found.")
            continue
            
        print(f"\nScanning {cat}...")
        cat_stats = []
        count = 0
        
        # Walk and find files
        files = []
        for root, dirs, filenames in os.walk(search_path):
            for f in filenames:
                if f.lower().endswith(('.gltf', '.glb')):
                    files.append(os.path.join(root, f))
        
        # Limit processing
        if len(files) > SAMPLE_LIMIT:
            import random
            random.shuffle(files)
            files = files[:SAMPLE_LIMIT]

        for f in files:
            stats = analyze_asset(f)
            if stats:
                cat_stats.append(stats)
                print(f"  {stats['name']}: H={stats['height']:.2f}, W={stats['width']:.2f}, D={stats['depth']:.2f}")

        if cat_stats:
            avg_h = sum(s['height'] for s in cat_stats) / len(cat_stats)
            max_h = max(s['height'] for s in cat_stats)
            min_h = min(s['height'] for s in cat_stats)
            results[cat] = {"avg_h": avg_h, "min_h": min_h, "max_h": max_h, "count": len(cat_stats)}

    print("\n=== SUMMARY STATISTICS ===")
    for cat, stats in results.items():
        print(f"Category: {cat}")
        print(f"  Count: {stats['count']}")
        print(f"  Avg Height: {stats['avg_h']:.4f} units")
        print(f"  Range: {stats['min_h']:.4f} - {stats['max_h']:.4f}")
        
        # Heuristic recommendations
        if "character" in cat:
            # Assume characters should be ~1.8m
            if stats['avg_h'] > 100:
                print("  -> DETECTED CM SCALE (Height > 100). Recommended Scale: 0.01")
            elif stats['avg_h'] < 0.2:
                print("  -> DETECTED TINY SCALE. Recommended Scale: 10 or 100")
            elif 1.5 < stats['avg_h'] < 2.5:
                print("  -> LOOKS CORRECT (Meters). Recommended Scale: 1.0")
        elif "environment" in cat:
            # Walls/Trees usually 3-10m
            if stats['avg_h'] > 200:
                 print("  -> DETECTED CM SCALE. Recommended Scale: 0.01")


if __name__ == "__main__":
    main()
