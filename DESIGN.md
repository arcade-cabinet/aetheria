# **Aetheria: Design System & Visual Identity**

## **1\. Visual Pillars**

**"Obsidian & Starlight"**

* **The Void:** The world emerges from darkness. Backgrounds are never flat black, but deep, atmospheric void-colors (Dark Blues, Purples, Greys).  
* **The Artifact:** UI elements feel like physical objects carved from obsidian, edged in gold or rusted metal.  
* **The Aether:** Magic and active elements are represented by piercing, neon light (Cyan/Purple) that contrasts sharply with the dark environment.

## **2\. Typography (Google Fonts)**

We utilize a three-tier font system to blend "Ancient" with "Magitech".

### **Import**

Add this to your index.html head:

\<link rel="preconnect" href="\[https://fonts.googleapis.com\](https://fonts.googleapis.com)"\>  
\<link rel="preconnect" href="\[https://fonts.gstatic.com\](https://fonts.gstatic.com)" crossorigin\>  
\<link href="\[https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900\&family=Cinzel:wght@500;600\&family=Rajdhani:wght@500;600;700\&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400\&display=swap\](https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900\&family=Cinzel:wght@500;600\&family=Rajdhani:wght@500;600;700\&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400\&display=swap)" rel="stylesheet"\>

### **Usage Guidelines**

#### **Display / Logo**

* **Font:** Cinzel Decorative  
* **Weight:** 900 (Black)  
* **Usage:** Game Title, Chapter Headings, "Victory/Defeat" screens.  
* **Effect:** CSS text-shadow is mandatory.  
  text-shadow: 0 0 10px rgba(102, 252, 241, 0.5);

#### **Headers / UI Titles**

* **Font:** Cinzel  
* **Weight:** 600 (SemiBold)  
* **Usage:** Panel Titles ("Inventory", "Character"), Button Labels (if majestic).  
* **Tracking:** letter-spacing: 0.05em.

#### **HUD / Data / Tactical**

* **Font:** Rajdhani  
* **Weight:** 600 (SemiBold)  
* **Usage:** HP/MP Bars, Item Stats, Coordinates, "System Ready" logs.  
* **Vibe:** Technical, squared-off, readable at small sizes.

#### **Lore / Prose**

* **Font:** Cormorant Garamond  
* **Weight:** 400 (Regular) or *Italic*  
* **Usage:** Quest descriptions, Dialogue history, Books/Scrolls.  
* **Vibe:** Elegant, old-world, distinct from the UI layer.

## **3\. Color Palette (The Obsidian Theme)**

Define these in your global CSS (index.css or App.css).

### **Base Layers**

| Token | Value | Usage |
| :---- | :---- | :---- |
| \--void-black | \#050505 | Canvas Background, Deep Shadows |
| \--void-depth | \#0b0c10 | Modal Backdrops (opaque) |
| \--obsidian-glass | rgba(20, 20, 25, 0.75) | **Primary UI Panels** (Blur 12px) |
| \--obsidian-solid | \#1f2833 | Tooltips, Solid Buttons |

### **Accents (The Aether)**

| Token | Value | Usage |
| :---- | :---- | :---- |
| \--aether-cyan | \#66fcf1 | Primary Actions, Mana, Highlight |
| \--aether-dim | \#45a29e | Secondary Text, Borders |
| \--magic-purple | \#9d00ff | Enchantment, Rare Items |
| \--alert-crimson | \#ff2e63 | Health, Danger, Errors |
| \--gold-filigree | \#c5a059 | Structural Borders, Titles |

## **4\. UI Components & 9-Slice Scaling**

### **The "Gothic Plate" Button (9-Slice)**

We do not use standard CSS borders. We use a **9-Slice Scaling** strategy for buttons to achieve the "Gothic Tracery" look without distorting the corners.

**Implementation Strategy:**

1. **Source Asset:** A high-res PNG containing ornate corners and a repeating middle edge.  
2. **CSS:** border-image logic.

.btn-gothic {  
  border: 24px solid transparent;  
  /\* Replace with actual asset path \*/  
  border-image-source: url('/assets/ui/gothic\_border\_9slice.png');   
  border-image-slice: 40 fill; /\* 40px corners, fill center \*/  
  border-image-width: 24px;  
  border-image-repeat: stretch; /\* Stretch sides \*/  
    
  font-family: 'Cinzel', serif;  
  font-weight: 600;  
  color: var(--aether-cyan);  
  background: transparent; /\* Filled by 9-slice center \*/  
    
  cursor: pointer;  
  transition: transform 0.1s, filter 0.2s;  
}

.btn-gothic:hover {  
  filter: drop-shadow(0 0 5px var(--aether-cyan));  
}

.btn-gothic:active {  
  transform: scale(0.96);  
}

### **The "Glass Slab" Panel**

Standard container for Inventory, Stats, and Settings.

* **Backdrop:** backdrop-filter: blur(12px)  
* **Border:** 1px solid rgba(255, 255, 255, 0.1)  
* **Gradient:** Top-down linear gradient rgba(255,255,255,0.05) \-\> transparent.  
* **Corner Detail:** 4px absolute positioned divs at corners in \--gold-filigree to simulate metal brackets.

## **5\. Layout & UX (Mobile-First)**

### **The Thumb Zone (0% \- 40% Height)**

* **Strict Rule:** No critical gameplay controls above 40% screen height.  
* **Virtual Joystick:** Dynamic anchor (appears where touched).  
* **Action Cluster:** Arc layout for right thumb (Jump, Interact, Attack).

### **The Viewport (40% \- 100% Height)**

* **Cleanliness:** Keep this area free of opaque UI.  
* **HUD:** Floating text (Damage numbers, Interaction prompts) projected into 3D space, not screen space.  
* **Minimap:** Top-right corner, circular, 20% opacity when player moves.

## **6\. 3D Aesthetic (BabylonJS Pipeline)**

### **Lighting Strategy**

* **Ambient:** Low intensity HemisphericLight (Color: Dark Blue/Purple).  
* **Key:** DirectionalLight (Moonlight/Sunlight) casting soft shadows.  
* **Rim:** PointLights attached to the Player and Active Magic to separate objects from the dark background.

### **Post-Processing (Mandatory)**

1. **GlowLayer:** Intensity 0.8. Threshold 0.5. (Makes neon runes pop).  
2. **SSAO2 (Screen Space Ambient Occlusion):** Radius 2.0. (Essential for "Clay/Model" look on procedural geometry).  
3. **Chromatic Aberration:** Very slight (2px) at screen edges for "Dreamlike" quality.

### **Materials**

* **StandardMaterial:** Used for terrain/walls. High specularColor for wet stone look.  
* **PBRMaterial:** Used for Hero/Important Props. metallic: 0.8, roughness: 0.4 (Obsidian look).

## **7\. Iconography**

Use **Lucide-React** with thin stroke weights (1.5px) to match the elegant UI lines.

* **Inventory:** Backpack  
* **Skills:** Sparkles  
* **Settings:** Settings (rotate on hover)  
* **Map:** Map  
* **Close:** X (styled as a gothic cross)