import seedrandom from "seedrandom";

const ADJECTIVES = [
    "Fractured", "Gothic", "Ethereal", "Hollow", "Silent", "Crimson", "Shadowed", "Ancient",
    "Whispering", "Forgotten", "Cursed", "Divine", "Broken", "Eternal", "Frozen", "Obsidian",
    "Velvet", "Iron", "Pale", "Lost", "Wandering", "Shattered", "Boundless", "Timeless"
];

const NOUNS = [
    "Realm", "Void", "Spire", "Citadel", "Ruins", "Abyss", "Sanctuary", "Throne",
    "Echo", "Dream", "Nightmare", "Empire", "Omen", "Veil", "Nexus", "Horizon",
    "Keep", "Crypt", "Altar", "Obelisk", "Shard", "Memory", "Wraith", "Phantom"
];

export const generateSeedPhrase = (): string => {
    // Entropy source for the initial seed suggestion
    const r = () => Math.random(); 
    
    const adj1 = ADJECTIVES[Math.floor(r() * ADJECTIVES.length)];
    const adj2 = ADJECTIVES[Math.floor(r() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(r() * NOUNS.length)];
    return `${adj1}-${adj2}-${noun}`;
};

export const createRng = (seed: string) => {
    return seedrandom(seed);
};
