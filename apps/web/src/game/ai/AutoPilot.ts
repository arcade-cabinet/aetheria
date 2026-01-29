import { Vehicle, State, StateMachine } from "yuka";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { world } from "../../ecs/World";
import { handleInteractionNarrative } from "../../ecs/systems/NarrativeSystem";

class IdleState extends State<AutoPilot> {
    enter() { console.log("[AutoPilot] IDLE"); }
    execute(pilot: AutoPilot) {
        const player = world.with("isPlayer", "position", "physics").first;
        if (player) {
            pilot.entity = player;
            pilot.fsm.changeTo("SEEK_OBJECTIVE");
        }
    }
}

class SeekObjectiveState extends State<AutoPilot> {
    enter() { console.log("[AutoPilot] Seeking Objective..."); }
    execute(pilot: AutoPilot) {
        if (!pilot.entity?.position) return;

        // Hardcoded objective for now: The Anchor at (0, 1, 0)
        // In future, query QuestManager for target position
        const target = new Vector3(0, 1, 0);
        const current = pilot.entity.position;
        
        const dist = Vector3.Distance(current, target);
        
        if (dist > 1.5) {
            // Steering
            const dir = target.subtract(current).normalize();
            const vel = dir.scale(5); // Speed
            
            // Apply to Physics Body
            if (pilot.entity.physics) {
                const body = pilot.entity.physics.body;
                const curVel = body.getLinearVelocity();
                body.setLinearVelocity(new Vector3(vel.x, curVel.y, vel.z));
            }
            
            // Look
            if (pilot.entity.mesh) {
                pilot.entity.mesh.lookAt(target);
            }
        } else {
            // Arrived
            if (pilot.entity.physics) {
                const body = pilot.entity.physics.body;
                body.setLinearVelocity(new Vector3(0, body.getLinearVelocity().y, 0));
            }
            pilot.fsm.changeTo("INTERACT");
        }
    }
}

class InteractState extends State<AutoPilot> {
    timer = 0;
    enter() { 
        console.log("[AutoPilot] Attempting Interaction..."); 
        this.timer = 0;
    }
    execute(pilot: AutoPilot) {
        this.timer++;
        
        // Wait a bit to ensure stability
        if (this.timer > 120) {
            const liveWorld = (window as any).world;
            if (!liveWorld) return;

            const anchor = liveWorld.with("questTargetId").first; 
            
            if (anchor && anchor.questTargetId === "ancient_anchor") {
                console.log("[AutoPilot] Anchor Found! Triggering Interaction.");
                handleInteractionNarrative(anchor);
                pilot.fsm.changeTo("IDLE"); // Done
            }
        }
    }
}

export class AutoPilot extends Vehicle {
    fsm: StateMachine<AutoPilot>;
    entity: any = null;

    constructor() {
        super();
        this.fsm = new StateMachine(this);
        this.fsm.add("IDLE", new IdleState());
        this.fsm.add("SEEK_OBJECTIVE", new SeekObjectiveState());
        this.fsm.add("INTERACT", new InteractState());
        this.fsm.changeTo("IDLE");
    }

    update(delta: number) {
        this.fsm.update();
        super.update(delta);
        return this;
    }
}
