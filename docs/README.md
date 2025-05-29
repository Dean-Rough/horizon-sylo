# Sylo - AI-Powered Design Management Platform

## Overview

Sylo is a professional project management platform for interior designers and architects, combining AI assistance, material libraries, and client collaboration.

## Documentation

## Core Documentation
- [Architecture](./ARCHITECTURE.md) - System design and technical architecture
- [Schema](./SCHEMA.md) - Database structure and migrations
- [Components](./COMPONENTS.md) - UI component library
- [Deployment](./DEPLOYMENT.md) - Deployment guide and configuration
- [MCP](./MCP.md) - AI integration setup
- [Sylo-core](./sylo-core.md) - AI core orchestration engine
- [Roadmap](./roadmap.md) - Development timeline and milestones

## Quick Start

```bash
# Clone repository
git clone https://github.com/Dean-Rough/horizon-sylo
cd sylo

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

## Environment Setup

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_OPENAI_ASSISTANT_KEY=

# MCP Configuration
PINTEREST_API_KEY=
PINTEREST_API_SECRET=
SKETCHUP_PATH=

# Application Configuration
NEXT_PUBLIC_SITE_URL=
```

See [`SETUP.md`](./SETUP.md) for complete environment configuration and development setup instructions.

## Project Structure

```
sylo/
├── app/          # Next.js app router
├── components/   # React components
│   ├── ui/      # Base components
│   └── features/ # Feature components
├── lib/         # Shared utilities
├── styles/      # Global styles
└── types/       # TypeScript types
```

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19, Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Integrations**: Pinterest, SketchUp
- **Deploy**: Vercel

## Features

### Project Management
- Client/project organization
- Task tracking
- Resource allocation
- Timeline management

### Material Library
- Material database
- Sample tracking
- Supplier integration
- Sustainability metrics

### Client Portal
- Project progress
- Design approvals
- Asset management
- Communication

### AI Assistant
- Design recommendations
- Project automation
- Content generation
- Resource optimization

## Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Build production
npm run build
```

## Contributing

1. Fork repository
2. Create feature branch
3. Follow coding standards
4. Submit pull request

## Support

- Issues: GitHub Issues
- Security: security@sylo.design
- Status: status.sylo.design

## License

Proprietary. All rights reserved.
