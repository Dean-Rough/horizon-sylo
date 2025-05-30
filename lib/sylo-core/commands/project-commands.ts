import type { CommandHandler, CommandContext } from '@/types/sylo-core';
import { projectService } from '../services/project-service';

// Create Project Command
export const createProjectCommand: CommandHandler = {
  name: 'create_project',
  description: 'Create a new project',
  parameters: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Project name',
      validation: { min: 1, max: 255 }
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Project description'
    },
    {
      name: 'status',
      type: 'string',
      required: false,
      description: 'Project status',
      validation: { enum: ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'] }
    },
    {
      name: 'priority',
      type: 'string',
      required: false,
      description: 'Project priority',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    },
    {
      name: 'client_id',
      type: 'string',
      required: false,
      description: 'Client ID'
    },
    {
      name: 'budget_min',
      type: 'number',
      required: false,
      description: 'Minimum budget',
      validation: { min: 0 }
    },
    {
      name: 'budget_max',
      type: 'number',
      required: false,
      description: 'Maximum budget',
      validation: { min: 0 }
    },
    {
      name: 'start_date',
      type: 'string',
      required: false,
      description: 'Project start date (YYYY-MM-DD)'
    },
    {
      name: 'target_completion_date',
      type: 'string',
      required: false,
      description: 'Target completion date (YYYY-MM-DD)'
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: false,
      description: 'User ID to assign project to'
    },
    {
      name: 'team_members',
      type: 'array',
      required: false,
      description: 'Array of user IDs for team members'
    }
  ],
  async execute(params: any, context: CommandContext) {
    const projectData = {
      ...params,
      created_by: context.user.id,
      team_members: params.team_members || [context.user.id]
    };

    return await projectService.create(projectData);
  },
  validate(params: any) {
    const errors: string[] = [];
    
    if (params.budget_min && params.budget_max && params.budget_min > params.budget_max) {
      errors.push('Minimum budget cannot be greater than maximum budget');
    }
    
    return { valid: errors.length === 0, errors };
  }
};

// Update Project Command
export const updateProjectCommand: CommandHandler = {
  name: 'update_project',
  description: 'Update an existing project',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'Project name',
      validation: { min: 1, max: 255 }
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Project description'
    },
    {
      name: 'status',
      type: 'string',
      required: false,
      description: 'Project status',
      validation: { enum: ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'] }
    },
    {
      name: 'priority',
      type: 'string',
      required: false,
      description: 'Project priority',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    },
    {
      name: 'budget_min',
      type: 'number',
      required: false,
      description: 'Minimum budget',
      validation: { min: 0 }
    },
    {
      name: 'budget_max',
      type: 'number',
      required: false,
      description: 'Maximum budget',
      validation: { min: 0 }
    },
    {
      name: 'start_date',
      type: 'string',
      required: false,
      description: 'Project start date (YYYY-MM-DD)'
    },
    {
      name: 'target_completion_date',
      type: 'string',
      required: false,
      description: 'Target completion date (YYYY-MM-DD)'
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: false,
      description: 'User ID to assign project to'
    },
    {
      name: 'team_members',
      type: 'array',
      required: false,
      description: 'Array of user IDs for team members'
    }
  ],
  async execute(params: any, context: CommandContext) {
    const { id, ...updateData } = params;
    return await projectService.update(id, updateData);
  }
};

// Delete Project Command
export const deleteProjectCommand: CommandHandler = {
  name: 'delete_project',
  description: 'Delete a project (soft delete)',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.delete(params.id);
  }
};

// Get Project Command
export const getProjectCommand: CommandHandler = {
  name: 'get_project',
  description: 'Get project details by ID',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.get(params.id);
  }
};

// List Projects Command
export const listProjectsCommand: CommandHandler = {
  name: 'list_projects',
  description: 'List projects with optional filtering and pagination',
  parameters: [
    {
      name: 'page',
      type: 'number',
      required: false,
      description: 'Page number (default: 1)',
      validation: { min: 1 }
    },
    {
      name: 'limit',
      type: 'number',
      required: false,
      description: 'Items per page (default: 10, max: 100)',
      validation: { min: 1, max: 100 }
    },
    {
      name: 'status',
      type: 'string',
      required: false,
      description: 'Filter by project status',
      validation: { enum: ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'] }
    },
    {
      name: 'priority',
      type: 'string',
      required: false,
      description: 'Filter by priority',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    },
    {
      name: 'client_id',
      type: 'string',
      required: false,
      description: 'Filter by client ID'
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: false,
      description: 'Filter by assigned user ID'
    },
    {
      name: 'search',
      type: 'string',
      required: false,
      description: 'Search in project name and description'
    },
    {
      name: 'sort_by',
      type: 'string',
      required: false,
      description: 'Field to sort by (default: created_at)'
    },
    {
      name: 'sort_order',
      type: 'string',
      required: false,
      description: 'Sort order',
      validation: { enum: ['asc', 'desc'] }
    },
    {
      name: 'include',
      type: 'array',
      required: false,
      description: 'Related data to include (e.g., ["tasks", "materials"])'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.list(params);
  }
};

// Update Project Status Command
export const updateProjectStatusCommand: CommandHandler = {
  name: 'update_project_status',
  description: 'Update project status',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    },
    {
      name: 'status',
      type: 'string',
      required: true,
      description: 'New project status',
      validation: { enum: ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'] }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.updateStatus(params.id, params.status);
  }
};

// Assign Team Members Command
export const assignTeamMembersCommand: CommandHandler = {
  name: 'assign_team_members',
  description: 'Assign team members to a project',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    },
    {
      name: 'team_members',
      type: 'array',
      required: true,
      description: 'Array of user IDs for team members'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.assignTeamMembers(params.id, params.team_members);
  }
};

// Update Project Budget Command
export const updateProjectBudgetCommand: CommandHandler = {
  name: 'update_project_budget',
  description: 'Update project budget range',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    },
    {
      name: 'budget_min',
      type: 'number',
      required: false,
      description: 'Minimum budget',
      validation: { min: 0 }
    },
    {
      name: 'budget_max',
      type: 'number',
      required: false,
      description: 'Maximum budget',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.updateBudget(params.id, params.budget_min, params.budget_max);
  },
  validate(params: any) {
    const errors: string[] = [];
    
    if (params.budget_min && params.budget_max && params.budget_min > params.budget_max) {
      errors.push('Minimum budget cannot be greater than maximum budget');
    }
    
    return { valid: errors.length === 0, errors };
  }
};

// Update Project Timeline Command
export const updateProjectTimelineCommand: CommandHandler = {
  name: 'update_project_timeline',
  description: 'Update project timeline dates',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Project ID'
    },
    {
      name: 'start_date',
      type: 'string',
      required: false,
      description: 'Project start date (YYYY-MM-DD)'
    },
    {
      name: 'target_completion_date',
      type: 'string',
      required: false,
      description: 'Target completion date (YYYY-MM-DD)'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await projectService.updateTimeline(params.id, params.start_date, params.target_completion_date);
  }
};

// Export all project commands
export const projectCommands = [
  createProjectCommand,
  updateProjectCommand,
  deleteProjectCommand,
  getProjectCommand,
  listProjectsCommand,
  updateProjectStatusCommand,
  assignTeamMembersCommand,
  updateProjectBudgetCommand,
  updateProjectTimelineCommand
];
