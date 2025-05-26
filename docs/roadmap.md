# Product Roadmap

## Overview

This roadmap outlines our evolution from the current Horizon UI boilerplate to a specialized design studio management platform. We're building incrementally on the solid foundation we already have.

## Phase 0: Foundation Setup ✅ COMPLETE

**✅ Environment & Infrastructure:**
- [x] Next.js 15 + React 19 + Supabase setup
- [x] Environment variables configured (.env.local)
- [x] Supabase project created and connected
- [x] Database schema applied (users, subscriptions, products)
- [x] OpenAI API integration with chat interface
- [x] All Shadcn UI components installed (46 components)
- [x] Git repository setup and code pushed to GitHub
- [x] Development server running locally
- [x] Style guide and documentation complete

**✅ Core Features Working:**
- [x] Supabase authentication system
- [x] Stripe subscription management
- [x] Basic dashboard layout with sidebar navigation
- [x] User management with credits/trial system
- [x] AI chat functionality
- [x] Deployment-ready configuration

**🚀 Ready for Vercel deployment!**

## Phase 1: Design-Focused AI (Month 1) ✅ COMPLETE

### Enhance AI for Design Workflows ✅ COMPLETE
- [x] Customize AI prompts for interior design tasks
- [ ] Add image upload and analysis capabilities (Phase 2)
- [x] Implement design-specific chat templates
- [ ] Add voice interface for hands-free operation (Phase 2)
- [x] Create design inspiration and mood board generation

### MCP Server Integrations - Core Design Tools ✅ COMPLETE
- [x] **Pinterest MCP** - Mood board creation and design inspiration search
- [x] **SketchUp MCP** - 3D modeling and space planning capabilities

### UI/UX Improvements ✅ COMPLETE
- [x] Apply Sylo brand system throughout interface
- [x] Update sidebar, navbar, and main dashboard
- [x] Rebrand authentication pages
- [x] Add design-specific icons and messaging
- [x] Implement massive background typography effects



## Phase 2: Project Management Core (Months 2-3)

### Database Schema Extension
- [ ] Design and implement projects table
- [ ] Add clients table (separate from Stripe customers)
- [ ] Create tasks and project hierarchy
- [ ] Set up proper relationships and RLS policies

### Project Management Features
- [ ] Create project CRUD operations
- [ ] Implement client management interface
- [ ] Build basic task management (Kanban-style)
- [ ] Add project timeline views
- [ ] Implement team member assignment



## Phase 3: Material Library & Assets (Months 4-5)

### Material Library System
- [ ] Build material database schema
- [ ] Create material search and filtering
- [ ] Implement material property management
- [ ] Add supplier connections
- [ ] Build swatch and sample management

### Brand Asset Management
- [ ] Create asset organization system
- [ ] Implement version control for files
- [ ] Build approval workflows
- [ ] Add asset tagging and search
- [ ] Integrate with project workflows



## Phase 4: Client Experience (Months 6-7)

### Client Portal
- [ ] Build separate client authentication
- [ ] Create project viewing interface
- [ ] Implement design approval workflows
- [ ] Add client communication channels

### Project Collaboration
- [ ] Implement real-time updates
- [ ] Add commenting and feedback tools
- [ ] Create notification system
- [ ] Build activity feeds

## Phase 5: Integrations & Mobile (Months 8-10)

### Google Workspace Integration
- [ ] Implement OAuth authentication
- [ ] Connect to Google Drive for file storage
- [ ] Add Calendar integration for project timelines
- [ ] Implement Gmail integration for communications

### Xero Integration
- [ ] Implement OAuth authentication
- [ ] Connect invoicing to projects
- [ ] Add expense tracking
- [ ] Create financial reporting



### Mobile Companion App
- [ ] Build React Native app shell
- [ ] Implement offline capabilities
- [ ] Add measurement tools
- [ ] Create photo documentation features

## Phase 6: Advanced Features (Months 11-12)

### Advanced AI Capabilities
- [ ] Implement design suggestion capabilities
- [ ] Add automated documentation generation
- [ ] Create AI-powered project planning
- [ ] Build predictive analytics

### 3D Visualization
- [ ] Add 3D model viewer
- [ ] Implement basic AR visualization
- [ ] Create material rendering capabilities
- [ ] Build space planning tools

## Future Considerations

### Enterprise Features
- [ ] Advanced team management
- [ ] White-labeling options
- [ ] Multi-tenant capabilities
- [ ] Advanced analytics and reporting

## MCP Integration Strategy

### Core MCP Servers (Phase 1)
1. **Pinterest MCP** - Essential for design inspiration workflows
   - Search Pinterest for design inspiration
   - Create mood boards and collect visual references
   - Integrate inspiration directly into project workflows

2. **SketchUp MCP** - 3D modeling and space planning capabilities
   - AI-assisted 3D modeling and scene creation
   - Direct manipulation of SketchUp models through natural language
   - Space planning and architectural visualization

### Implementation Approach
- **Focused rollout** - Start with Pinterest and SketchUp only
- **Configuration management** - Simple MCP server configuration in Claude Desktop
- **User documentation** - Clear setup guides for both MCP servers
- **Error handling** - Graceful fallbacks when MCP servers are unavailable

### Technical Considerations
- **Security** - Secure API key management for Pinterest API
- **Performance** - Efficient communication with SketchUp via TCP socket
- **User Experience** - Seamless integration without exposing technical complexity
- **Documentation** - Clear setup instructions following Cursor MCP guidelines
