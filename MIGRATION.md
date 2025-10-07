# Design System Migration Guide

## Overview

This document outlines the comprehensive redesign of Make It Fast from a basic app to a modern, product-ready application following the **Velocity** design system.

## What Changed

### 🎨 Design System

**Before:**
- Hardcoded colors and styles
- Inconsistent spacing and typography
- No dark mode support
- Mixed design patterns

**After:**
- CSS variable-based theming
- Consistent 8px spacing scale
- Full light/dark mode support
- Unified design language (Velocity system)

### 🎯 Visual Direction: Velocity

A high-performance, speed-focused aesthetic inspired by Linear and Vercel.

**Key Characteristics:**
- Sharp, precise edges
- Minimal ornamentation
- Quick, snappy transitions (150ms)
- Purple primary color (#A855F7 / hsl(262 83% 58%))
- Emphasis on speed and efficiency

### 🔧 Technical Stack

**Added Dependencies:**
- `framer-motion` - Smooth animations
- `next-themes` - Dark mode support
- `geist` - Modern font family (Geist Sans + Geist Mono)

**Removed/Replaced:**
- Legacy custom CSS → Tailwind utilities
- Inter font → Geist font family
- Hardcoded colors → CSS variables

### 📐 Layout Changes

**Before:**
```
/app/page.tsx (single page app)
```

**After:**
```
/app/(marketing)/page.tsx         # Landing page
/app/(app)/dashboard/page.tsx     # Document processor
/app/(app)/layout.tsx             # App layout
```

### 🎨 Color Tokens

#### Light Theme
```css
--background: 0 0% 100%           /* White */
--foreground: 240 10% 3.9%        /* Near black */
--primary: 262 83% 58%            /* Purple 500 */
--muted: 240 4.8% 95.9%           /* Gray 100 */
--border: 240 5.9% 90%            /* Gray 200 */
```

#### Dark Theme
```css
--background: 240 10% 3.9%        /* Near black */
--foreground: 0 0% 98%            /* Off white */
--primary: 263 70% 50%            /* Purple 600 */
--muted: 240 3.7% 15.9%           /* Gray 800 */
--border: 240 3.7% 15.9%          /* Gray 800 */
```

### 📝 Typography Scale

- **Display**: 56px (hero headlines)
- **H1**: 48px (page titles)
- **H2**: 36px (section headers)
- **H3**: 24px (card titles)
- **Body**: 16px (default text)
- **Small**: 14px (captions)
- **Tiny**: 12px (labels)

### 📦 Component Updates

#### Button
```tsx
// Before
<button className="bg-blue-500 hover:bg-blue-600 ...">

// After
<Button variant="default" size="lg">
```

#### Card
```tsx
// Before
<div className="bg-white border-4 border-black rounded-3xl ...">

// After
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

#### Input/Textarea
```tsx
// Before
<input className="border-2 border-gray-300 rounded-2xl ..." />

// After
<Input placeholder="..." />
<Textarea placeholder="..." />
```

### 🎬 Animation System

**Duration:**
- Instant: 100ms (micro-interactions)
- Fast: 150ms (buttons, hovers)
- Base: 200ms (cards, modals)
- Slow: 300ms (page transitions)

**Easing:**
```typescript
[0.16, 1, 0.3, 1]  // Default ease-out
```

**Example:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  {content}
</motion.div>
```

### 🌓 Dark Mode

**Implementation:**
```tsx
// layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>

// Toggle component
import { ThemeToggle } from '@/components/ui/theme-toggle'
<ThemeToggle />
```

### 📱 Responsive Breakpoints

```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Wide desktop */
2xl: 1400px  /* Max width */
```

### 🏗️ New Components

#### Header
- Sticky navigation
- Logo + brand name
- Navigation links
- Theme toggle
- CTA button

#### Footer
- 4-column grid (Product, Company, Resources, Legal)
- Subdued colors
- Top border
- Responsive layout

#### Landing Page
- Hero with gradient text
- Feature grid (3×2)
- Social proof section
- CTA section

## Migration Steps

### 1. Update Dependencies

```bash
npm install framer-motion next-themes geist
```

### 2. Update Tailwind Config

The config now references CSS variables:
```js
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  // ...
}
```

### 3. Replace Components

**Search and replace patterns:**
- `bg-blue-500` → `bg-primary`
- `text-gray-900` → `text-foreground`
- `text-gray-600` → `text-muted-foreground`
- `border-gray-200` → `border-border`

### 4. Update Fonts

```tsx
// Old
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

// New
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
```

### 5. Add Theme Support

Wrap app in ThemeProvider and add theme toggle to header.

### 6. Update Page Structure

Move existing app logic to `/app/(app)/dashboard/page.tsx` and create new landing at `/app/(marketing)/page.tsx`.

## Testing Checklist

- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Theme toggle works
- [ ] All breakpoints tested (360px, 768px, 1024px, 1440px)
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA
- [ ] Animations feel smooth (not janky)
- [ ] Page loads without layout shift

## Performance Notes

- LCP target: < 2.5s (hero headline or dashboard metric)
- Use `loading="lazy"` for images
- Minimize layout shift with proper sizing
- Use CSS variables for instant theme switching

## Accessibility

- Minimum text size: 16px (body)
- Focus indicators: 2px ring with offset
- Color contrast: 4.5:1 (text), 3:1 (UI)
- Keyboard navigation: All interactive elements
- Screen reader: Proper ARIA labels

## Future Improvements

1. Add skeleton loaders for loading states
2. Implement toast notifications
3. Add data tables with sorting/filtering
4. Create empty states with clear CTAs
5. Add dropdown menus and modals
6. Implement progress indicators

## Resources

- [DESIGN.md](./DESIGN.md) - Full design system specification
- [components/ui/README.md](./components/ui/README.md) - Component documentation
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
