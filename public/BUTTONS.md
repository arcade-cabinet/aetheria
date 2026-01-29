# Aetheria UI Buttons (9-slice)

This bundle contains **RGBA PNG** button frames designed for **9-slice scaling** (aka border-image / cap-insets).

## Files

- `assets/ui/buttons/btn_gothic_purple_normal.png`
- `assets/ui/buttons/btn_gothic_purple_hover.png`
- `assets/ui/buttons/btn_gothic_purple_pressed.png`
- `assets/ui/buttons/btn_gothic_purple_disabled.png`
- `buttons.json` (slicing + usage metadata)

All PNGs are **transparent outside the frame** and have a **rich purple center** suitable for button labels.

## Recommended slice values

Asset size: **512×192**

Use these cap insets (pixels):

- Left: **96**
- Right: **96**
- Top: **64**
- Bottom: **64**

These values preserve the ornate corners and keep the center scalable.

## React usage (CSS `border-image`)

### Minimal CSS

```css
.aetheriaBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* The border thickness you want on-screen */
  border: 32px solid transparent;

  /* The 9-slice magic */
  border-image-source: var(--btn-src);
  border-image-slice: 64 96 64 96 fill; /* top right bottom left */
  border-image-width: 32px;
  border-image-repeat: stretch;

  background: transparent;
  padding: 10px 18px;

  font-family: "Cinzel", serif;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #EDE7FF;

  /* Optional */
  text-shadow: 0 1px 2px rgba(0,0,0,0.65);
  cursor: pointer;
}
.aetheriaBtn:focus-visible {
  outline: none;
  filter: drop-shadow(0 0 6px rgba(102,252,241,0.45));
}
```

### React component

```tsx
import React from "react";
import "./aetheria-buttons.css";

type AetheriaButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  state?: "normal" | "hover" | "pressed" | "disabled";
};

const SRC: Record<NonNullable<AetheriaButtonProps["state"]>, string> = {
  normal: "/assets/ui/buttons/btn_gothic_purple_normal.png",
  hover: "/assets/ui/buttons/btn_gothic_purple_hover.png",
  pressed: "/assets/ui/buttons/btn_gothic_purple_pressed.png",
  disabled: "/assets/ui/buttons/btn_gothic_purple_disabled.png",
};

export function AetheriaButton({ state = "normal", disabled, children, ...rest }: AetheriaButtonProps) {
  const s = disabled ? "disabled" : state;
  return (
    <button
      className="aetheriaBtn"
      style={{ ["--btn-src" as any]: `url(${SRC[s]})` }}
      disabled={disabled}
      {...rest}
    >
      <span style={{ paddingInline: 2 }}>{children}</span>
    </button>
  );
}
```

## Notes for other agents

- **Do not** put important label text inside the filigree. Keep labels in the **center safe area** (the “fill” region).
- If you regenerate at a different resolution, keep the **ratios** of the slice values roughly the same:
  - left/right ≈ 96 / 512 = 18.75% of width
  - top/bottom ≈ 64 / 192 = 33.33% of height
- For crisp text on mobile, prefer **min-height: 44px** and adequate padding.

## Quick sanity check (manual)

1. Render at widths: 160px, 280px, 520px.
2. Confirm corners don’t stretch, and filigree on edges remains visually acceptable.
3. Confirm label never overlaps ornamentation.
