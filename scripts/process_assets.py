import bpy
import os

# Configuration
INPUT_DIR = os.path.abspath("public/assets/models")
# We process in place or to a '_processed' folder? In place is destructive but ensures usage.
# Let's target specific subfolders to avoid reprocessing processed ones.

def process_material(mat):
    if not mat.use_nodes:
        return
    
    # Find BSDF
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if not bsdf:
        return

    # Color Logic: Darken and Desaturate
    base_color = bsdf.inputs['Base Color'].default_value
    
    # 1. Desaturate (Average RGB)
    # (R+G+B)/3 approach or luminosity
    lum = (base_color[0] * 0.2126 + base_color[1] * 0.7152 + base_color[2] * 0.0722)
    
    # 2. Re-tint (Gothic Purple/Blue)
    # Mix Lum with Tint Color
    tint = (0.2, 0.15, 0.3, 1.0) # Dark Purple
    
    # Blend: 80% Tint, 20% Original Lum
    new_r = (lum * 0.2) + (tint[0] * 0.8)
    new_g = (lum * 0.2) + (tint[1] * 0.8)
    new_b = (lum * 0.2) + (tint[2] * 0.8)
    
    # Apply
    bsdf.inputs['Base Color'].default_value = (new_r, new_g, new_b, 1.0)
    
    # Increase Roughness (Dusty)
    bsdf.inputs['Roughness'].default_value = 0.9

def process_file(filepath):
    # Clear
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Import
    try:
        bpy.ops.import_scene.gltf(filepath=filepath)
    except Exception as e:
        print(f"Failed to load {filepath}: {e}")
        return

    # Process Materials
    for mat in bpy.data.materials:
        process_material(mat)
        
    # Export
    bpy.ops.export_scene.gltf(filepath=filepath, export_format='GLB')
    print(f"Processed: {filepath}")

# Recursive Walk
for root, dirs, files in os.walk(INPUT_DIR):
    for file in files:
        if file.lower().endswith(".glb") or file.lower().endswith(".gltf"):
            # Optional: Filter by name or folder to avoid processing everything constantly
            # For now, manual run
            filepath = os.path.join(root, file)
            # process_file(filepath) # Uncomment to run
