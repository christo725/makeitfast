# Design Direction

## Visual Concepts

### 1. **Velocity** (Selected Direction)
A high-performance, speed-focused aesthetic inspired by Linear and Vercel.

- **Mood**: Fast, precise, technical, confident
- **Visual cues**: Sharp edges, minimal ornamentation, speed-line accents
- **Motion**: Quick, snappy transitions (150ms), directional slides
- **Differentiator**: Emphasizes processing speed with velocity-inspired gradients
- **Best for**: Power users who value efficiency

### 2. **Clarity**
A clean, approachable design inspired by Notion and Stripe.

- **Mood**: Clear, friendly, organized, trustworthy
- **Visual cues**: Generous whitespace, soft rounded corners, gentle gradients
- **Motion**: Smooth fades (200ms), gentle bounces on interaction
- **Differentiator**: Focuses on content hierarchy and readability
- **Best for**: Teams and knowledge workers

### 3. **Depth**
A sophisticated, layered design with subtle 3D effects.

- **Mood**: Premium, polished, dimensional, modern
- **Visual cues**: Layered cards, depth shadows, glass morphism accents
- **Motion**: Lift animations, parallax hints, scale transforms
- **Differentiator**: Creates visual interest through depth and elevation
- **Best for**: Consumer-facing products

---

## Velocity Design System (Implementation)

### Color Tokens

```css
/* Light Theme */
--bg: 0 0% 100%;                    /* Pure white */
--fg: 240 10% 3.9%;                 /* Near black */
--card: 0 0% 100%;                  /* White */
--card-fg: 240 10% 3.9%;            /* Near black */
--popover: 0 0% 100%;               /* White */
--popover-fg: 240 10% 3.9%;         /* Near black */

--primary: 262 83% 58%;             /* Purple 500 - action color */
--primary-fg: 0 0% 100%;            /* White */

--secondary: 240 4.8% 95.9%;        /* Gray 100 */
--secondary-fg: 240 5.9% 10%;       /* Gray 900 */

--muted: 240 4.8% 95.9%;            /* Gray 100 */
--muted-fg: 240 3.8% 46.1%;         /* Gray 500 */

--accent: 240 4.8% 95.9%;           /* Gray 100 */
--accent-fg: 240 5.9% 10%;          /* Gray 900 */

--destructive: 0 84.2% 60.2%;       /* Red 500 */
--destructive-fg: 0 0% 100%;        /* White */

--border: 240 5.9% 90%;             /* Gray 200 */
--input: 240 5.9% 90%;              /* Gray 200 */
--ring: 262 83% 58%;                /* Purple 500 */

--radius: 0.5rem;                   /* 8px base */

/* Dark Theme */
--bg: 240 10% 3.9%;                 /* Near black */
--fg: 0 0% 98%;                     /* Off white */
--card: 240 10% 3.9%;               /* Near black */
--card-fg: 0 0% 98%;                /* Off white */
--popover: 240 10% 3.9%;            /* Near black */
--popover-fg: 0 0% 98%;             /* Off white */

--primary: 263 70% 50%;             /* Purple 600 - adjusted for dark */
--primary-fg: 0 0% 100%;            /* White */

--secondary: 240 3.7% 15.9%;        /* Gray 800 */
--secondary-fg: 0 0% 98%;           /* Off white */

--muted: 240 3.7% 15.9%;            /* Gray 800 */
--muted-fg: 240 5% 64.9%;           /* Gray 400 */

--accent: 240 3.7% 15.9%;           /* Gray 800 */
--accent-fg: 0 0% 98%;              /* Off white */

--destructive: 0 62.8% 30.6%;       /* Red 900 */
--destructive-fg: 0 0% 98%;         /* Off white */

--border: 240 3.7% 15.9%;           /* Gray 800 */
--input: 240 3.7% 15.9%;            /* Gray 800 */
--ring: 263 70% 50%;                /* Purple 600 */
```

### Typography

**Font Pairing**: Geist (primary) + Geist Mono (code/data)

