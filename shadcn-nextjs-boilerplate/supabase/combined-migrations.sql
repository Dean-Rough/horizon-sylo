-- =====================================================
-- SYLO PROJECT MIGRATIONS - PHASE 2 & 3
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/jnkfafylcsfnxcueecyx/sql
-- =====================================================

-- Phase 2 Database Migration for Sylo Project Management
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jnkfafylcsfnxcueecyx/sql

-- =====================================================
-- 1. CREATE CLIENTS TABLE
-- =====================================================

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

-- =====================================================
-- 2. CREATE PROJECTS TABLE
-- =====================================================

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

-- =====================================================
-- 3. CREATE TASKS TABLE
-- =====================================================

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

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_clients_company_name ON clients(company_name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_target_completion_date ON projects(target_completion_date);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_board_column ON tasks(board_column);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES
-- =====================================================

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

-- =====================================================
-- 7. CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status != 'completed' THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_task_completed_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION set_completed_at();

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================

-- Verify tables were created
SELECT 'clients' as table_name, count(*) as row_count FROM clients
UNION ALL
SELECT 'projects' as table_name, count(*) as row_count FROM projects  
UNION ALL
SELECT 'tasks' as table_name, count(*) as row_count FROM tasks;


-- =====================================================
-- END OF PHASE 2 - BEGINNING OF PHASE 3
-- =====================================================

-- Phase 3 Database Migration for Sylo Material Library & Assets
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jnkfafylcsfnxcueecyx/sql

-- =====================================================
-- 1. CREATE SUPPLIERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url TEXT,
  
  -- Contact Information
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  
  -- Address
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'US',
  
  -- Business Details
  supplier_type VARCHAR(50), -- 'manufacturer', 'distributor', 'retailer', 'trade_only'
  trade_only BOOLEAN DEFAULT false,
  minimum_order_amount DECIMAL(10,2),
  payment_terms VARCHAR(100),
  shipping_info TEXT,
  
  -- Account Information
  account_number VARCHAR(100),
  discount_percentage DECIMAL(5,2),
  rep_name VARCHAR(255),
  rep_email VARCHAR(255),
  rep_phone VARCHAR(50),
  
  -- Status
  active BOOLEAN DEFAULT true,
  preferred BOOLEAN DEFAULT false,
  
  -- Notes
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

-- =====================================================
-- 2. CREATE MATERIALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  brand VARCHAR(100),
  collection VARCHAR(100),
  
  -- Material Properties
  material_type VARCHAR(50) NOT NULL, -- 'fabric', 'paint', 'wallpaper', 'flooring', 'furniture', 'lighting', 'hardware', 'tile', 'stone', 'wood'
  category VARCHAR(100), -- 'upholstery', 'drapery', 'accent_wall', 'area_rug', etc.
  subcategory VARCHAR(100),
  
  -- Physical Properties
  color_primary VARCHAR(50),
  color_secondary VARCHAR(50),
  pattern VARCHAR(50), -- 'solid', 'stripe', 'floral', 'geometric', 'abstract'
  texture VARCHAR(50), -- 'smooth', 'rough', 'soft', 'hard', 'glossy', 'matte'
  finish VARCHAR(50), -- 'matte', 'satin', 'semi-gloss', 'gloss', 'natural', 'stained'
  
  -- Dimensions & Specifications
  width_inches DECIMAL(8,2),
  height_inches DECIMAL(8,2),
  depth_inches DECIMAL(8,2),
  weight_lbs DECIMAL(8,2),
  coverage_sqft DECIMAL(8,2), -- For paints, wallpapers
  
  -- Pricing
  price_per_unit DECIMAL(10,2),
  price_per_sqft DECIMAL(10,2),
  price_per_yard DECIMAL(10,2),
  unit_type VARCHAR(20), -- 'each', 'sqft', 'yard', 'roll', 'gallon'
  minimum_order INTEGER,
  
  -- Availability
  in_stock BOOLEAN DEFAULT true,
  lead_time_days INTEGER,
  discontinued BOOLEAN DEFAULT false,
  
  -- Supplier Information
  supplier_id UUID REFERENCES suppliers(id),
  supplier_sku VARCHAR(100),
  
  -- Care & Maintenance
  care_instructions TEXT,
  durability_rating INTEGER CHECK (durability_rating >= 1 AND durability_rating <= 5),
  suitable_for TEXT[] DEFAULT '{}', -- ['residential', 'commercial', 'high_traffic', 'outdoor']
  
  -- Sustainability
  eco_friendly BOOLEAN DEFAULT false,
  certifications TEXT[] DEFAULT '{}', -- ['GREENGUARD', 'OEKO-TEX', 'FSC', 'LEED']
  
  -- Images and Files
  primary_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  swatch_image_url TEXT,
  specification_sheet_url TEXT,
  
  -- Tags and Search
  tags TEXT[] DEFAULT '{}',
  search_keywords TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 3. CREATE MATERIAL COLLECTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS material_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Collection Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Collection Type
  collection_type VARCHAR(50) DEFAULT 'custom' CHECK (collection_type IN ('custom', 'mood_board', 'project_palette', 'favorites')),
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Sharing
  is_public BOOLEAN DEFAULT false,
  shared_with UUID[] DEFAULT '{}', -- Array of user IDs
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 4. CREATE COLLECTION MATERIALS JUNCTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS collection_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  collection_id UUID REFERENCES material_collections(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  
  -- Position and Notes
  position INTEGER DEFAULT 0,
  notes TEXT,
  quantity DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(collection_id, material_id)
);

-- =====================================================
-- 5. CREATE PROJECT ASSETS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS project_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- File Information
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  
  -- Asset Details
  asset_type VARCHAR(50) NOT NULL, -- 'image', 'document', 'video', 'audio', '3d_model', 'cad_file'
  asset_category VARCHAR(100), -- 'inspiration', 'specification', 'presentation', 'contract', 'invoice', 'photo'
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  title VARCHAR(255),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Version Control
  version INTEGER DEFAULT 1,
  is_current_version BOOLEAN DEFAULT true,
  parent_asset_id UUID REFERENCES project_assets(id),
  
  -- Approval Workflow
  approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  
  -- Usage Tracking
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 6. CREATE MATERIAL SAMPLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS material_samples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Sample Information
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  sample_type VARCHAR(50) DEFAULT 'physical' CHECK (sample_type IN ('physical', 'digital', 'memo')),
  
  -- Physical Sample Details
  size_description VARCHAR(100), -- '2x2 inch', '4x4 inch', 'memo sample'
  quantity_available INTEGER DEFAULT 1,
  location VARCHAR(255), -- Where the sample is stored
  
  -- Request Information
  requested_by UUID REFERENCES auth.users(id),
  requested_for_project UUID REFERENCES projects(id),
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Status
  status VARCHAR(50) DEFAULT 'requested' CHECK (status IN ('requested', 'ordered', 'received', 'in_use', 'returned')),
  tracking_number VARCHAR(100),
  
  -- Dates
  ordered_date TIMESTAMP WITH TIME ZONE,
  received_date TIMESTAMP WITH TIME ZONE,
  return_by_date TIMESTAMP WITH TIME ZONE,
  returned_date TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Materials indexes
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(material_type);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_brand ON materials(brand);
CREATE INDEX IF NOT EXISTS idx_materials_supplier ON materials(supplier_id);
CREATE INDEX IF NOT EXISTS idx_materials_color ON materials(color_primary);
CREATE INDEX IF NOT EXISTS idx_materials_price ON materials(price_per_unit);
CREATE INDEX IF NOT EXISTS idx_materials_tags ON materials USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_materials_search ON materials USING GIN(search_keywords);
CREATE INDEX IF NOT EXISTS idx_materials_created_by ON materials(created_by);

-- Suppliers indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(supplier_type);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(active);
CREATE INDEX IF NOT EXISTS idx_suppliers_preferred ON suppliers(preferred);

-- Project Assets indexes
CREATE INDEX IF NOT EXISTS idx_project_assets_project ON project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_type ON project_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_project_assets_category ON project_assets(asset_category);
CREATE INDEX IF NOT EXISTS idx_project_assets_material ON project_assets(material_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_approval ON project_assets(approval_status);
CREATE INDEX IF NOT EXISTS idx_project_assets_tags ON project_assets USING GIN(tags);

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_collections_project ON material_collections(project_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_by ON material_collections(created_by);
CREATE INDEX IF NOT EXISTS idx_collections_type ON material_collections(collection_type);

-- Collection Materials indexes
CREATE INDEX IF NOT EXISTS idx_collection_materials_collection ON collection_materials(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_materials_material ON collection_materials(material_id);

-- Samples indexes
CREATE INDEX IF NOT EXISTS idx_samples_material ON material_samples(material_id);
CREATE INDEX IF NOT EXISTS idx_samples_requested_by ON material_samples(requested_by);
CREATE INDEX IF NOT EXISTS idx_samples_project ON material_samples(requested_for_project);
CREATE INDEX IF NOT EXISTS idx_samples_status ON material_samples(status);

-- =====================================================
-- 8. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_samples ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. CREATE RLS POLICIES
-- =====================================================

-- Suppliers RLS Policies
DROP POLICY IF EXISTS "Users can view suppliers" ON suppliers;
CREATE POLICY "Users can view suppliers" ON suppliers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create suppliers" ON suppliers;
CREATE POLICY "Users can create suppliers" ON suppliers
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their suppliers" ON suppliers;
CREATE POLICY "Users can update their suppliers" ON suppliers
  FOR UPDATE USING (created_by = auth.uid());

-- Materials RLS Policies
DROP POLICY IF EXISTS "Users can view materials" ON materials;
CREATE POLICY "Users can view materials" ON materials
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create materials" ON materials;
CREATE POLICY "Users can create materials" ON materials
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their materials" ON materials;
CREATE POLICY "Users can update their materials" ON materials
  FOR UPDATE USING (created_by = auth.uid());

-- Material Collections RLS Policies
DROP POLICY IF EXISTS "Users can view their collections" ON material_collections;
CREATE POLICY "Users can view their collections" ON material_collections
  FOR SELECT USING (
    created_by = auth.uid() OR 
    is_public = true OR 
    auth.uid() = ANY(shared_with)
  );

DROP POLICY IF EXISTS "Users can create collections" ON material_collections;
CREATE POLICY "Users can create collections" ON material_collections
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their collections" ON material_collections;
CREATE POLICY "Users can update their collections" ON material_collections
  FOR UPDATE USING (created_by = auth.uid());

-- Collection Materials RLS Policies
DROP POLICY IF EXISTS "Users can view collection materials" ON collection_materials;
CREATE POLICY "Users can view collection materials" ON collection_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM material_collections 
      WHERE material_collections.id = collection_materials.collection_id 
      AND (
        material_collections.created_by = auth.uid() OR 
        material_collections.is_public = true OR 
        auth.uid() = ANY(material_collections.shared_with)
      )
    )
  );

-- Project Assets RLS Policies
DROP POLICY IF EXISTS "Users can view project assets" ON project_assets;
CREATE POLICY "Users can view project assets" ON project_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_assets.project_id 
      AND (
        projects.created_by = auth.uid() OR 
        projects.assigned_to = auth.uid() OR 
        auth.uid() = ANY(projects.team_members)
      )
    )
  );

-- =====================================================
-- 10. CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at 
  BEFORE UPDATE ON suppliers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at 
  BEFORE UPDATE ON materials 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_collections_updated_at 
  BEFORE UPDATE ON material_collections 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_assets_updated_at 
  BEFORE UPDATE ON project_assets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_samples_updated_at 
  BEFORE UPDATE ON material_samples 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================

-- Verify tables were created
SELECT 'suppliers' as table_name, count(*) as row_count FROM suppliers
UNION ALL
SELECT 'materials' as table_name, count(*) as row_count FROM materials
UNION ALL
SELECT 'material_collections' as table_name, count(*) as row_count FROM material_collections
UNION ALL
SELECT 'collection_materials' as table_name, count(*) as row_count FROM collection_materials
UNION ALL
SELECT 'project_assets' as table_name, count(*) as row_count FROM project_assets
UNION ALL
SELECT 'material_samples' as table_name, count(*) as row_count FROM material_samples;


-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Verify all tables exist:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'clients', 'projects', 'tasks',
  'suppliers', 'materials', 'material_collections', 
  'collection_materials', 'project_assets', 'material_samples'
)
ORDER BY table_name;
