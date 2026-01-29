# Project Aetheria: The Fractured Realm

### Dev Environment

`pnpm install`

`pnpm run dev`

### Production Environment

`pnpm run build`

`pnpm run preview`

## Deployment & Physics Requirements

This project uses Havok Physics (WebAssembly), which requires a secure context with specific HTTP headers to function correctly (especially for SharedArrayBuffer support).

**Required Headers:**
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**Hosting:**
- **Local Preview:** `pnpm run preview` is configured to serve these headers.
- **Production (Vercel/Netlify):** Ensure your hosting provider is configured to send these headers.
- **GitHub Pages:** Does not natively support these headers. You may need a service worker workaround (like `coi-serviceworker`) or switch to a provider that supports headers.

## Features

- **Tech Stack:** React 19, Vite, BabylonJS 7+, Havok Physics, Miniplex (ECS), Zustand.
- **Visuals:** "Obsidian Interface" (Dark, Neon, Glassmorphism).
- **Architecture:** Procedural Generation & Physics-based interactions.
