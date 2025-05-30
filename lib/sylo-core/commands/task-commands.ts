import type { CommandHandler, CommandContext } from '@/types/sylo-core';
import { taskService } from '../services/task-service';

// Create Task Command
export const createTaskCommand: CommandHandler = {
  name: 'create_task',
  description: 'Create a new task',
  parameters: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Task title',
      validation: { min: 1, max: 255 }
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Task description'
    },
    {
      name: 'project_id',
      type: 'string',
      required: true,
      description: 'Project ID this task belongs to'
    },
    {
      name: 'status',
      type: 'string',
      required: false,
      description: 'Task status',
      validation: { enum: ['todo', 'in_progress', 'review', 'completed'] }
    },
    {
      name: 'priority',
      type: 'string',
      required: false,
      description: 'Task priority',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    },
    {
      name: 'parent_task_id',
      type: 'string',
      required: false,
      description: 'Parent task ID for subtasks'
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: false,
      description: 'User ID to assign task to'
    },
    {
      name: 'due_date',
      type: 'string',
      required: false,
      description: 'Due date (YYYY-MM-DD)'
    },
    {
      name: 'estimated_hours',
      type: 'number',
      required: false,
      description: 'Estimated hours to complete',
      validation: { min: 0 }
    },
    {
      name: 'board_column',
      type: 'string',
      required: false,
      description: 'Kanban board column'
    },
    {
      name: 'position',
      type: 'number',
      required: false,
      description: 'Position in board column',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    const taskData = {
      ...params,
      assigned_to: params.assigned_to || context.user.id
    };

    return await taskService.create(taskData);
  }
};

// Update Task Command
export const updateTaskCommand: CommandHandler = {
  name: 'update_task',
  description: 'Update an existing task',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Task title',
      validation: { min: 1, max: 255 }
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Task description'
    },
    {
      name: 'status',
      type: 'string',
      required: false,
      description: 'Task status',
      validation: { enum: ['todo', 'in_progress', 'review', 'completed'] }
    },
    {
      name: 'priority',
      type: 'string',
      required: false,
      description: 'Task priority',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: false,
      description: 'User ID to assign task to'
    },
    {
      name: 'due_date',
      type: 'string',
      required: false,
      description: 'Due date (YYYY-MM-DD)'
    },
    {
      name: 'estimated_hours',
      type: 'number',
      required: false,
      description: 'Estimated hours to complete',
      validation: { min: 0 }
    },
    {
      name: 'board_column',
      type: 'string',
      required: false,
      description: 'Kanban board column'
    },
    {
      name: 'position',
      type: 'number',
      required: false,
      description: 'Position in board column',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    const { id, ...updateData } = params;
    return await taskService.update(id, updateData);
  }
};

// Delete Task Command
export const deleteTaskCommand: CommandHandler = {
  name: 'delete_task',
  description: 'Delete a task (soft delete)',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.delete(params.id);
  }
};

// Get Task Command
export const getTaskCommand: CommandHandler = {
  name: 'get_task',
  description: 'Get task details by ID',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.get(params.id);
  }
};

// List Tasks Command
export const listTasksCommand: CommandHandler = {
  name: 'list_tasks',
  description: 'List tasks with optional filtering',
  parameters: [
    {
      name: 'project_id',
      type: 'string',
      required: false,
      description: 'Filter by project ID'
    },
    {
      name: 'status',
      type: 'string',
      required: false,
      description: 'Filter by task status',
      validation: { enum: ['todo', 'in_progress', 'review', 'completed'] }
    },
    {
      name: 'priority',
      type: 'string',
      required: false,
      description: 'Filter by priority',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: false,
      description: 'Filter by assigned user ID'
    },
    {
      name: 'parent_task_id',
      type: 'string',
      required: false,
      description: 'Filter by parent task ID'
    },
    {
      name: 'board_column',
      type: 'string',
      required: false,
      description: 'Filter by board column'
    },
    {
      name: 'due_date_from',
      type: 'string',
      required: false,
      description: 'Filter by due date from (YYYY-MM-DD)'
    },
    {
      name: 'due_date_to',
      type: 'string',
      required: false,
      description: 'Filter by due date to (YYYY-MM-DD)'
    },
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
      description: 'Items per page (default: 50)',
      validation: { min: 1, max: 100 }
    },
    {
      name: 'sort_by',
      type: 'string',
      required: false,
      description: 'Field to sort by (default: position)'
    },
    {
      name: 'sort_order',
      type: 'string',
      required: false,
      description: 'Sort order',
      validation: { enum: ['asc', 'desc'] }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.list(params);
  }
};

