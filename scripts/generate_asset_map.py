import os

ASSETS_DIR = "assets/models"
OUTPUT_FILE = "src/game/AssetMap.ts"

print(f"Generating {OUTPUT_FILE}...")

ts_content = "export const AssetMap: Record<string, any> = {\n"

for root, dirs, files in os.walk(ASSETS_DIR):
    for file in files:
        if file.endswith(".glb") or file.endswith(".gltf"):
            # ID is the filename without extension
            asset_id = os.path.splitext(file)[0]
            # Path relative to src/game/AssetMap.ts -> assets/models/...
            # Actually, let's just construct it manually to be safe.
            # root is like "assets/models/..."
            
            # We need path relative to src/game/
            # ../../assets/models/...
            
            full_path = os.path.join(root, file)
            # relative to CWD
            
            require_path = "../../" + full_path
            # Escape backslash for Python string literal
            require_path = require_path.replace("\\", "/")
            
            ts_content += f'    "{asset_id}": require("{require_path}"),\n'

ts_content += "};\n"

with open(OUTPUT_FILE, "w") as f:
    f.write(ts_content)

print("Done.")