import type { TaskService } from '@/types/sylo-core';
import type { Task, TaskStatus, Priority } from '@/types/database-types';
import { createClient } from '@/lib/supabase';

export class TaskServiceImpl implements TaskService {
  private async getSupabase() {
    return await createClient();
  }

  async create(data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    project_id: string;
    parent_task_id?: string;
    assigned_to?: string;
    due_date?: string;
    estimated_hours?: number;
    board_column?: string;
    position?: number;
  }): Promise<Task> {
    const supabase = await this.getSupabase();
    
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return task;
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const supabase = await this.getSupabase();
    
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
      completed_at: data.status === 'completed' ? new Date().toISOString() : null
    };
    
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return task;
  }

  async delete(id: string): Promise<Task> {
    const supabase = await this.getSupabase();
    
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return task;
  }

  async get(id: string): Promise<Task> {
    const supabase = await this.getSupabase();
    
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to get task: ${error.message}`);
    }

    return task;
  }

  async list(filters: {
    project_id?: string;
    status?: TaskStatus;
    priority?: Priority;
    assigned_to?: string;
    parent_task_id?: string;
    due_date_from?: string;
    due_date_to?: string;
    board_column?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}): Promise<Task[]> {
    const supabase = await this.getSupabase();
    
    const {
      project_id,
      status,
      priority,
      assigned_to,
      parent_task_id,
      due_date_from,
      due_date_to,
      board_column,
      page = 1,
      limit = 50,
      sort_by = 'position',
      sort_order = 'asc'
    } = filters;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('tasks')
      .select('*')
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order(sort_by, { ascending: sort_order === 'asc' });

    // Apply filters
    if (project_id) query = query.eq('project_id', project_id);
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (assigned_to) query = query.eq('assigned_to', assigned_to);
    if (parent_task_id) query = query.eq('parent_task_id', parent_task_id);
    if (board_column) query = query.eq('board_column', board_column);
    if (due_date_from) query = query.gte('due_date', due_date_from);
    if (due_date_to) query = query.lte('due_date', due_date_to);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list tasks: ${error.message}`);
    }

    return (data as unknown as Task[]) || [];
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.update(id, { status });
  }

  async assignTask(id: string, assignedTo: string): Promise<Task> {
    return this.update(id, { assigned_to: assignedTo });
  }

  async moveTask(id: string, boardColumn: string, position: number): Promise<Task> {
    return this.update(id, { board_column: boardColumn, position });
  }

  async setPriority(id: string, priority: Priority): Promise<Task> {
    return this.update(id, { priority });
  }

  async setDueDate(id: string, dueDate: string): Promise<Task> {
    return this.update(id, { due_date: dueDate });
  }

  async setEstimatedHours(id: string, hours: number): Promise<Task> {
    return this.update(id, { estimated_hours: hours });
  }

  async getSubtasks(parentTaskId: string): Promise<Task[]> {
    return this.list({ parent_task_id: parentTaskId });
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return this.list({ project_id: projectId });
  }

  async getTasksByStatus(status: TaskStatus, projectId?: string): Promise<Task[]> {
    return this.list({ status, project_id: projectId });
  }

  async getTasksByAssignee(assignedTo: string, projectId?: string): Promise<Task[]> {
    return this.list({ assigned_to: assignedTo, project_id: projectId });
  }

  async getOverdueTasks(projectId?: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.list({ 
      due_date_to: today,
      project_id: projectId
    });
  }
}

// Export singleton instance
export const taskService = new TaskServiceImpl();
