import { NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, handleDatabaseError } from '@/lib/supabase';
import type { Project, ProjectStatus, Priority } from '@/types/database-types';

// Validation helpers
const isValidStatus = (status: string): status is ProjectStatus => {
  return ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'].includes(status);
};

const isValidPriority = (priority: string): priority is Priority => {
  return ['low', 'medium', 'high', 'urgent'].includes(priority);
};

const isValidDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};

export async function POST(req: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await req.json();
    
    // Validate required fields
    if (!json.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (json.status && !isValidStatus(json.status)) {
      return NextResponse.json(
        { error: 'Invalid project status' },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (json.priority && !isValidPriority(json.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (json.start_date && !isValidDate(json.start_date)) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      );
    }

    if (json.target_completion_date && !isValidDate(json.target_completion_date)) {
      return NextResponse.json(
        { error: 'Invalid target completion date format' },
        { status: 400 }
      );
    }

    // Validate budget
    if (json.budget_min && json.budget_max && Number(json.budget_min) > Number(json.budget_max)) {
      return NextResponse.json(
        { error: 'Minimum budget cannot be greater than maximum budget' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...json,
        created_by: user.id,
        team_members: [user.id]
      })
      .select()
      .single();

    if (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 items per page
    const offset = (page - 1) * limit;

    // Filter parameters
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const client_id = searchParams.get('client_id');
    const assigned_to = searchParams.get('assigned_to');
    const start_date_from = searchParams.get('start_date_from');
    const start_date_to = searchParams.get('start_date_to');
    const search = searchParams.get('search');

    // Sorting parameters
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';

    // Include related data
    const include = searchParams.get('include')?.split(',') || [];

    const supabase = createClient();
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
    if (status && isValidStatus(status)) {
      query = query.eq('status', status);
    }
    if (priority && isValidPriority(priority)) {
      query = query.eq('priority', priority);
    }
    if (client_id) {
      query = query.eq('client_id', client_id);
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    if (start_date_from && isValidDate(start_date_from)) {
      query = query.gte('start_date', start_date_from);
    }
    if (start_date_to && isValidDate(start_date_to)) {
      query = query.lte('start_date', start_date_to);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { id, ...updates } = json;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (updates.status && !isValidStatus(updates.status)) {
      return NextResponse.json(
        { error: 'Invalid project status' },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (updates.priority && !isValidPriority(updates.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (updates.start_date && !isValidDate(updates.start_date)) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      );
    }

    if (updates.target_completion_date && !isValidDate(updates.target_completion_date)) {
      return NextResponse.json(
        { error: 'Invalid target completion date format' },
        { status: 400 }
      );
    }

    // Validate budget
    if (
      updates.budget_min !== undefined &&
      updates.budget_max !== undefined &&
      Number(updates.budget_min) > Number(updates.budget_max)
    ) {
      return NextResponse.json(
        { error: 'Minimum budget cannot be greater than maximum budget' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // First, get the current project state
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      const { error: errorMessage, status } = handleDatabaseError(fetchError);
      return NextResponse.json({ error: errorMessage }, { status });
    }

    // Validate status transition
    if (updates.status && currentProject.status !== updates.status) {
      const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
        planning: ['in_progress', 'cancelled'],
        in_progress: ['review', 'on_hold', 'cancelled'],
        review: ['completed', 'in_progress', 'on_hold'],
        completed: ['in_progress'], // Allow reopening if needed
        on_hold: ['in_progress', 'cancelled'],
        cancelled: ['planning'] // Allow restarting if needed
      };

      if (!validTransitions[currentProject.status].includes(updates.status)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentProject.status} to ${updates.status}` },
          { status: 400 }
        );
      }
    }

    // Validate team members
    if (updates.team_members) {
      if (!Array.isArray(updates.team_members)) {
        return NextResponse.json(
          { error: 'Team members must be an array' },
          { status: 400 }
        );
      }

      // Ensure created_by user remains in team_members
      if (!updates.team_members.includes(currentProject.created_by)) {
        updates.team_members = [...updates.team_members, currentProject.created_by];
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if the project exists and user has permission
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('status, created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      const { error: errorMessage, status } = handleDatabaseError(fetchError);
      return NextResponse.json({ error: errorMessage }, { status });
    }

    // Only allow deletion if project is in planning or cancelled status
    if (!['planning', 'cancelled'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Only projects in planning or cancelled status can be deleted' },
        { status: 400 }
      );
    }

    // Only allow project creator to delete
    if (project.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Only the project creator can delete the project' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
