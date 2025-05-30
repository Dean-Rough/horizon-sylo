// Core command interface
export interface SyloCoreCommand {
  action: string;
  parameters: Record<string, any>;
  metadata?: {
    requestId?: string;
    userId?: string;
    timestamp?: string;
  };
}

// Command response interface
export interface SyloCoreResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    action: string;
    executionTime: number;
    timestamp: string;
  };
}

// Command handler interface
export interface CommandHandler {
  name: string;
  description: string;
  parameters: CommandParameterSchema[];
  execute: (params: any, context: CommandContext) => Promise<any>;
  validate?: (params: any) => ValidationResult;
}

// Parameter schema for validation
export interface CommandParameterSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

// Command execution context
export interface CommandContext {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
  requestId: string;
  timestamp: Date;
  supabase: any; // Supabase client
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Available command categories
export type CommandCategory = 
  | 'project'
  | 'task' 
  | 'material'
  | 'mcp'
  | 'ai'
  | 'workflow'
  | 'analytics'
  | 'system';

// Command registry entry
export interface CommandRegistryEntry {
  handler: CommandHandler;
  category: CommandCategory;
  enabled: boolean;
  permissions?: string[];
}

// Error codes
export enum SyloCoreErrorCode {
  INVALID_COMMAND = 'INVALID_COMMAND',
  MISSING_PARAMETERS = 'MISSING_PARAMETERS',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND',
  EXECUTION_FAILED = 'EXECUTION_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMITED = 'RATE_LIMITED'
}

// Service integration interfaces
export interface ProjectService {
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
  get: (id: string) => Promise<any>;
  list: (filters: any) => Promise<any>;
}

export interface TaskService {
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
  get: (id: string) => Promise<any>;
  list: (filters: any) => Promise<any>;
}

export interface MaterialService {
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
  get: (id: string) => Promise<any>;
  list: (filters: any) => Promise<any>;
}

export interface MCPService {
  pinterest: {
    search: (query: string) => Promise<any>;
    createBoard: (name: string, description?: string) => Promise<any>;
  };
  sketchup: {
    createModel: (dimensions: any) => Promise<any>;
    modifyModel: (modelId: string, changes: any) => Promise<any>;
  };
}

// Workflow types
export interface WorkflowStep {
  id: string;
  action: string;
  parameters: Record<string, any>;
  condition?: string;
  onSuccess?: string;
  onError?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers?: string[];
}