// Update Task Status Command
export const updateTaskStatusCommand: CommandHandler = {
  name: 'update_task_status',
  description: 'Update task status',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'status',
      type: 'string',
      required: true,
      description: 'New task status',
      validation: { enum: ['todo', 'in_progress', 'review', 'completed'] }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.updateStatus(params.id, params.status);
  }
};

// Assign Task Command
export const assignTaskCommand: CommandHandler = {
  name: 'assign_task',
  description: 'Assign task to a user',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'assigned_to',
      type: 'string',
      required: true,
      description: 'User ID to assign task to'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.assignTask(params.id, params.assigned_to);
  }
};

// Move Task Command
export const moveTaskCommand: CommandHandler = {
  name: 'move_task',
  description: 'Move task to different board column and position',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'board_column',
      type: 'string',
      required: true,
      description: 'Target board column'
    },
    {
      name: 'position',
      type: 'number',
      required: true,
      description: 'Position in the column',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.moveTask(params.id, params.board_column, params.position);
  }
};

// Set Task Priority Command
export const setTaskPriorityCommand: CommandHandler = {
  name: 'set_task_priority',
  description: 'Set task priority level',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'priority',
      type: 'string',
      required: true,
      description: 'Priority level',
      validation: { enum: ['low', 'medium', 'high', 'urgent'] }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.setPriority(params.id, params.priority);
  }
};

// Set Task Due Date Command
export const setTaskDueDateCommand: CommandHandler = {
  name: 'set_task_due_date',
  description: 'Set task due date',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'due_date',
      type: 'string',
      required: true,
      description: 'Due date (YYYY-MM-DD)'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.setDueDate(params.id, params.due_date);
  }
};

// Set Task Estimated Hours Command
export const setTaskEstimatedHoursCommand: CommandHandler = {
  name: 'set_task_estimated_hours',
  description: 'Set estimated hours for task completion',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Task ID'
    },
    {
      name: 'hours',
      type: 'number',
      required: true,
      description: 'Estimated hours',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.setEstimatedHours(params.id, params.hours);
  }
};

// Get Subtasks Command
export const getSubtasksCommand: CommandHandler = {
  name: 'get_subtasks',
  description: 'Get all subtasks of a parent task',
  parameters: [
    {
      name: 'parent_task_id',
      type: 'string',
      required: true,
      description: 'Parent task ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.getSubtasks(params.parent_task_id);
  }
};

// Get Tasks by Project Command
export const getTasksByProjectCommand: CommandHandler = {
  name: 'get_tasks_by_project',
  description: 'Get all tasks for a specific project',
  parameters: [
    {
      name: 'project_id',
      type: 'string',
      required: true,
      description: 'Project ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.getTasksByProject(params.project_id);
  }
};

// Get Overdue Tasks Command
export const getOverdueTasksCommand: CommandHandler = {
  name: 'get_overdue_tasks',
  description: 'Get overdue tasks, optionally filtered by project',
  parameters: [
    {
      name: 'project_id',
      type: 'string',
      required: false,
      description: 'Project ID to filter by'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await taskService.getOverdueTasks(params.project_id);
  }
};

// Export all task commands
export const taskCommands = [
  createTaskCommand,
  updateTaskCommand,
  deleteTaskCommand,
  getTaskCommand,
  listTasksCommand,
  updateTaskStatusCommand,
  assignTaskCommand,
  moveTaskCommand,
  setTaskPriorityCommand,
  setTaskDueDateCommand,
  setTaskEstimatedHoursCommand,
  getSubtasksCommand,
  getTasksByProjectCommand,
  getOverdueTasksCommand
];
