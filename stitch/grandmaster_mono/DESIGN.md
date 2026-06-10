# Design System Strategy: Grandmaster Minimalist

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Monolith Strategy."** 

In the world of high-level chess, there is no room for noise—only calculation, intent, and precision. This system moves away from the "clutter" of traditional web dashboards. It treats the interface as a physical grandmaster’s table: a high-contrast environment where every element feels heavy, intentional, and permanent. We break the standard "web template" look by utilizing extreme typographic scales, intentional asymmetry (mimicking an opening gambit), and a sophisticated layering of blacks and greys that creates depth without a single drop of color.

## 2. Colors & Tonal Architecture
We are operating in a strictly monochromatic spectrum. The goal is to create a "Black-Tie" digital environment.

### The "No-Line" Rule
Traditional 1px borders are prohibited for sectioning. They feel "cheap" and technical. Instead, define space through **Tonal Shifts**. A sidebar should not be "bordered" off; it should simply exist as `surface_container_low` against a `background` floor. The transition itself is the boundary.

### Surface Hierarchy & Nesting
Use the surface tiers to create a "nested" physical reality. 
- **The Floor (`surface` / `#131313`):** The base of the application.
- **The Board (`surface_container` / `#1f1f1f`):** The primary workspace.
- **The Pieces (`surface_container_highest` / `#353535`):** Interactive floating elements or active cards.
- **Nesting Logic:** To highlight a specific data point (like a move list), place a `surface_container_lowest` (`#0e0e0e`) element inside a `surface_container_high` (`#2a2a2a`) section. This "recessed" look suggests focus and depth.

### The "Glass & Gradient" Rule
To prevent the UI from feeling "flat" or "dead," use subtle radial gradients on main surfaces. Transitioning from `surface_bright` to `surface_dim` across a large hero area creates a "vignette" effect that draws the eye to the center, mimicking a spotlight on a chess match. 

For floating overlays (Modals/Dropdowns), apply `surface_variant` at 80% opacity with a `20px` backdrop-blur. This ensures the strategic context of the board is never fully lost.

## 3. Typography
The typography is a dialogue between the tradition of the game (Serif) and the precision of the engine (Sans-Serif).

- **Display & Headlines (`notoSerif`):** Used for "The Narrative." Tournament names, Grandmaster quotes, or Match results. It should feel editorial and authoritative. 
- **Interface & Labels (`manrope`):** Used for "The Engine." Move notations, clock timers, and settings. It is clean, legible, and hyper-functional.
- **The Scale:** Leverage the extreme difference between `display-lg` (3.5rem) and `label-sm` (0.6875rem) to create visual drama. A massive serif header next to a tiny, wide-tracked sans-serif label is a hallmark of high-end design.

## 4. Elevation & Depth
In this system, elevation is a result of light and shadow, not lines.

- **Tonal Layering:** Avoid shadows for static elements. Use the `surface-container` scale to "lift" or "sink" content.
- **Ambient Shadows:** For floating elements (e.g., a "Promote Piece" pop-over), use a highly diffused shadow: `box-shadow: 0 20px 40px rgba(0,0,0,0.4)`. The shadow should feel like a soft glow of darkness rather than a hard edge.
- **The "Ghost Border" Fallback:** In rare cases where a boundary is needed for accessibility, use `outline_variant` (`#474747`) at **15% opacity**. It should be felt, not seen.
- **Tactile Sharpness:** While we use the `sm` (0.125rem) or `DEFAULT` (0.25rem) roundedness for most items to maintain a "slick" look, keep the Chess Board itself at `none` (0px) to emphasize its rigidity.

## 5. Components

### Buttons
- **Primary:** `primary` (#ffffff) background with `on_primary` (#1a1c1c) text. Sharp `DEFAULT` corners. No border.
- **Secondary:** `surface_container_highest` background with `on_surface` text. 
- **Tertiary (Ghost):** No background. `primary` text. Transition to a subtle `surface_variant` on hover.

### Chess Specific: The Move List
- **Card/List Style:** Forbid divider lines. Use `surface_container_low` for the "even" moves and `surface_container_lowest` for the "odd" moves. This "Zebra" striping is a nod to the board itself.
- **Active State:** The current move should be `primary_container` with `on_primary_container` text, creating a high-contrast "ping."

### Input Fields
- **Style:** Underline only, using `outline` (#919191). On focus, transition to a `primary` (#ffffff) 2px underline. 
- **Visuals:** Use `manrope` for input text to maintain a technical feel.

### Chips & Badges
- **Status:** Use `secondary_container` for neutral states. Use `error_container` for "Blunders" or "Illegal Moves." Keep them small, capitalized, and letter-spaced (tracking: 0.05em).

## 6. Do's and Don'ts

### Do
- **Use White Space as a Border:** Allow elements to breathe. Large margins between sections create a "Gallery" feel.
- **Embrace High Contrast:** If something is important, make it pure white (`#ffffff`) on the dark background.
- **Use Asymmetry:** In hero sections, offset text to the left or right to create a more dynamic, modern composition.

### Don't
- **Don't use pure grey (#808080):** Always use the designated tokens (like `secondary_fixed`) to ensure the "warmth" or "coolness" of the black remains consistent.
- **Don't use icons for everything:** Chess is a game of notation. Often, a well-set word in `label-md` is more elegant than a generic icon.
- **Don't use 100% opaque borders:** They break the "Monolith" illusion. If you need a divider, use a 1px `surface_variant` line at 30% opacity.