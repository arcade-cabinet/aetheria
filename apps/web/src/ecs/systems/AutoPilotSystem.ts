import { AutoPilot } from "../../game/ai/AutoPilot";

const pilot = new AutoPilot();
let enabled = false;

export const initAutoPilot = () => {
    // Check URL param
    if (window.location.search.includes("autopilot=true")) {
        enabled = true;
        console.log("AutoPilot Engaged");
    }
};

export const AutoPilotSystem = () => {
    if (enabled) {
        pilot.update(1/60);
    }
};
