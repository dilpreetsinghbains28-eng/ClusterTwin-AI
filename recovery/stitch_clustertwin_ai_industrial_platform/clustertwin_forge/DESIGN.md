---
name: ClusterTwin Forge
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bcc9c6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#879391'
  outline-variant: '#3d4947'
  surface-tint: '#6bd8cb'
  primary: '#6bd8cb'
  on-primary: '#003732'
  primary-container: '#29a195'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb59a'
  on-tertiary: '#591c02'
  tertiary-container: '#d27956'
  on-tertiary-container: '#4f1700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-desktop: 32px
  container-padding-mobile: 16px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style

The design system is engineered to evoke the precision of high-end industrial automation and the visionary scale of digital twin technology. It targets decision-makers in MSME industrial clusters, blending corporate reliability with the cutting-edge aesthetic of Industry 4.0.

The visual style is **Futuristic Glassmorphism**. It utilizes deep layers of transparency, frosted textures, and refractive surfaces to simulate a sophisticated command center environment. The emotional response is one of "Technical Mastery"—clean, hyper-organized, and illuminating. High-fidelity glass effects are paired with vibrant neon accents to highlight data pathways and active connections within the industrial cluster.

## Colors

This design system utilizes a "Deep Space" palette. The foundation is built on `#0F172A`, providing a high-contrast stage for vibrant data visualization. 

- **Primary & Secondary:** A dual-tone system of Teal and Electric Blue represents the flow of data and energy. These are rarely used as flat colors; they primarily appear as gradients or glow effects to denote active states and connectivity.
- **Surface Glass:** The core background for containers. It must maintain a 70% opacity over the background with a 20px backdrop-blur to ensure legibility and depth.
- **Border Glow:** A subtle, translucent gradient used on container edges to define structure without the weight of solid lines.

## Typography

The typography strategy emphasizes technical precision. 

- **Display & Headlines:** Use **Geist** for its clinical, architectural structure. It should be used for large titles and key metrics.
- **Body:** **Inter** provides maximum legibility for dense industrial data and analytical reports. 
- **Labels & Metadata:** **JetBrains Mono** is utilized for status labels, sensor IDs, and coordinate data, reinforcing the "Digital Twin" and "Code-driven" nature of the platform.

All text should default to high-contrast white or light gray (`#F8FAFC`), with primary teal used sparingly for semantic emphasis.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a heavy emphasis on information density. Industrial dashboards require a compact spacing rhythm (based on a 4px scale) to maximize the "at-a-glance" visibility of cluster operations.

- **Desktop:** A 12-column grid with a fixed 24px gutter. Primary navigation is typically a slim, collapsed left-hand sidebar to maximize horizontal space for twin visualizations.
- **Z-Axis Spacing:** Use generous section gaps (64px+) to allow the glassmorphic background blurs to breathe and prevent visual clutter.
- **Mobile:** Elements reflow into a single column. Cards lose their external glow but retain the internal frosted texture to maintain brand consistency.

## Elevation & Depth

Depth is not communicated through traditional black shadows, but through **Luminance and Refraction**.

1.  **Level 0 (Base):** The `#0F172A` background.
2.  **Level 1 (Sub-surface):** Deep teal or blue radial gradients positioned behind cards to create a "glow from within" effect.
3.  **Level 2 (Glass Containers):** Frosted surfaces using `surface-glass`. These use a 1px `border-glow` to define edges.
4.  **Level 3 (Interactive/Floating):** Higher opacity glass with a more pronounced drop shadow that carries a subtle primary color tint (e.g., `rgba(13, 148, 136, 0.3)`).

Avoid solid fills. Every layer should feel like a piece of high-tech hardware or a floating digital display.

## Shapes

The shape language is **Soft-Geometric**. 

We use a 0.25rem (4px) base radius for small elements like buttons and inputs to maintain a sharp, professional edge. Larger cards and modals use 0.75rem (12px) to soften the overall interface and make the glass surfaces feel premium rather than aggressive. 

Interactive elements should feature "Micro-chamfers"—the appearance of a slight 45-degree angled edge—achieved through the 1px inner border-glow.

## Components

### Buttons
- **Primary:** Filled with the `primary-gradient`. Text is bold white. No border, but a 4px outer glow of the same color on hover.
- **Secondary/Ghost:** Transparent background with the 1px `border-glow`. On hover, the background fills with a 10% teal tint.

### Cards
- Always use `surface-glass`.
- Must include a 1px top-border highlight (pure white at 20% opacity) to simulate light catching the "edge" of the glass.

### Input Fields
- Dark, recessed backgrounds (`#1E293B`).
- Focus state triggers a full `border-glow` and a subtle inner shadow to create a "carved" look.
- Use `label-mono` for field titles.

### Chips & Status Indicators
- Use `jetbrainsMono` for text.
- Statuses (Running, Alert, Offline) use a small pulsating dot icon next to the text to signify real-time connectivity.

### Industrial-Specific Components
- **Twin Viewport:** A large-scale container with zero padding, reserved for 3D/2D cluster visualizations.
- **Telemetry Sparklines:** Minimalist, high-density line charts using the primary teal color with a gradient area fill (teal to transparent).