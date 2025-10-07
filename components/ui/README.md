# UI Components

Modern, accessible UI components built with Radix UI and Tailwind CSS.

## Design System

### Color System
All components use CSS variables for theming:
- `--background` / `--foreground`: Main background and text
- `--primary` / `--primary-foreground`: Primary action color
- `--secondary` / `--secondary-foreground`: Secondary actions
- `--muted` / `--muted-foreground`: Muted backgrounds and text
- `--accent` / `--accent-foreground`: Accent elements
- `--destructive` / `--destructive-foreground`: Destructive actions
- `--border` / `--input` / `--ring`: Border and input styles

### Components

#### Button
```tsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon"><Icon /></Button>
```

#### Input
```tsx
import { Input } from '@/components/ui/input'

<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="your@email.com" />
```

#### Textarea
```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Enter long text..." />
```

#### Card
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

#### ThemeToggle
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

<ThemeToggle />
```

#### Header
```tsx
import { Header } from '@/components/ui/header'

// Place in layout
<Header />
```

#### Footer
```tsx
import { Footer } from '@/components/ui/footer'

// Place in layout
<Footer />
```

## Usage Guidelines

### Accessibility
- All components support keyboard navigation
- Focus states are clearly visible
- ARIA attributes are included where appropriate
- Color contrast meets WCAG AA standards

### Responsive Design
- Components are mobile-first
- Use responsive Tailwind classes (sm:, md:, lg:, xl:)
- Test at breakpoints: 360px, 768px, 1024px, 1440px

### Theming
Components automatically adapt to light/dark theme via `next-themes`:

```tsx
import { ThemeProvider } from '@/components/theme-provider'

// Wrap your app
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>
```

### Animation
Use Framer Motion for animations:

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  Content
</motion.div>
```

### Custom Utilities

#### Container
```tsx
// Tight container (max-width-xl)
<div className="container-tight">...</div>

// Wide container (max-width-2xl)
<div className="container-wide">...</div>
```

#### Shadows
```tsx
<div className="shadow-custom-sm">...</div>
<div className="shadow-custom-md">...</div>
<div className="shadow-custom-lg">...</div>
<div className="shadow-custom-xl">...</div>
<div className="shadow-custom-2xl">...</div>
```

#### Grid Background
```tsx
<div className="bg-grid-pattern">...</div>
```

#### Gradient Text
```tsx
<h1 className="gradient-text">Gradient Text</h1>
```

## Best Practices

1. **Consistency**: Use design tokens instead of hardcoded values
2. **Composition**: Combine components to build complex UIs
3. **Performance**: Use `className` prop to extend component styles
4. **A11y**: Always include proper labels and ARIA attributes
5. **Responsive**: Test all breakpoints and touch targets

## Adding New Components

When adding a new shadcn/ui component:

```bash
npx shadcn-ui@latest add [component-name]
```

Then update it to use the design system tokens and styling conventions.
