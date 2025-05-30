import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Migration SQL - Clients table
const createClientsTable = `
-- Create clients table for Phase 2 project management
CREATE TABLE IF NOT EXISTS clients (
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
  lead_source VARCHAR(100),
  referral_source VARCHAR(255),
  
  -- Notes and Tags
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
`;

// Migration SQL - Projects table
const createProjectsTable = `
-- Create projects table for Phase 2 project management
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Client Information
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Project Details
  project_type VARCHAR(100),
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
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  team_members UUID[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
`;

// Migration SQL - Tasks table
const createTasksTable = `
-- Create tasks table for Phase 2 project management
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Task Information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Timeline
  due_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  
  -- Task Details
  task_type VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  
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
`;

// Create indexes and RLS policies
const createIndexesAndPolicies = `
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_clients_company_name ON clients(company_name);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
`;

// Create RLS policies
const createRLSPolicies = `
-- Clients RLS Policies
DROP POLICY IF EXISTS "Users can view their clients" ON clients;
CREATE POLICY "Users can view their clients" ON clients
  FOR SELECT USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can create clients" ON clients;
CREATE POLICY "Users can create clients" ON clients
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their clients" ON clients;
CREATE POLICY "Users can update their clients" ON clients
  FOR UPDATE USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their clients" ON clients;
CREATE POLICY "Users can delete their clients" ON clients
  FOR DELETE USING (created_by = auth.uid());

-- Projects RLS Policies
DROP POLICY IF EXISTS "Users can view their projects" ON projects;
CREATE POLICY "Users can view their projects" ON projects
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    auth.uid() = ANY(team_members)
  );

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their projects" ON projects;
CREATE POLICY "Users can update their projects" ON projects
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    auth.uid() = ANY(team_members)
  );

DROP POLICY IF EXISTS "Users can delete their projects" ON projects;
CREATE POLICY "Users can delete their projects" ON projects
  FOR DELETE USING (created_by = auth.uid());

-- Tasks RLS Policies
DROP POLICY IF EXISTS "Users can view project tasks" ON tasks;
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

DROP POLICY IF EXISTS "Users can create tasks for their projects" ON tasks;
CREATE POLICY "Users can create tasks for their projects" ON tasks
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
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

DROP POLICY IF EXISTS "Users can update project tasks" ON tasks;
CREATE POLICY "Users can update project tasks" ON tasks
  FOR UPDATE USING (
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

DROP POLICY IF EXISTS "Users can delete project tasks" ON tasks;
CREATE POLICY "Users can delete project tasks" ON tasks
  FOR DELETE USING (
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
`;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting database migrations...');

    // Run migrations in order
    const migrations = [
      { name: 'Create Clients Table', sql: createClientsTable },
      { name: 'Create Projects Table', sql: createProjectsTable },
      { name: 'Create Tasks Table', sql: createTasksTable },
      { name: 'Create Indexes and Enable RLS', sql: createIndexesAndPolicies },
      { name: 'Create RLS Policies', sql: createRLSPolicies }
    ];

    const results = [];

    for (const migration of migrations) {
      console.log(`⏳ Running: ${migration.name}`);
      
      try {
        const { error } = await supabase.rpc('exec', { sql: migration.sql });
        
        if (error) {
          console.error(`❌ Error in ${migration.name}:`, error);
          results.push({ name: migration.name, status: 'error', error: error.message });
        } else {
          console.log(`✅ ${migration.name} completed`);
          results.push({ name: migration.name, status: 'success' });
        }
      } catch (err) {
        console.error(`❌ Exception in ${migration.name}:`, err);
        results.push({ name: migration.name, status: 'error', error: err.message });
      }
    }

    console.log('🎉 Migration process completed!');

    return NextResponse.json({
      success: true,
      message: 'Migrations completed',
      results
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
