import { E2EGovernor } from "./E2EGovernor";

const governor = new E2EGovernor();
let enabled = false;

export const initE2ESystem = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("e2e") === "true") {
        enabled = true;
        console.log("E2E System Enabled");
    }
};

export const E2ESystem = () => {
    if (!enabled) return;
    governor.update(1/60);
};
