import os
import pathlib

AUDIO_DIR = "assets/music"
OUTPUT_FILE = "src/features/audio/AudioMap.ts"

print(f"Generating {OUTPUT_FILE}...")

ts_content = "export const AudioMap: Record<string, any> = {\n"

for root, dirs, files in os.walk(AUDIO_DIR):
    for file in files:
        if file.endswith(".wav") or file.endswith(".mp3"):
            # ID: clean the filename
            asset_id = os.path.splitext(file)[0].replace(" ", "_").replace("(", "").replace(")", "").replace("'", "").replace("-", "_").replace("__", "_")
            
            p = pathlib.Path(root) / file
            rel_path = "../../../" + str(p.as_posix())
            
            ts_content += f'    "{asset_id}": require("{rel_path}"),\n'

ts_content += "};\n"

with open(OUTPUT_FILE, "w") as f:
    f.write(ts_content)

print("Done.")