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
