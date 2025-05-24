# Technical Architecture

## Overview

Sylo is built on the Horizon UI boilerplate, providing a solid foundation of Next.js, Supabase, and OpenAI integration. We're extending this base to create a specialized design studio management platform.

## Current Implementation Status

**✅ FOUNDATION COMPLETE (Phase 0):**
- Next.js 15 with React 19 app router
- Supabase authentication and database (connected & working)
- OpenAI API integration for chat (configured & functional)
- Stripe subscription management
- Complete Shadcn UI component system (46 components installed)
- Basic dashboard layout with sidebar navigation
- User management with credits/trial system
- Environment variables properly configured
- Database schema applied and working
- Git repository set up and code pushed
- Development server running locally
- Ready for Vercel deployment

**🎯 NEXT: Phase 1 - Design-Focused AI:**
- Design-specific AI prompts and tools
- Pinterest and SketchUp MCP integrations
- UI/UX improvements for design focus

**📋 FUTURE PHASES:**
- Project management database schema extensions
- Material library system
- Client portal
- Mobile companion app
- Advanced integrations (Google Workspace, Xero)

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Components**: Shadcn UI (built on Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Context API + SWR for data fetching
- **Authentication**: Supabase Auth

### Backend
- **API Routes**: Next.js API routes (Edge runtime where possible)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with JWT
- **Storage**: Supabase Storage for files
- **Realtime**: Supabase Realtime for live updates

### AI & Machine Learning
- **LLM Integration**: OpenAI API (GPT-4o)
- **Vector Database**: Supabase pgvector for semantic search
- **Image Processing**: OpenAI DALL-E and Vision API
- **Speech Recognition**: Web Speech API + OpenAI Whisper API

### Integrations
- **Google Workspace**: Google API Client Library
- **Xero**: Xero API
- **CAD Processing**: Custom parsers for DXF/DWG formats

## System Components

### 1. Core Application
- **Authentication Module**: Handles user login, registration, and session management
- **Dashboard Framework**: Layout, navigation, and common UI elements
- **User Management**: Profiles, permissions, and team management

### 2. AI Assistant System
- **Chat Interface**: User interaction with the AI
- **Tool Integration Layer**: Connects AI to various system capabilities
- **File Processor**: Handles document parsing and image analysis
- **Voice Interface**: Speech-to-text and text-to-speech processing

### 3. Project Management System
- **Project Data Store**: Database models for projects, tasks, and timelines
- **Task Manager**: CRUD operations for task management
- **Timeline Visualizer**: Scheduling and timeline components
- **Notification Engine**: Alerts for deadlines and updates

### 4. Material Library System
- **Material Database**: Storage for material specifications and properties
- **Search Engine**: Advanced filtering and semantic search
- **Supplier Integration**: Connection to supplier data
- **Sample Management**: Tracking of material samples

### 5. Client Portal
- **Client Authentication**: Separate auth flow for clients
- **Project Viewer**: Limited access dashboard for clients
- **Approval Workflow**: System for reviewing and approving designs
- **Communication Channel**: Messaging between clients and team

### 6. Mobile Companion
- **Native App Shell**: React Native wrapper
- **Offline Storage**: Local data persistence
- **Sync Engine**: Reconciliation with cloud data
- **Device Integration**: Camera, microphone, and sensors access

## Data Flow Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Client UI  │◄────┤  Next.js    │◄────┤  Supabase   │
│  (Browser/  │     │  Server     │     │  (Database/ │
│   Mobile)   │────►│  (API/SSR)  │────►│   Auth)     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   ▲
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  External   │     │  AI Service │     │  File       │
│  APIs       │◄───►│  (OpenAI)   │◄───►│  Storage    │
│  (Google/   │     │             │     │             │
│   Xero)     │     └─────────────┘     └─────────────┘
└─────────────┘
```

## Database Schema

### Current Schema (Baseline)
The current database includes basic SaaS functionality:

```sql
-- Users table with billing info
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  credits BIGINT DEFAULT 0,
  trial_credits BIGINT DEFAULT 3,
  billing_address JSONB,
  payment_method JSONB
);

-- Stripe integration tables
CREATE TABLE customers (
  id UUID REFERENCES auth.users PRIMARY KEY,
  stripe_customer_id TEXT
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  active BOOLEAN,
  name TEXT,
  description TEXT,
  image TEXT,
  metadata JSONB
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  status subscription_status,
  price_id TEXT REFERENCES prices,
  -- ... other Stripe fields
);
```

### Planned Schema Extensions
We'll extend this foundation with design-specific entities:
- Clients (design clients, not Stripe customers)
- Projects
- Tasks
- Materials
- Suppliers
- Assets
- Site Photos
- Measurements

## Security Architecture

- **Authentication**: JWT-based auth with Supabase
- **Authorization**: Row-level security in PostgreSQL
- **API Security**: Rate limiting and input validation
- **Data Encryption**: Encryption at rest and in transit
- **File Security**: Signed URLs for temporary access

## Deployment Architecture

- **Production Environment**: Vercel for frontend, Supabase for backend
- **Development Environment**: Local Next.js server with Supabase local development
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Vercel Analytics and custom logging

## API Design Standards

### RESTful Resource-Oriented Design
- Use nouns, not verbs, in endpoint paths
- Use HTTP methods appropriately (GET, POST, PUT, PATCH, DELETE)
- Use plural nouns for collection endpoints (e.g., `/api/projects`)
- Use singular nouns with identifiers for specific resources (e.g., `/api/projects/:id`)

### Consistent URL Patterns
- Base path: `/api/v1` (version included for future compatibility)
- Resource collections: `/api/v1/resources`
- Specific resource: `/api/v1/resources/:id`
- Sub-resources: `/api/v1/resources/:id/sub-resources`

### Query Parameters
- Filtering: `?filter[field]=value`
- Sorting: `?sort=field` or `?sort=-field` (descending)
- Pagination: `?page=1&pageSize=20`
- Field selection: `?fields=id,name,created_at`
- Search: `?search=term`

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created
- `204 No Content`: Successful request with no response body
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### API Response Format
All API responses follow a consistent format:

```json
{
  "data": {
    // Response data here
  },
  "meta": {
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 10,
      "pageCount": 10
    }
  },
  "error": null
}
```

For errors:
```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```
