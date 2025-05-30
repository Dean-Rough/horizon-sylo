# Product Requirements Document

## Project Overview

Sylo is a specialized project management platform for interior designers and architects, built on a foundation of AI-powered assistance. Starting from a Horizon UI boilerplate with OpenAI integration, we're evolving it into a comprehensive design studio management tool.

## Current State (Baseline)

**What we have now:**
- Horizon UI boilerplate with AI chat functionality
- Next.js 15 + React 19 + Supabase + OpenAI integration
- Basic user authentication and subscription management
- Shadcn UI component library
- Stripe payment integration

**What we're building toward:**
A comprehensive design studio dashboard with project management, material libraries, client collaboration, and AI-powered workflow automation.

## Problem Statement

Design professionals struggle with generic project management tools that don't address their specific needs:
- No integrated material/finish management
- Poor visualization of design concepts
- Inefficient client approval workflows
- Disconnected communication channels
- Generic AI tools that don't understand design workflows

## Target Users

### Primary Users
- **Interior Designers**: Professionals who need to manage projects, specify materials, and communicate with clients
- **Design Project Managers**: Team leads who oversee multiple projects and need to track progress
- **Design Firm Administrators**: Staff who manage suppliers, invoicing, and business operations

### Secondary Users
- **Clients**: External stakeholders who need to view progress and approve designs
- **Vendors and Contractors**: Limited access for collaboration

## Core Features

### 1. AI Assistant with Agentic Capabilities
- **Vision Processing**: Analyze uploaded images, CAD drawings, and site photos
- **File Management**: Organize, tag, and retrieve project files
- **CRUD Operations**: Create, read, update, and delete data across the platform
- **Voice Interface**: Hands-free interaction with the assistant
- **Integration Control**: Manage connected services (Google, Xero, etc.)

### 2. Project Management
- **Asana-style Task Management**: Create, assign, and track tasks
- **Client > Projects > Tasks Hierarchy**: Organized data structure
- **Timeline Views**: Visualize project schedules and deadlines
- **Team Collaboration**: Assign team members to projects and tasks
- **Status Tracking**: Monitor project progress
- **Kanban boards with visual previews**
- **Resource allocation**

### 3. Material Library
- **Searchable Database**: Find materials by properties, appearance, or sustainability
- **Material Properties**: Technical specifications for each material
- **Swatches and Samples**: Visual references and sample ordering
- **Supplier Links**: Connect materials to suppliers
- **Sustainability Metrics**: Environmental impact data
- **Product catalogs with specifications**

### 4. Client Portal
- **Project Progress Viewing**: Clients can see status updates
- **Design Approval Workflow**: Submit and receive feedback on designs
- **Asset Management**: Access to approved brand assets and design files
- **Communication Channel**: Direct messaging with design team
- **Controlled access and permissions**

### 5. Brand Asset Management
- **Asset Organization**: Store and categorize brand assets by project
- **Version Control**: Track changes to design files
- **Approval Workflows**: Get client sign-off on assets
- **Usage Guidelines**: Store brand standards documentation
- **File organization for design assets**

### 6. Mobile Companion App
- **Site Measurements**: Record dimensions on location
- **Photo Documentation**: Capture and organize site photos
- **Voice Notes**: Record observations via voice
- **Offline Access**: Work without internet connection

### 7. Visualization
- **2D/3D model viewing**
- **Material and finish visualization**
- **Measurement and annotation tools**
- **AR previews (future)**

## User Stories

### Interior Designer
- As a designer, I want to create visual project boards so I can track progress visually
- As a designer, I want to organize materials by project so I can quickly reference specifications
- As a designer, I want to share design concepts with clients so I can get timely approvals

### Studio Manager
- As a manager, I want to see resource allocation across projects so I can balance workloads
- As a manager, I want to track project timelines so I can manage client expectations
- As a manager, I want to monitor client communication so I can ensure quality service

### Client
- As a client, I want to view design progress so I can stay informed
- As a client, I want to provide feedback on designs so I can ensure my preferences are incorporated
- As a client, I want to approve design elements so I can participate in the design process

## Integrations

- **Google Workspace**: Calendar, Drive, Docs, Sheets, Gmail, Meet
- **Xero**: Accounting and invoicing
- **OpenAI**: GPT models and DALL-E for image generation
- **CAD Software**: Import and analyze technical drawings

## User Experience Requirements

- **Intuitive Interface**: Minimal learning curve for design professionals
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Support for both visual preferences
- **Accessibility**: WCAG 2.1 AA compliance

## Technical Requirements

- **Real-time Updates**: Changes sync across devices immediately
- **Secure Authentication**: Role-based access control
- **Data Encryption**: Protect sensitive client information
- **API-first Architecture**: Enable future integrations
- **Scalable Infrastructure**: Support growing teams and projects

## Success Metrics

- **Time Savings**: Reduce administrative work by 40%
- **Project Completion Rate**: Improve on-time delivery by 25%
- **Client Satisfaction**: Achieve 90%+ satisfaction ratings
- **Team Adoption**: 80%+ daily active usage among team members
- **User adoption rate among design professionals**
- **Reduction in client approval cycle time**
- **Increase in project completion efficiency**
