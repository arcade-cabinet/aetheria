import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { world } from "../World";

export const IndicatorSystem = (scene: import("@babylonjs/core/scene").Scene) => {
    // 1. Add Indicators
    for (const entity of world.with("indicatorType", "mesh")) {
        if (!entity.indicatorMesh) {
            // ... (Creation logic remains) ...
            const plane = MeshBuilder.CreatePlane("indicator", { size: 1 }, scene);
            plane.parent = entity.mesh;
            plane.position.y = 2.5; // Above head
            plane.billboardMode = 7; // ALL

            const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
            const textBlock = new TextBlock();
            textBlock.fontSize = 150;
            textBlock.color = "#ffd700"; // Gold
            textBlock.outlineColor = "black";
            textBlock.outlineWidth = 10;
            advancedTexture.addControl(textBlock);

            // Add component via world to satisfy Miniplex
            world.addComponent(entity, "indicatorMesh", plane);
            plane.metadata = { textBlock }; 
        }

        // Update State
        if (entity.indicatorMesh) {
            const plane = entity.indicatorMesh;
            const textBlock = plane.metadata.textBlock as TextBlock;

            switch (entity.indicatorType) {
                case "QUEST_TARGET":
                    textBlock.text = "!";
                    textBlock.color = "#ffd700"; // Gold
                    break;
                case "QUEST_AVAILABLE":
                    textBlock.text = "!";
                    textBlock.color = "#9d00ff"; // Purple
                    break;
                case "INTERACT":
                    textBlock.text = "...";
                    textBlock.color = "#cccccc";
                    break;
            }
        }
    }

    // 2. Remove Indicators
    for (const entity of world.with("indicatorMesh")) {
        if (!entity.indicatorType) {
            entity.indicatorMesh.dispose();
            world.removeComponent(entity, "indicatorMesh");
        }
    }
};
