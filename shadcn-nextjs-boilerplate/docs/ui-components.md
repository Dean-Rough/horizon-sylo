# UI Design System

## Overview

This document outlines our UI component strategy, focusing on using Shadcn UI components and maintaining a consistent design system throughout the application.

## Shadcn UI Implementation

We use [Shadcn UI](https://ui.shadcn.com/) as our primary component library. Shadcn UI provides a collection of reusable components built with Radix UI and styled with Tailwind CSS.

### Component Resources

Before creating any new components, check these resources:

1. **[Official Shadcn UI Documentation](https://ui.shadcn.com/)** - Core components and usage
2. **[Awesome Shadcn UI](https://github.com/birobirobiro/awesome-shadcn-ui)** - Community components and resources
3. **[Shadcn Component Browser](https://shadcn.batchtool.com)** - Visual component browser

### Adding Components

To add official Shadcn components:

```bash
npx shadcn-ui@latest add [component-name]
```

Available components include:
- `accordion`
- `alert`
- `alert-dialog`
- `aspect-ratio`
- `avatar`
- `badge`
- `button`
- `calendar`
- `card`
- `checkbox`
- `collapsible`
- `combobox`
- `command`
- `context-menu`
- `dialog`
- `drawer`
- `dropdown-menu`
- `form`
- `hover-card`
- `input`
- `label`
- `menubar`
- `navigation-menu`
- `popover`
- `progress`
- `radio-group`
- `scroll-area`
- `select`
- `separator`
- `sheet`
- `skeleton`
- `slider`
- `switch`
- `table`
- `tabs`
- `textarea`
- `toast`
- `toggle`
- `toggle-group`
- `tooltip`

## Design System

Our design system is built on Tailwind CSS with custom theming to ensure consistency across the application.

### Colors

We use a consistent color palette defined in our Tailwind configuration:

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
};
```

### Typography

We use a consistent typography system:

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
    },
  },
};
```

### Spacing

We follow Tailwind's spacing scale with some custom additions:

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
        "7.5": "1.875rem",
        "9.5": "2.375rem",
      },
    },
  },
};
```

### Shadows

Consistent shadow styles:

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "subtle-lg": "0 2px 4px 0 rgb(0 0 0 / 0.05)",
        card: "0px 2px 8px 0px rgba(0, 0, 0, 0.06)",
        "card-hover": "0px 4px 12px 0px rgba(0, 0, 0, 0.08)",
      },
    },
  },
};
```

## Custom Components

When creating custom components, follow these guidelines:

1. **Composition Over Creation**: Compose new components from existing Shadcn components when possible
2. **Consistent API**: Follow Shadcn's component API patterns
3. **Accessibility**: Ensure all components meet WCAG 2.1 AA standards
4. **Responsive Design**: All components should work across device sizes
5. **Dark Mode Support**: Support both light and dark themes

### Example Custom Component

```tsx
// components/ui/custom/metric-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              "text-xs font-medium mt-2",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

## Component Documentation

All custom components should include:

1. **Props documentation**: Clear documentation of all props
2. **Usage examples**: Examples of common use cases
3. **Accessibility notes**: Any specific accessibility considerations

Example:

```tsx
/**
 * MetricCard - Displays a key metric with optional trend indicator
 *
 * @component
 * @example
 * ```tsx
 * <MetricCard
 *   title="Total Revenue"
 *   value="$12,345"
 *   description="Last 30 days"
 *   trend={{ value: 12.5, isPositive: true }}
 * />
 * ```
 *
 * @accessibility
 * - Uses semantic HTML elements
 * - Color contrast meets WCAG AA standards
 * - Trend indicators include text, not just color
 */
```

## Page Layout Components

We use a consistent set of layout components:

1. **PageContainer**: Wrapper for all pages with consistent padding
2. **PageHeader**: Consistent page headers with title, description, and actions
3. **PageContent**: Main content area with appropriate spacing
4. **SectionContainer**: Wrapper for page sections

Example usage:

```tsx
export default function ProjectsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage your design projects"
        actions={<Button>New Project</Button>}
      />
      <PageContent>
        <SectionContainer>
          <ProjectsList />
        </SectionContainer>
      </PageContent>
    </PageContainer>
  );
}
```

## Dashboard-Specific Components

We have several dashboard-specific components:

1. **DashboardShell**: Main dashboard layout with sidebar
2. **DashboardHeader**: Dashboard header with user menu and actions
3. **DashboardNav**: Navigation component for the dashboard
4. **DashboardSidebar**: Collapsible sidebar for dashboard navigation

## Form Components

We use Shadcn's form components with React Hook Form:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```