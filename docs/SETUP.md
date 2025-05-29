# Development Setup Guide

## Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account
- OpenAI API key
- Pinterest Developer account
- SketchUp 2024 installed

## Initial Setup

1. **Clone Repository**
```bash
git clone https://github.com/Dean-Rough/horizon-sylo
cd sylo
```

2. **Install Dependencies**
```bash
# Install project dependencies
npm install

# Install Shadcn UI components
npx shadcn@latest add --all
```

3. **Environment Setup**
```bash
# Copy environment example
cp .env.example .env.local

# Configure your environment variables:
# - Supabase credentials
# - OpenAI API key
# - Pinterest API credentials
# - SketchUp path
# - Other configuration values
```

## Database Setup

1. **Start Supabase Local Development**
```bash
# Start local Supabase
npm run supabase:start

# Generate types
npm run supabase:generate-types

# Apply migrations
npm run supabase:push
```

2. **Verify Database**
```bash
# Check Supabase status
npm run supabase:status
```

## Development Server

1. **Start Development Server**
```bash
# Start Next.js development server
npm run dev

# Server will be available at http://localhost:3200
```

2. **Run Tests**
```bash
# Run test suite
npm test
```

## MCP Integration Setup

1. **Configure Pinterest MCP**
```bash
# Install Pinterest MCP server
npm i -g @modelcontextprotocol/server-pinterest

# Configure in .env.local:
PINTEREST_API_KEY=your_key
PINTEREST_API_SECRET=your_secret
```

2. **Configure SketchUp MCP**
```bash
# Install SketchUp MCP server
npm i -g @modelcontextprotocol/server-sketchup

# Configure in .env.local:
SKETCHUP_PATH=/Applications/SketchUp 2024/SketchUp.app
```

## Project Structure

```
sylo/
├── app/          # Next.js app router
├── components/   # React components
│   ├── ui/      # Base UI components
│   └── features/ # Feature components
├── lib/         # Shared utilities
├── styles/      # Global styles
└── types/       # TypeScript types
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run supabase:start    # Start local Supabase
npm run supabase:stop     # Stop local Supabase
npm run supabase:status   # Check Supabase status
npm run supabase:reset    # Reset database
npm run supabase:push     # Push migrations
npm run supabase:pull     # Pull schema changes

# Types
npm run supabase:generate-types  # Generate TypeScript types
```

## Code Style

- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript + JavaScript
- GitLens

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
```bash
# Reset Supabase
npm run supabase:reset
npm run supabase:start
```

2. **Type Generation Issues**
```bash
# Regenerate types
npm run supabase:generate-types
```

3. **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Component Documentation](./COMPONENTS.md)
- [Database Schema](./SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [MCP Integration](./MCP.md)
- [Sylo-core Documentation](./sylo-core.md)
