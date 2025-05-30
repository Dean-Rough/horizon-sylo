import type { ProjectService } from '@/types/sylo-core';
import type { Project, ProjectStatus, Priority } from '@/types/database-types';
import { createClient } from '@/lib/supabase';

export class ProjectServiceImpl implements ProjectService {
  private async getSupabase() {
    return await createClient();
  }

  async create(data: {
    name: string;
    description?: string;
    status?: ProjectStatus;
    priority?: Priority;
    client_id?: string;
    budget_min?: number;
    budget_max?: number;
    start_date?: string;
    target_completion_date?: string;
    assigned_to?: string;
    team_members?: string[];
  }): Promise<Project> {
    const supabase = await this.getSupabase();
    
    const { data: project, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return project;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const supabase = await this.getSupabase();
    
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return project;
  }

  async delete(id: string): Promise<Project> {
    const supabase = await this.getSupabase();
    
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    return project;
  }

  async get(id: string): Promise<Project> {
    const supabase = await this.getSupabase();
    
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to get project: ${error.message}`);
    }

    return project;
  }

  async list(filters: {
    page?: number;
    limit?: number;
    status?: ProjectStatus;
    priority?: Priority;
    client_id?: string;
    assigned_to?: string;
    start_date_from?: string;
    start_date_to?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    include?: string[];
  } = {}): Promise<{
    data: Project[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  }> {
    const supabase = await this.getSupabase();
    
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      client_id,
      assigned_to,
      start_date_from,
      start_date_to,
      search,
      sort_by = 'created_at',
      sort_order = 'desc',
      include = []
    } = filters;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('projects')
      .select(
        include.length > 0
          ? `*, ${include.map(table => `${table}(*)`).join(', ')}`
          : '*',
        { count: 'exact' }
      )
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order(sort_by, { ascending: sort_order === 'asc' });

    // Apply filters
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (client_id) query = query.eq('client_id', client_id);
    if (assigned_to) query = query.eq('assigned_to', assigned_to);
    if (start_date_from) query = query.gte('start_date', start_date_from);
    if (start_date_to) query = query.lte('start_date', start_date_to);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to list projects: ${error.message}`);
    }

    return {
      data: (data as unknown as Project[]) || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    };
  }

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    return this.update(id, { status });
  }

  async assignTeamMembers(id: string, teamMembers: string[]): Promise<Project> {
    return this.update(id, { team_members: teamMembers });
  }

  async updateBudget(id: string, budgetMin?: number, budgetMax?: number): Promise<Project> {
    return this.update(id, { budget_min: budgetMin, budget_max: budgetMax });
  }

  async updateTimeline(id: string, startDate?: string, targetDate?: string): Promise<Project> {
    return this.update(id, { 
      start_date: startDate, 
      target_completion_date: targetDate 
    });
  }
}

// Export singleton instance
export const projectService = new ProjectServiceImpl();
