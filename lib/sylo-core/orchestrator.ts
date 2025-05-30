import { v4 as uuidv4 } from 'uuid';
import type { 
  SyloCoreCommand, 
  SyloCoreResponse, 
  CommandContext,
  SyloCoreErrorCode 
} from '@/types/sylo-core';
import { commandRegistry } from './command-registry';
import { createClient } from '@/lib/supabase';

export class SyloCoreOrchestrator {
  private static instance: SyloCoreOrchestrator;

  private constructor() {}

  public static getInstance(): SyloCoreOrchestrator {
    if (!SyloCoreOrchestrator.instance) {
      SyloCoreOrchestrator.instance = new SyloCoreOrchestrator();
    }
    return SyloCoreOrchestrator.instance;
  }

  /**
   * Execute a command through the orchestration engine
   */
  public async execute(
    command: SyloCoreCommand,
    user: { id: string; email?: string; role?: string }
  ): Promise<SyloCoreResponse> {
    const startTime = Date.now();
    const requestId = command.metadata?.requestId || uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // Log command execution start
      console.log(`[Sylo-core] Executing command: ${command.action}`, {
        requestId,
        userId: user.id,
        parameters: Object.keys(command.parameters)
      });

      // Validate command exists
      if (!commandRegistry.has(command.action)) {
        return this.createErrorResponse(
          requestId,
          command.action,
          startTime,
          'COMMAND_NOT_FOUND',
          `Command '${command.action}' not found`
        );
      }

      const commandEntry = commandRegistry.get(command.action)!;

      // Check if command is enabled
      if (!commandEntry.enabled) {
        return this.createErrorResponse(
          requestId,
          command.action,
          startTime,
          'COMMAND_NOT_FOUND',
          `Command '${command.action}' is currently disabled`
        );
      }

      // Check permissions
      if (commandEntry.permissions && commandEntry.permissions.length > 0) {
        const hasPermission = await this.checkPermissions(
          user,
          commandEntry.permissions
        );
        if (!hasPermission) {
          return this.createErrorResponse(
            requestId,
            command.action,
            startTime,
            'UNAUTHORIZED',
            'Insufficient permissions to execute this command'
          );
        }
      }

      // Validate parameters
      const validation = commandRegistry.validateParameters(
        command.action,
        command.parameters
      );

      if (!validation.valid) {
        return this.createErrorResponse(
          requestId,
          command.action,
          startTime,
          'VALIDATION_FAILED',
          'Parameter validation failed',
          { errors: validation.errors }
        );
      }

      // Create execution context
      const context: CommandContext = {
        user,
        requestId,
        timestamp: new Date(),
        supabase: await createClient()
      };

      // Execute the command
      const result = await commandEntry.handler.execute(
        command.parameters,
        context
      );

      // Log successful execution
      const executionTime = Date.now() - startTime;
      console.log(`[Sylo-core] Command executed successfully: ${command.action}`, {
        requestId,
        executionTime: `${executionTime}ms`
      });

      return {
        success: true,
        data: result,
        metadata: {
          requestId,
          action: command.action,
          executionTime,
          timestamp
        }
      };

    } catch (error) {
      console.error(`[Sylo-core] Command execution failed: ${command.action}`, {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      return this.createErrorResponse(
        requestId,
        command.action,
        startTime,
        'EXECUTION_FAILED',
        error instanceof Error ? error.message : 'Command execution failed',
        error instanceof Error ? { stack: error.stack } : undefined
      );
    }
  }

  /**
   * Execute multiple commands in sequence
   */
  public async executeSequence(
    commands: SyloCoreCommand[],
    user: { id: string; email?: string; role?: string }
  ): Promise<SyloCoreResponse[]> {
    const results: SyloCoreResponse[] = [];
    
    for (const command of commands) {
      const result = await this.execute(command, user);
      results.push(result);
      
      // Stop execution if a command fails
      if (!result.success) {
        console.log(`[Sylo-core] Sequence execution stopped at command: ${command.action}`);
        break;
      }
    }

    return results;
  }

  /**
   * Execute multiple commands in parallel
   */
  public async executeParallel(
    commands: SyloCoreCommand[],
    user: { id: string; email?: string; role?: string }
  ): Promise<SyloCoreResponse[]> {
    const promises = commands.map(command => this.execute(command, user));
    return Promise.all(promises);
  }

  /**
   * Get available commands for a user
   */
  public async getAvailableCommands(
    user: { id: string; email?: string; role?: string }
  ): Promise<Record<string, any>> {
    const allCommands = commandRegistry.getEnabled();
    const availableCommands: Record<string, any> = {};

    for (const [name, entry] of allCommands) {
      // Check permissions
      if (entry.permissions && entry.permissions.length > 0) {
        const hasPermission = await this.checkPermissions(user, entry.permissions);
        if (!hasPermission) {
          continue;
        }
      }

      availableCommands[name] = {
        name: entry.handler.name,
        description: entry.handler.description,
        category: entry.category,
        parameters: entry.handler.parameters
      };
    }

    return availableCommands;
  }

  /**
   * Get command documentation
   */
  public getDocumentation(): Record<string, any> {
    return commandRegistry.getDocumentation();
  }

  /**
   * Health check for the orchestrator
   */
  public async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  }> {
    const details: Record<string, any> = {};
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      // Check command registry
      const commandCount = commandRegistry.getEnabled().size;
      details.commands = {
        total: commandRegistry.getAll().size,
        enabled: commandCount,
        status: commandCount > 0 ? 'healthy' : 'degraded'
      };

      // Check database connection
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('projects').select('id').limit(1);
        details.database = {
          status: error ? 'unhealthy' : 'healthy',
          error: error?.message
        };
        if (error) status = 'degraded';
      } catch (dbError) {
        details.database = {
          status: 'unhealthy',
          error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        };
        status = 'unhealthy';
      }

      details.timestamp = new Date().toISOString();
      details.uptime = process.uptime();

    } catch (error) {
      status = 'unhealthy';
      details.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return { status, details };
  }

  /**
   * Check user permissions
   */
  private async checkPermissions(
    user: { id: string; email?: string; role?: string },
    requiredPermissions: string[]
  ): Promise<boolean> {
    // Basic role-based permission check
    // This can be extended with more sophisticated permission systems
    
    if (user.role === 'admin') {
      return true; // Admins have all permissions
    }

    // For now, allow all authenticated users to execute commands
    // This should be replaced with proper RBAC implementation
    return true;
  }

  /**
   * Create standardized error response
   */
  private createErrorResponse(
    requestId: string,
    action: string,
    startTime: number,
    code: string,
    message: string,
    details?: any
  ): SyloCoreResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details
      },
      metadata: {
        requestId,
        action,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Export singleton instance
export const orchestrator = SyloCoreOrchestrator.getInstance();
