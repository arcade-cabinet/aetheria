import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { world } from "../World";

export const DamageTextSystem = (scene: import("@babylonjs/core/scene").Scene) => {
    for (const entity of world.with("isDamageText", "text", "lifetime", "position")) {
        // Init
        if (!entity.mesh) {
            const plane = MeshBuilder.CreatePlane("dmg", { size: 1 }, scene);
            plane.position.copyFrom(entity.position);
            plane.billboardMode = 7;

            const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
            const textBlock = new TextBlock();
            textBlock.text = entity.text;
            textBlock.fontSize = 200;
            textBlock.color = "#ff0000"; // Red
            textBlock.outlineColor = "black";
            textBlock.outlineWidth = 10;
            advancedTexture.addControl(textBlock);

            entity.mesh = plane;
        }

        // Animate
        if (entity.mesh) {
            entity.mesh.position.y += 0.05; // Float up
            entity.lifetime -= 16; // Approx 60fps
            
            // Fade? (Need to access alpha, hard with ADT on mesh without material tweaking)
            // Just dispose when done.
        }

        // Dispose
        if (entity.lifetime <= 0) {
            if (entity.mesh) entity.mesh.dispose();
            world.remove(entity);
        }
    }
};
