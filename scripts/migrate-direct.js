const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting Phase 2 database migrations...');
  
  try {
    // 1. Create clients table
    console.log('⏳ Creating clients table...');
    const { error: clientsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          company_name VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          phone VARCHAR(50),
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(50),
          zip_code VARCHAR(20),
          country VARCHAR(50) DEFAULT 'US',
          client_type VARCHAR(50) DEFAULT 'individual' CHECK (client_type IN ('individual', 'business', 'organization')),
          preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
          lead_source VARCHAR(100),
          referral_source VARCHAR(255),
          notes TEXT,
          tags TEXT[] DEFAULT '{}',
          created_by UUID REFERENCES auth.users(id) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          deleted_at TIMESTAMP WITH TIME ZONE
        );
      `
    });
    
    if (clientsError) {
      console.error('❌ Error creating clients table:', clientsError);
    } else {
      console.log('✅ Clients table created successfully');
    }

    // 2. Create projects table
    console.log('⏳ Creating projects table...');
    const { error: projectsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
          priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
          client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
          project_type VARCHAR(100),
          budget_min DECIMAL(12,2),
          budget_max DECIMAL(12,2),
          square_footage INTEGER,
          start_date DATE,
          target_completion_date DATE,
          actual_completion_date DATE,
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(50),
          zip_code VARCHAR(20),
          country VARCHAR(50) DEFAULT 'US',
          created_by UUID REFERENCES auth.users(id) NOT NULL,
          assigned_to UUID REFERENCES auth.users(id),
          team_members UUID[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          deleted_at TIMESTAMP WITH TIME ZONE
        );
      `
    });
    
    if (projectsError) {
      console.error('❌ Error creating projects table:', projectsError);
    } else {
      console.log('✅ Projects table created successfully');
    }

    // 3. Create tasks table
    console.log('⏳ Creating tasks table...');
    const { error: tasksError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
          priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
          project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
          parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
          assigned_to UUID REFERENCES auth.users(id),
          created_by UUID REFERENCES auth.users(id) NOT NULL,
          due_date DATE,
          estimated_hours DECIMAL(5,2),
          actual_hours DECIMAL(5,2),
          task_type VARCHAR(50),
          tags TEXT[] DEFAULT '{}',
          board_column VARCHAR(50) DEFAULT 'todo',
          position INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          deleted_at TIMESTAMP WITH TIME ZONE
        );
      `
    });
    
    if (tasksError) {
      console.error('❌ Error creating tasks table:', tasksError);
    } else {
      console.log('✅ Tasks table created successfully');
    }

    // 4. Create indexes
    console.log('⏳ Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
        CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
        CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
        CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
        CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      `
    });
    
    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
    } else {
      console.log('✅ Indexes created successfully');
    }

    // 5. Enable RLS
    console.log('⏳ Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
    } else {
      console.log('✅ Row Level Security enabled');
    }

    console.log('🎉 All migrations completed successfully!');
    console.log('📊 Database is ready for Phase 2 project management features');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
