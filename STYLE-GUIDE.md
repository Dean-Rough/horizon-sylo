# Sylo Style Guide

## 🎨 Design System Overview

Sylo uses a modern, clean design system built on Tailwind CSS and Shadcn UI components, optimized for design professionals.

## 🎯 Color Palette

### Primary Colors
```css
--primary: 140 30% 55%;           /* Green - main brand color */
--primary-foreground: 210 40% 98%; /* Light text on primary */
```

### Neutral Colors
```css
--background: 0 0% 100%;          /* White background */
--foreground: 240 10% 4%;         /* Dark text */
--muted: 210 40% 96.1%;           /* Subtle backgrounds */
--muted-foreground: 215.4 16.3% 46.9%; /* Muted text */
```

### Semantic Colors
```css
--destructive: 0 100% 50%;        /* Red for errors/delete */
--accent: 210 40% 96.1%;          /* Accent backgrounds */
--border: 214.3 31.8% 91.4%;     /* Border color */
```

### Dark Mode
All colors automatically adapt to dark mode with CSS custom properties.

## 📝 Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Weights**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Fallback**: sans-serif

### Usage
```css
font-family: 'Inter', sans-serif;
letter-spacing: 0px; /* Clean, tight spacing */
```

### Tailwind Classes
```html
<!-- Headings -->
<h1 class="text-4xl font-bold">Main Heading</h1>
<h2 class="text-2xl font-semibold">Section Heading</h2>
<h3 class="text-xl font-medium">Subsection</h3>

<!-- Body Text -->
<p class="text-base">Regular paragraph text</p>
<p class="text-sm text-muted-foreground">Secondary text</p>
```

## 🧩 Component Patterns

### Cards
```html
<div class="bg-card border border-border rounded-lg p-6">
  <h3 class="font-semibold mb-2">Card Title</h3>
  <p class="text-muted-foreground">Card content</p>
</div>
```

### Buttons
```html
<!-- Primary Button -->
<button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80">
  Secondary Action
</button>
```

### Form Elements
```html
<!-- Input -->
<input class="border border-input bg-background px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />

<!-- Select -->
<select class="border border-input bg-background px-3 py-2 rounded-md">
  <option>Option 1</option>
</select>
```

## 📐 Spacing & Layout

### Container Sizes
```css
sm: 576px
md: 768px
lg: 992px
xl: 1200px
2xl: 1320px
3xl: 1600px
4xl: 1850px
```

### Common Spacing
```html
<!-- Padding -->
<div class="p-4">Standard padding</div>
<div class="p-6">Card padding</div>
<div class="p-8">Section padding</div>

<!-- Margins -->
<div class="mb-4">Standard bottom margin</div>
<div class="mb-6">Section bottom margin</div>

<!-- Gaps -->
<div class="flex gap-4">Flex with gap</div>
<div class="grid gap-6">Grid with gap</div>
```

## 🎭 Design Tokens

### Border Radius
```css
--radius: 10px;
border-radius: var(--radius);     /* lg: 10px */
border-radius: calc(var(--radius) - 2px); /* md: 8px */
border-radius: calc(var(--radius) - 4px); /* sm: 6px */
```

### Shadows
```html
<div class="shadow-sm">Subtle shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
```

## 🌙 Dark Mode

### Implementation
```html
<!-- Toggle dark mode -->
<html class="dark">
  <!-- All colors automatically adapt -->
</html>
```

### Custom Dark Mode Colors
```css
.dark {
  --background: 240 10% 4%;
  --foreground: 0 0% 100%;
  --card: 240 10% 4%;
  --border: 240 4% 16%;
}
```

## 🎨 Design Studio Specific

### Color Recommendations for Design Focus
```css
/* Consider these additions for design studio branding */
--design-primary: 210 100% 50%;   /* Blue for design tools */
--creative-accent: 280 100% 70%;  /* Purple for creativity */
--inspiration: 45 100% 60%;       /* Orange for inspiration */
```

### Component Variations
```html
<!-- Design Project Card -->
<div class="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
      <!-- Project icon -->
    </div>
    <div>
      <h3 class="font-semibold">Project Name</h3>
      <p class="text-sm text-muted-foreground">Client Name</p>
    </div>
  </div>
  <div class="flex justify-between items-center">
    <span class="text-sm bg-primary/10 text-primary px-2 py-1 rounded">In Progress</span>
    <span class="text-sm text-muted-foreground">Due: May 30</span>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoint Usage
```html
<!-- Mobile first approach -->
<div class="p-4 md:p-6 lg:p-8">
  <h1 class="text-2xl md:text-3xl lg:text-4xl">Responsive heading</h1>
</div>

<!-- Grid layouts -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>
```

## ✨ Animation & Transitions

### Hover Effects
```html
<button class="transition-colors hover:bg-primary/90">Smooth color transition</button>
<div class="transition-shadow hover:shadow-lg">Smooth shadow transition</div>
```

### Loading States
```html
<div class="animate-pulse bg-muted rounded h-4 w-full"></div>
```

## 🔧 Customization

### Adding Custom Colors
```css
/* In globals.css */
:root {
  --custom-brand: 200 100% 50%;
}

/* In tailwind.config.ts */
colors: {
  'custom-brand': 'hsl(var(--custom-brand))',
}
```

### Custom Components
Follow the existing pattern of using CSS custom properties for theming and Tailwind utilities for layout and spacing.

## 📋 Best Practices

1. **Use semantic color names** (primary, secondary, muted) instead of specific colors
2. **Leverage CSS custom properties** for consistent theming
3. **Follow mobile-first** responsive design
4. **Use consistent spacing** with Tailwind's spacing scale
5. **Maintain accessibility** with proper contrast ratios
6. **Test in both light and dark modes**
