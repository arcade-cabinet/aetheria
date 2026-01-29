import bpy
import os
import math

# Configuration
ASSET_DIR = os.path.abspath("public/assets/models/characters/humanoid")
OUTPUT_DIR = os.path.abspath("public/assets/ui/portraits")
MODELS = [
    ("dread_knight", "Skeleton_Warrior.glb"),
    ("assassin", "Skeleton_Rogue.glb"),
    ("warlock", "Skeleton_Mage.glb"),
    ("minion", "Skeleton_Minion.glb")
]

def setup_scene():
    # Clear existing
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Camera
    cam_data = bpy.data.cameras.new(name='Camera')
    cam_obj = bpy.data.objects.new(name='Camera', object_data=cam_data)
    bpy.context.scene.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    
    # Position: Front view, slightly elevated
    cam_obj.location = (0, -2.5, 1.2)
    cam_obj.rotation_euler = (math.radians(80), 0, 0)
    
    # Light 1: Key
    light_data = bpy.data.lights.new(name="Key", type='AREA')
    light_data.energy = 500
    light_obj = bpy.data.objects.new(name="Key", object_data=light_data)
    bpy.context.scene.collection.objects.link(light_obj)
    light_obj.location = (1.5, -2, 2)
    light_obj.rotation_euler = (math.radians(60), 0, math.radians(45))

    # Light 2: Fill (Purple for Gothic vibe)
    light_data2 = bpy.data.lights.new(name="Fill", type='AREA')
    light_data2.energy = 200
    light_data2.color = (0.5, 0.2, 0.8) # Purple
    light_obj2 = bpy.data.objects.new(name="Fill", object_data=light_data2)
    bpy.context.scene.collection.objects.link(light_obj2)
    light_obj2.location = (-1.5, -1, 1)
    light_obj2.rotation_euler = (math.radians(60), 0, math.radians(-45))

    # Light 3: Rim (Cold Blue)
    light_data3 = bpy.data.lights.new(name="Rim", type='SPOT')
    light_data3.energy = 1000
    light_data3.color = (0.2, 0.5, 1.0)
    light_obj3 = bpy.data.objects.new(name="Rim", object_data=light_data3)
    bpy.context.scene.collection.objects.link(light_obj3)
    light_obj3.location = (0, 3, 2)
    light_obj3.rotation_euler = (math.radians(130), 0, 0)

    # Render Settings
    bpy.context.scene.render.resolution_x = 512
    bpy.context.scene.render.resolution_y = 512
    bpy.context.scene.render.film_transparent = True

def render_model(model_id, filename):
    setup_scene()
    
    filepath = os.path.join(ASSET_DIR, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    # Import GLB
    bpy.ops.import_scene.gltf(filepath=filepath)
    
    # Center Model (KayKit models might be offset)
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            # Basic centering logic: bounds center to origin
            # But usually root object is enough. 
            # KayKit usually has a root empty or armature.
            pass
            
    # Set Output
    out_path = os.path.join(OUTPUT_DIR, f"{model_id}.png")
    bpy.context.scene.render.filepath = out_path
    
    # Render
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {model_id} to {out_path}")

# Ensure output dir
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Run
for mid, fname in MODELS:
    render_model(mid, fname)
