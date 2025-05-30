// Database types for Phase 2 project management

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  client_type: 'individual' | 'business' | 'organization';
  preferred_contact_method: 'email' | 'phone' | 'text';
  lead_source?: string;
  referral_source?: string;
  notes?: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_id?: string;
  project_type?: string;
  budget_min?: number;
  budget_max?: number;
  square_footage?: number;
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  created_by: string;
  assigned_to?: string;
  team_members: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Joined data
  client?: Client;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_id: string;
  parent_task_id?: string;
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  task_type?: string;
  tags: string[];
  board_column: string;
  position: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  deleted_at?: string;

  // Joined data
  project?: Project;
  subtasks?: Task[];
}

// Form types for creating/updating
export interface CreateClientData {
  first_name: string;
  last_name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  client_type?: 'individual' | 'business' | 'organization';
  preferred_contact_method?: 'email' | 'phone' | 'text';
  lead_source?: string;
  referral_source?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  client_id?: string;
  project_type?: string;
  budget_min?: number;
  budget_max?: number;
  square_footage?: number;
  start_date?: string;
  target_completion_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  assigned_to?: string;
  team_members?: string[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  project_id: string;
  parent_task_id?: string;
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  task_type?: string;
  tags?: string[];
  board_column?: string;
  position?: number;
}

// API response types
export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

// Filter and sort types
export interface ProjectFilters {
  status?: string[];
  priority?: string[];
  client_id?: string;
  project_type?: string;
  assigned_to?: string;
  search?: string;
}

export interface ClientFilters {
  client_type?: string[];
  lead_source?: string[];
  search?: string;
}

export interface TaskFilters {
  status?: string[];
  priority?: string[];
  project_id?: string;
  assigned_to?: string;
  task_type?: string[];
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Dashboard statistics
export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
  total_revenue: number;
  avg_project_duration: number;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  tasks_by_status: {
    todo: number;
    in_progress: number;
    review: number;
    completed: number;
  };
}

// Phase 3: Material Library & Assets Types

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  supplier_type?: 'manufacturer' | 'distributor' | 'retailer' | 'trade_only';
  trade_only: boolean;
  minimum_order_amount?: number;
  payment_terms?: string;
  shipping_info?: string;
  account_number?: string;
  discount_percentage?: number;
  rep_name?: string;
  rep_email?: string;
  rep_phone?: string;
  active: boolean;
  preferred: boolean;
  notes?: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  brand?: string;
  collection?: string;
  material_type: 'fabric' | 'paint' | 'wallpaper' | 'flooring' | 'furniture' | 'lighting' | 'hardware' | 'tile' | 'stone' | 'wood';
  category?: string;
  subcategory?: string;
  color_primary?: string;
  color_secondary?: string;
  pattern?: 'solid' | 'stripe' | 'floral' | 'geometric' | 'abstract';
  texture?: 'smooth' | 'rough' | 'soft' | 'hard' | 'glossy' | 'matte';
  finish?: 'matte' | 'satin' | 'semi-gloss' | 'gloss' | 'natural' | 'stained';
  width_inches?: number;
  height_inches?: number;
  depth_inches?: number;
  weight_lbs?: number;
  coverage_sqft?: number;
  price_per_unit?: number;
  price_per_sqft?: number;
  price_per_yard?: number;
  unit_type?: 'each' | 'sqft' | 'yard' | 'roll' | 'gallon';
  minimum_order?: number;
  in_stock: boolean;
  lead_time_days?: number;
  discontinued: boolean;
  supplier_id?: string;
  supplier_sku?: string;
  care_instructions?: string;
  durability_rating?: number;
  suitable_for: string[];
  eco_friendly: boolean;
  certifications: string[];
  primary_image_url?: string;
  image_urls: string[];
  swatch_image_url?: string;
  specification_sheet_url?: string;
  tags: string[];
  search_keywords: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Joined data
  supplier?: Supplier;
}

export interface MaterialCollection {
  id: string;
  name: string;
  description?: string;
  collection_type: 'custom' | 'mood_board' | 'project_palette' | 'favorites';
  project_id?: string;
  created_by: string;
  is_public: boolean;
  shared_with: string[];
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Joined data
  project?: Project;
  materials?: Material[];
  material_count?: number;
}

export interface CollectionMaterial {
  id: string;
  collection_id: string;
  material_id: string;
  position: number;
  notes?: string;
  quantity?: number;
  created_at: string;

  // Joined data
  material?: Material;
}

export interface ProjectAsset {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  asset_type: 'image' | 'document' | 'video' | 'audio' | '3d_model' | 'cad_file';
  asset_category?: 'inspiration' | 'specification' | 'presentation' | 'contract' | 'invoice' | 'photo';
  project_id?: string;
  material_id?: string;
  uploaded_by?: string;
  title?: string;
  description?: string;
  tags: string[];
  version: number;
  is_current_version: boolean;
  parent_asset_id?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  view_count: number;
  download_count: number;
  last_accessed_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Joined data
  project?: Project;
  material?: Material;
}

export interface MaterialSample {
  id: string;
  material_id: string;
  sample_type: 'physical' | 'digital' | 'memo';
  size_description?: string;
  quantity_available: number;
  location?: string;
  requested_by?: string;
  requested_for_project?: string;
  request_date: string;
  status: 'requested' | 'ordered' | 'received' | 'in_use' | 'returned';
  tracking_number?: string;
  ordered_date?: string;
  received_date?: string;
  return_by_date?: string;
  returned_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;

  // Joined data
  material?: Material;
  project?: Project;
}
