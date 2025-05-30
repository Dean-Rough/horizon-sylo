import { commandRegistry } from '../command-registry';
import { projectCommands } from './project-commands';
import { taskCommands } from './task-commands';
import { materialCommands } from './material-commands';

/**
 * Initialize and register all Sylo-core commands
 */
export function initializeCommands(): void {
  console.log('[Sylo-core] Initializing commands...');

  // Register project commands
  projectCommands.forEach(command => {
    commandRegistry.register(command.name, command, 'project');
  });

  // Register task commands
  taskCommands.forEach(command => {
    commandRegistry.register(command.name, command, 'task');
  });

  // Register material commands
  materialCommands.forEach(command => {
    commandRegistry.register(command.name, command, 'material');
  });

  const totalCommands = commandRegistry.getEnabled().size;
  console.log(`[Sylo-core] Initialized ${totalCommands} commands successfully`);

  // Log command summary by category
  const categories = ['project', 'task', 'material'] as const;
  categories.forEach(category => {
    const categoryCommands = commandRegistry.getByCategory(category);
    console.log(`[Sylo-core] ${category}: ${categoryCommands.length} commands`);
  });
}

/**
 * Get all available commands grouped by category
 */
export function getCommandsByCategory() {
  return {
    project: commandRegistry.getByCategory('project'),
    task: commandRegistry.getByCategory('task'),
    material: commandRegistry.getByCategory('material'),
    mcp: commandRegistry.getByCategory('mcp'),
    ai: commandRegistry.getByCategory('ai'),
    workflow: commandRegistry.getByCategory('workflow'),
    analytics: commandRegistry.getByCategory('analytics'),
    system: commandRegistry.getByCategory('system')
  };
}

/**
 * Get command documentation for all registered commands
 */
export function getAllCommandDocumentation() {
  return commandRegistry.getDocumentation();
}

// Export command arrays for external use
export { projectCommands } from './project-commands';
export { taskCommands } from './task-commands';
export { materialCommands } from './material-commands';

// Export command registry for direct access
export { commandRegistry } from '../command-registry';
