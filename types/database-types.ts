export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type MaterialStatus = 'pending' | 'ordered' | 'received' | 'installed';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  client_id: string;
  budget_min: number | null;
  budget_max: number | null;
  start_date: string | null;
  target_completion_date: string | null;
  created_by: string;
  assigned_to: string | null;
  team_members: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  project_id: string;
  parent_task_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  board_column: string;
  position: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  deleted_at: string | null;
}

export interface Material {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  supplier: string | null;
  unit_cost: number | null;
  unit_type: string | null;
  sku: string | null;
  specifications: Record<string, any> | null;
  sustainability_rating: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProjectMaterial {
  id: string;
  project_id: string;
  material_id: string;
  quantity: number | null;
  unit_price: number | null;
  status: MaterialStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  filename: string;
  file_path: string;
  mime_type: string | null;
  size: number | null;
  project_id: string | null;
  task_id: string | null;
  material_id: string | null;
  uploaded_by: string;
  version: number;
  is_current: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface Comment {
  id: string;
  content: string;
  type: string;
  project_id: string | null;
  task_id: string | null;
  file_id: string | null;
  material_id: string | null;
  author_id: string;
  is_resolved: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  trial_credits: number;
  billing_address: Record<string, any> | null;
  payment_method: Record<string, any> | null;
}

// Helper type for database tables
export interface Database {
  projects: Project;
  tasks: Task;
  materials: Material;
  project_materials: ProjectMaterial;
  files: File;
  comments: Comment;
  users: User;
}

// Helper type for database enums
export type Tables = keyof Database;
export type TableRow<T extends Tables> = Database[T];
