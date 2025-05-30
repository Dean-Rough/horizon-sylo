import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Task, 
  CreateTaskData, 
  TaskFilters, 
  SortOptions,
  TaskStats 
} from '@/types/database';

export async function getTasks(
  supabase: SupabaseClient,
  filters?: TaskFilters,
  sort?: SortOptions,
  page = 1,
  limit = 10
) {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      project:projects(name, status)
    `, { count: 'exact' })
    .is('deleted_at', null);

  // Apply filters
  if (filters?.status?.length) {
    query = query.in('status', filters.status);
  }
  
  if (filters?.priority?.length) {
    query = query.in('priority', filters.priority);
  }
  
  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id);
  }
  
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  
  if (filters?.task_type?.length) {
    query = query.in('task_type', filters.task_type);
  }
  
  if (filters?.due_date_from) {
    query = query.gte('due_date', filters.due_date_from);
  }
  
  if (filters?.due_date_to) {
    query = query.lte('due_date', filters.due_date_to);
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
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
    tasks: data as Task[],
    total: count || 0,
    page,
    limit
  };
}

export async function getTask(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(*),
      subtasks:tasks(*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function getProjectTasks(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('position', { ascending: true });

  if (error) throw error;
  return data as Task[];
}

export async function createTask(
  supabase: SupabaseClient, 
  taskData: CreateTaskData
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select(`
      *,
      project:projects(name, status)
    `)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<CreateTaskData>
) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      project:projects(name, status)
    `)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function updateTaskPosition(
  supabase: SupabaseClient,
  id: string,
  newColumn: string,
  newPosition: number
) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      board_column: newColumn,
      position: newPosition 
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Task;
}

export async function getTaskStats(supabase: SupabaseClient): Promise<TaskStats> {
  const { data, error } = await supabase
    .from('tasks')
    .select('status, due_date')
    .is('deleted_at', null);

  if (error) throw error;

  const total_tasks = data.length;
  const completed_tasks = data.filter(t => t.status === 'completed').length;
  
  // Calculate overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const overdue_tasks = data.filter(t => 
    t.status !== 'completed' && 
    t.due_date && 
    t.due_date < today
  ).length;

  // Count tasks by status
  const tasks_by_status = data.reduce((acc, task) => {
    acc[task.status as keyof typeof acc] = (acc[task.status as keyof typeof acc] || 0) + 1;
    return acc;
  }, {
    todo: 0,
    in_progress: 0,
    review: 0,
    completed: 0
  });

  return {
    total_tasks,
    completed_tasks,
    overdue_tasks,
    tasks_by_status
  };
}

export async function getTasksByProject(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('board_column')
    .order('position');

  if (error) throw error;

  // Group tasks by board column
  const tasksByColumn = data.reduce((acc, task) => {
    if (!acc[task.board_column]) {
      acc[task.board_column] = [];
    }
    acc[task.board_column].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return tasksByColumn;
}

export async function getMyTasks(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(name, status)
    `)
    .eq('assigned_to', userId)
    .is('deleted_at', null)
    .neq('status', 'completed')
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data as Task[];
}

export async function getOverdueTasks(supabase: SupabaseClient) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(name, status)
    `)
    .lt('due_date', today)
    .neq('status', 'completed')
    .is('deleted_at', null)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data as Task[];
}
