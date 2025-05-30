# UI Components

## Core Components

### Installation
```bash
npx shadcn-ui@latest add [component-name]
```

### Available Components
- Layout: `aspect-ratio`, `container`, `separator`
- Navigation: `navigation-menu`, `menubar`, `tabs`
- Inputs: `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`
- Data Display: `table`, `card`, `avatar`, `badge`
- Feedback: `alert`, `progress`, `skeleton`, `toast`
- Overlay: `dialog`, `drawer`, `popover`, `tooltip`
- Advanced: `calendar`, `command`, `form`, `scroll-area`

## Design Tokens

### Colors
```typescript
// tailwind.config.ts
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
  }
}
```

### Typography
```typescript
fontFamily: {
  sans: ["var(--font-sans)", "system-ui"],
  heading: ["var(--font-heading)", "system-ui"]
},
fontSize: {
  xs: ["0.75rem", "1rem"],
  sm: ["0.875rem", "1.25rem"],
  base: ["1rem", "1.5rem"],
  lg: ["1.125rem", "1.75rem"],
  xl: ["1.25rem", "1.75rem"],
  "2xl": ["1.5rem", "2rem"]
}
```

## Layout Components

### Page Layout
```tsx
<PageContainer>
  <PageHeader title="Projects" actions={<Button>New</Button>} />
  <PageContent>
    <ContentArea>{children}</ContentArea>
  </PageContent>
</PageContainer>
```

### Dashboard Layout
```tsx
<DashboardShell>
  <DashboardHeader />
  <DashboardSidebar />
  <DashboardContent>{children}</DashboardContent>
</DashboardShell>
```

## Form Components

### Basic Form
```tsx
const formSchema = z.object({
  name: z.string().min(2).max(50)
});

export function DataForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
```

## Custom Components

### MetricCard
```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
}

export function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={trend.isPositive ? "text-green-500" : "text-red-500"}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

## Component Guidelines

1. Use composition over custom CSS
2. Maintain WCAG 2.1 AA compliance
3. Support both light and dark themes
4. Ensure responsive behavior
5. Follow Shadcn naming conventions

## Directory Structure
```
components/
├── ui/           # Shadcn base components
├── layout/       # Layout components
├── forms/        # Form components
└── custom/       # Custom components