```typescript
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

// Usage:
className={GeistSans.variable + ' ' + GeistMono.variable}
```

**Scale**:
- Display: 56px / 60px (3.5rem / 1.07)
- H1: 48px / 52px (3rem / 1.08)
- H2: 36px / 40px (2.25rem / 1.11)
- H3: 24px / 32px (1.5rem / 1.33)
- Body: 16px / 24px (1rem / 1.5)
- Small: 14px / 20px (0.875rem / 1.43)
- Tiny: 12px / 16px (0.75rem / 1.33)

### Border Radius Scale

```css
--radius-sm: 6px;   /* Buttons, inputs */
--radius-md: 12px;  /* Cards, modals */
--radius-lg: 16px;  /* Large cards */
--radius-xl: 24px;  /* Hero elements */
--radius-2xl: 32px; /* Feature blocks */
```

### Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Dark mode shadows - use rgba for elevation */
--shadow-sm-dark: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-md-dark: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
--shadow-lg-dark: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4);
--shadow-xl-dark: 0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4);
--shadow-2xl-dark: 0 25px 50px -12px rgb(0 0 0 / 0.6);
```

### Spacing Scale (8px base)

```
4px   (0.5)  - xs
8px   (1)    - sm
12px  (1.5)  - md
16px  (2)    - base
24px  (3)    - lg
32px  (4)    - xl
48px  (6)    - 2xl
64px  (8)    - 3xl
96px  (12)   - 4xl
128px (16)   - 5xl
```

### Motion System

**Duration**:
- Instant: 100ms (micro-interactions)
- Fast: 150ms (buttons, hovers)
- Base: 200ms (cards, modals)
- Slow: 300ms (page transitions)

**Easing**:
```typescript
const transitions = {
  easeOut: [0.16, 1, 0.3, 1],      // Default exit
  easeIn: [0.7, 0, 0.84, 0],       // Entrance
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
}
```

**Variants**:
```typescript
const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
}

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
}
```

### Grid System

**Container**: 12-column grid with max-width constraints
```typescript
const containers = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1400px' // Max width
}
```

**Gutter**: 24px (mobile), 32px (tablet+)

### Icon System

**Size scale**:
- xs: 16px (inline with text)
- sm: 20px (buttons, inputs)
- base: 24px (navigation, cards)
- lg: 32px (feature icons)
- xl: 48px (hero icons)

**Stroke width**: 2px (consistent)

---

## Component Specifications

### Hero Section
- **Headline**: 56px bold, max-width 800px, gradient text effect
- **Subhead**: 20px regular, max-width 600px, muted color
- **CTAs**: Primary (solid) + Secondary (outline), gap 12px
- **Background**: Subtle grid pattern with radial gradient overlay
- **Padding**: 40px top/bottom (mobile), 128px top/bottom (desktop)
- **Animation**: Fade in headline (0ms), subhead (100ms), CTAs (200ms)

### Features Grid
- **Layout**: 3 columns (desktop), 1 column (mobile)
- **Card**: Border, rounded-lg, padding 24px, hover lift effect
- **Icon**: 48px, primary color, top-left
- **Title**: 20px semibold, margin-bottom 8px
- **Description**: 16px regular, muted color, 2-3 lines
- **Animation**: Stagger 60ms per card on scroll

### Footer
- **Columns**: 4 (Product, Company, Resources, Legal)
- **Text**: 14px, muted color
- **Spacing**: 48px top padding, 24px bottom
- **Border**: Top border (subtle)
- **Links**: Hover underline, transition 150ms

---

## Migration Notes

### Breaking Changes
1. **Removed**: All custom CSS files, replaced with Tailwind + CSS variables
2. **Replaced**: Custom button/input components with shadcn/ui
3. **Updated**: Color system from static values to theme-aware tokens
4. **Added**: Dark mode support with next-themes

### Before/After
- Before: Hardcoded colors (`bg-blue-500`)
- After: Token-based (`bg-primary`)
- Before: Inline styles and CSS modules
- After: Tailwind utilities with design tokens
- Before: No dark mode
- After: Full light/dark theme support with system detection
