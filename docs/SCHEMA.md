# Database Schema

## Core Tables

### Projects
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(20) DEFAULT 'medium',
  client_id UUID REFERENCES clients(id),
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  start_date DATE,
  target_completion_date DATE,
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  team_members UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### Clients
```sql
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  client_type VARCHAR(50) DEFAULT 'individual',
  preferred_contact VARCHAR(20) DEFAULT 'email',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### Tasks
```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id),
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  estimated_hours DECIMAL(5,2),
  board_column VARCHAR(50) DEFAULT 'todo',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);
```

### Files
```sql
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  mime_type VARCHAR(100),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  version INTEGER DEFAULT 1,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### Comments
```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

## Security Policies

### Projects
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_access" ON projects
  FOR ALL USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    auth.uid() = ANY(team_members)
  );
```

### Tasks
```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_access" ON tasks
  FOR ALL USING (
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

## Indexes

### Performance Indexes
```sql
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_comments_project ON comments(project_id);
```

### Search Indexes
```sql
CREATE INDEX idx_projects_name_trgm ON projects USING gin(name gin_trgm_ops);
CREATE INDEX idx_tasks_title_trgm ON tasks USING gin(title gin_trgm_ops);
CREATE INDEX idx_clients_email_trgm ON clients USING gin(email gin_trgm_ops);
```

## Migrations

1. Create migration:
```bash
npm run migration:create
```

2. Apply migration:
```bash
npm run migration:up
```

3. Rollback:
```bash
npm run migration:down
