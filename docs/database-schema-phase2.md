# Phase 2 Database Schema Design

## Overview

This document outlines the database schema extensions for Phase 2 of Sylo, focusing on project management core functionality.

## New Tables

### 1. Projects Table

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Client Information
  client_id UUID REFERENCES clients(id),
  
  -- Project Details
  project_type VARCHAR(100), -- 'residential', 'commercial', 'renovation', etc.
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  square_footage INTEGER,
  
  -- Timeline
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  
  -- Location
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'US',
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  team_members UUID[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 2. Clients Table

```sql
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  
  -- Address
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'US',
  
  -- Client Details
  client_type VARCHAR(50) DEFAULT 'individual' CHECK (client_type IN ('individual', 'business', 'organization')),
  preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
  
  -- Relationship
  lead_source VARCHAR(100), -- 'referral', 'website', 'social_media', etc.
  referral_source VARCHAR(255),
  
  -- Notes and Tags
  notes TEXT,
  tags TEXT[], -- ['high-value', 'repeat-client', 'commercial', etc.]
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 3. Tasks Table

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Task Information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id), -- For subtasks
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  
  -- Timeline
  due_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  
  -- Task Details
  task_type VARCHAR(50), -- 'design', 'procurement', 'installation', 'client_meeting', etc.
  tags TEXT[],
  
  -- Kanban Position
  board_column VARCHAR(50) DEFAULT 'todo',
  position INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 4. Project Files Table

```sql
CREATE TABLE project_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- File Information
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  
  -- File Details
  file_type VARCHAR(50), -- 'design', 'reference', 'contract', 'invoice', etc.
  description TEXT,
  tags TEXT[],
  
  -- Version Control
  version INTEGER DEFAULT 1,
  is_current_version BOOLEAN DEFAULT true,
  parent_file_id UUID REFERENCES project_files(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 5. Project Comments Table

```sql
CREATE TABLE project_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Comment Content
  content TEXT NOT NULL,
  comment_type VARCHAR(50) DEFAULT 'general' CHECK (comment_type IN ('general', 'feedback', 'approval', 'question')),
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  file_id UUID REFERENCES project_files(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES project_comments(id), -- For replies
  
  -- Author
  author_id UUID REFERENCES auth.users(id),
  author_type VARCHAR(20) DEFAULT 'team' CHECK (author_type IN ('team', 'client')),
  
  -- Status
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

## Row Level Security (RLS) Policies

### Projects RLS
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can see projects they created or are assigned to
CREATE POLICY "Users can view their projects" ON projects
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    auth.uid() = ANY(team_members)
  );

-- Users can create projects
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update projects they have access to
CREATE POLICY "Users can update their projects" ON projects
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    auth.uid() = ANY(team_members)
  );
```

### Clients RLS
```sql
-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Users can see clients they created
CREATE POLICY "Users can view their clients" ON clients
  FOR SELECT USING (created_by = auth.uid());

-- Users can create clients
CREATE POLICY "Users can create clients" ON clients
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update their clients
CREATE POLICY "Users can update their clients" ON clients
  FOR UPDATE USING (created_by = auth.uid());
```

### Tasks RLS
```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can see tasks for projects they have access to
CREATE POLICY "Users can view project tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND (
        projects.created_by = auth.uid() OR 
        projects.assigned_to = auth.uid() OR 
        auth.uid() = ANY(projects.team_members)
      )
    )
  );
```

## Indexes for Performance

```sql
-- Projects indexes
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Tasks indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Clients indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_clients_company_name ON clients(company_name);
```

## Next Steps

1. **Create Migration Files** - Generate Supabase migrations for these tables
2. **Seed Data** - Create sample projects and clients for testing
3. **API Functions** - Build Supabase functions for complex operations
4. **Frontend Components** - Create React components for project management
5. **Testing** - Comprehensive testing of all CRUD operations
