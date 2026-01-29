import { Vehicle, State, StateMachine } from "yuka";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { world } from "../../ecs/World";
import { handleInteractionNarrative } from "../../ecs/systems/NarrativeSystem";

// Global Trigger for E2E Interaction (simulating keypress)
export const e2eInput = {
    interact: false
};

class IdleState extends State<any> {
    enter() {
        console.log("[E2E] Entered IDLE");
    }
    execute(gov: E2EGovernor) {
        // Use live world instance from window
        const liveWorld = (window as any).world || world;
        
        // Wait for player entity
        const player = liveWorld.with("isPlayer", "position").first;
        if (player && player.position) {
            gov.playerEntity = player;
            gov.fsm.changeTo("SEEK_ANCHOR");
        }
    }
}

class SeekAnchorState extends State<any> {
    enter() {
        console.log("[E2E] Seeking Anchor...");
    }
    execute(gov: E2EGovernor) {
        const player = gov.playerEntity;
        if (!player || !player.position || !player.physics) return;

        const targetPos = new Vector3(0, player.position.y, 0); // Anchor is at 0,1,0
        const dist = Vector3.Distance(player.position, targetPos);

        if (dist > 2.0) {
            // Move
            const dir = targetPos.subtract(player.position).normalize();
            const vel = dir.scale(5);
            player.physics.body.setLinearVelocity(new Vector3(vel.x, player.physics.body.getLinearVelocity().y, vel.z));
            
            // Look at
            if (player.mesh) player.mesh.lookAt(targetPos);
        } else {
            // Arrived
            player.physics.body.setLinearVelocity(new Vector3(0, 0, 0));
            gov.fsm.changeTo("INTERACT");
        }
    }
}

class InteractState extends State<any> {
    timer = 0;
    enter() {
        console.log("[E2E] Interacting...");
        this.timer = 0;
    }
    execute(gov: E2EGovernor) {
        this.timer++;
        
        // Wait a bit to ensure stability
        if (this.timer > 120) { // 2 seconds
            const liveWorld = (window as any).world;
            
            if (!liveWorld) {
                console.log("[E2E] CRITICAL: window.world not found on window object.");
                return;
            }

            console.log(`[E2E] World Check - Entities: ${liveWorld.entities.length}`);
            const narrativeEntities = liveWorld.with("questTargetId").entities;
            console.log(`[E2E] Narrative Query - Count: ${narrativeEntities.length}`);
            
            for (const e of narrativeEntities) {
                console.log(`[E2E] Found Target: ${e.questTargetId}`);
                if (e.questTargetId === "ancient_anchor") {
                    console.log("[E2E] Anchor Found! Triggering Interaction.");
                    handleInteractionNarrative(e);
                    gov.fsm.changeTo("COMPLETE");
                    return;
                }
            }
        }
    }
}

class CompleteState extends State<any> {
    enter() {
        console.log("[E2E] Sequence Complete.");
        // Add visual marker for Playwright to find
        const div = document.createElement("div");
        div.id = "e2e-complete";
        div.style.position = "absolute";
        div.style.top = "0";
        div.style.left = "0";
        div.style.width = "10px";
        div.style.height = "10px";
        div.style.backgroundColor = "green";
        document.body.appendChild(div);
    }
}

export class E2EGovernor extends Vehicle {
    fsm: StateMachine<any>;
    playerEntity: any = null;

    constructor() {
        super();
        this.fsm = new StateMachine(this);
        this.fsm.add("IDLE", new IdleState());
        this.fsm.add("SEEK_ANCHOR", new SeekAnchorState());
        this.fsm.add("INTERACT", new InteractState());
        this.fsm.add("COMPLETE", new CompleteState());
        this.fsm.changeTo("IDLE");
    }

    update(delta: number) {
        this.fsm.update();
        super.update(delta);
        return this;
    }
}