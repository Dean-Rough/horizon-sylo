// Core orchestration engine
export { orchestrator, SyloCoreOrchestrator } from './orchestrator';

// Command registry system
export { commandRegistry, CommandRegistry } from './command-registry';

// Command initialization
export { 
  initializeCommands, 
  getCommandsByCategory, 
  getAllCommandDocumentation,
  projectCommands,
  taskCommands,
  materialCommands
} from './commands/index';

// Services
export { projectService } from './services/project-service';
export { taskService } from './services/task-service';
export { materialService } from './services/material-service';

// Types (re-export from types directory)
export type {
  SyloCoreCommand,
  SyloCoreResponse,
  CommandHandler,
  CommandContext,
  CommandParameterSchema,
  ValidationResult,
  CommandCategory,
  CommandRegistryEntry,
  SyloCoreErrorCode,
  ProjectService,
  TaskService,
  MaterialService,
  MCPService,
  WorkflowStep,
  Workflow
} from '@/types/sylo-core';

/**
 * Initialize the Sylo-core system
 * This should be called once during application startup
 */
export function initializeSyloCore(): void {
  console.log('[Sylo-core] Initializing Sylo-core AI Orchestration Engine...');
  
  // Import and initialize all commands
  const { initializeCommands } = require('./commands/index');
  initializeCommands();
  
  console.log('[Sylo-core] Sylo-core initialization complete');
}

/**
 * Get system status and information
 */
export async function getSyloCoreStatus() {
  const { orchestrator } = await import('./orchestrator');
  return await orchestrator.healthCheck();
}

/**
 * Execute a command directly (for internal use)
 */
export async function executeCommand(
  action: string,
  parameters: Record<string, any>,
  user: { id: string; email?: string; role?: string },
  requestId?: string
) {
  const { orchestrator } = await import('./orchestrator');
  
  return await orchestrator.execute({
    action,
    parameters,
    metadata: { requestId }
  }, user);
}

/**
 * Get available commands for a user
 */
export async function getAvailableCommands(
  user: { id: string; email?: string; role?: string }
) {
  const { orchestrator } = await import('./orchestrator');
  return await orchestrator.getAvailableCommands(user);
}
