# Phase 3 Database Schema Design - Material Library & Assets

## Overview

This document outlines the database schema extensions for Phase 3 of Sylo, focusing on material library and asset management functionality.

## New Tables

### 1. Materials Table

```sql
CREATE TABLE materials (
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
  suitable_for TEXT[], -- ['residential', 'commercial', 'high_traffic', 'outdoor']
  
  -- Sustainability
  eco_friendly BOOLEAN DEFAULT false,
  certifications TEXT[], -- ['GREENGUARD', 'OEKO-TEX', 'FSC', 'LEED']
  
  -- Images and Files
  primary_image_url TEXT,
  image_urls TEXT[],
  swatch_image_url TEXT,
  specification_sheet_url TEXT,
  
  -- Tags and Search
  tags TEXT[],
  search_keywords TEXT[],
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 2. Suppliers Table

```sql
CREATE TABLE suppliers (
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
  tags TEXT[],
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 3. Project Assets Table

```sql
CREATE TABLE project_assets (
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
  tags TEXT[],
  
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
```

### 4. Material Collections Table

```sql
CREATE TABLE material_collections (
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
  shared_with UUID[], -- Array of user IDs
  
  -- Metadata
  tags TEXT[],
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 5. Collection Materials Junction Table

```sql
CREATE TABLE collection_materials (
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
```

### 6. Material Samples Table

```sql
CREATE TABLE material_samples (
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
```

## Indexes for Performance

```sql
-- Materials indexes
CREATE INDEX idx_materials_type ON materials(material_type);
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_brand ON materials(brand);
CREATE INDEX idx_materials_supplier ON materials(supplier_id);
CREATE INDEX idx_materials_color ON materials(color_primary);
CREATE INDEX idx_materials_price ON materials(price_per_unit);
CREATE INDEX idx_materials_tags ON materials USING GIN(tags);
CREATE INDEX idx_materials_search ON materials USING GIN(search_keywords);
CREATE INDEX idx_materials_created_by ON materials(created_by);

-- Suppliers indexes
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_type ON suppliers(supplier_type);
CREATE INDEX idx_suppliers_active ON suppliers(active);
CREATE INDEX idx_suppliers_preferred ON suppliers(preferred);

-- Project Assets indexes
CREATE INDEX idx_project_assets_project ON project_assets(project_id);
CREATE INDEX idx_project_assets_type ON project_assets(asset_type);
CREATE INDEX idx_project_assets_category ON project_assets(asset_category);
CREATE INDEX idx_project_assets_material ON project_assets(material_id);
CREATE INDEX idx_project_assets_approval ON project_assets(approval_status);
CREATE INDEX idx_project_assets_tags ON project_assets USING GIN(tags);

-- Collections indexes
CREATE INDEX idx_collections_project ON material_collections(project_id);
CREATE INDEX idx_collections_created_by ON material_collections(created_by);
CREATE INDEX idx_collections_type ON material_collections(collection_type);

-- Collection Materials indexes
CREATE INDEX idx_collection_materials_collection ON collection_materials(collection_id);
CREATE INDEX idx_collection_materials_material ON collection_materials(material_id);

-- Samples indexes
CREATE INDEX idx_samples_material ON material_samples(material_id);
CREATE INDEX idx_samples_requested_by ON material_samples(requested_by);
CREATE INDEX idx_samples_project ON material_samples(requested_for_project);
CREATE INDEX idx_samples_status ON material_samples(status);
```

## Row Level Security (RLS) Policies

### Materials RLS
```sql
-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Users can view all materials (materials are generally shared resources)
CREATE POLICY "Users can view materials" ON materials
  FOR SELECT USING (true);

-- Users can create materials
CREATE POLICY "Users can create materials" ON materials
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update materials they created
CREATE POLICY "Users can update their materials" ON materials
  FOR UPDATE USING (created_by = auth.uid());
```

### Suppliers RLS
```sql
-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Users can view all suppliers
CREATE POLICY "Users can view suppliers" ON suppliers
  FOR SELECT USING (true);

-- Users can create suppliers
CREATE POLICY "Users can create suppliers" ON suppliers
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update suppliers they created
CREATE POLICY "Users can update their suppliers" ON suppliers
  FOR UPDATE USING (created_by = auth.uid());
```

### Project Assets RLS
```sql
-- Enable RLS
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;

-- Users can view assets for projects they have access to
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
```

## Next Steps

1. **Create Migration Files** - Generate Supabase migrations for these tables
2. **Seed Data** - Create sample materials and suppliers for testing
3. **TypeScript Types** - Define interfaces for all new entities
4. **API Functions** - Build Supabase functions for complex operations
5. **Frontend Components** - Create React components for material management
