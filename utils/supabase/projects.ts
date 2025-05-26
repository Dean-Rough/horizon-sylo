import { SupabaseClient } from '@supabase/supabase-js';
import {
  Project,
  CreateProjectData,
  ProjectFilters,
  SortOptions,
  ProjectStats
} from '@/types/database';

export async function getProjects(
  supabase: SupabaseClient,
  filters?: ProjectFilters,
  sort?: SortOptions,
  page = 1,
  limit = 10
) {
  let query = supabase
    .from('projects')
    .select(`
      *,
      client:clients(*)
    `, { count: 'exact' })
    .is('deleted_at', null);

  // Apply filters
  if (filters?.status?.length) {
    query = query.in('status', filters.status);
  }

  if (filters?.priority?.length) {
    query = query.in('priority', filters.priority);
  }

  if (filters?.client_id) {
    query = query.eq('client_id', filters.client_id);
  }

  if (filters?.project_type) {
    query = query.eq('project_type', filters.project_type);
  }

  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // Apply sorting
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    projects: data as Project[],
    total: count || 0,
    page,
    limit
  };
}

export async function getProject(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:clients(*),
      tasks:tasks(*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function createProject(
  supabase: SupabaseClient,
  projectData: CreateProjectData
) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select(`
      *,
      client:clients(*)
    `)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<CreateProjectData>
) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      client:clients(*)
    `)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('projects')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function getProjectStats(supabase: SupabaseClient): Promise<ProjectStats> {
  // Get basic project counts
  const { data: projectCounts, error: countsError } = await supabase
    .from('projects')
    .select('status, budget_min, budget_max, start_date, actual_completion_date')
    .is('deleted_at', null);

  if (countsError) throw countsError;

  const total_projects = projectCounts.length;
  const active_projects = projectCounts.filter(p =>
    ['planning', 'in_progress', 'review'].includes(p.status)
  ).length;
  const completed_projects = projectCounts.filter(p => p.status === 'completed').length;

  // Calculate overdue projects (past target completion date and not completed)
  const today = new Date().toISOString().split('T')[0];
  const overdue_projects = projectCounts.filter(p =>
    p.status !== 'completed' &&
    p.start_date &&
    p.start_date < today
  ).length;

  // Calculate total revenue from completed projects
  const total_revenue = projectCounts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.budget_max || p.budget_min || 0), 0);

  // Calculate average project duration
  const completedWithDates = projectCounts.filter(p =>
    p.status === 'completed' && p.start_date && p.actual_completion_date
  );

  const avg_project_duration = completedWithDates.length > 0
    ? completedWithDates.reduce((sum, p) => {
        const start = new Date(p.start_date!);
        const end = new Date(p.actual_completion_date!);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / completedWithDates.length
    : 0;

  return {
    total_projects,
    active_projects,
    completed_projects,
    overdue_projects,
    total_revenue,
    avg_project_duration: Math.round(avg_project_duration)
  };
}

export async function getRecentProjects(supabase: SupabaseClient, limit = 5) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:clients(first_name, last_name, company_name)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Project[];
}

export async function getProjectsByStatus(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('projects')
    .select('status')
    .is('deleted_at', null);

  if (error) throw error;

  const statusCounts = data.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return statusCounts;
}
