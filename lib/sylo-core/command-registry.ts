import type { 
  CommandHandler, 
  CommandRegistryEntry, 
  CommandCategory,
  ValidationResult,
  CommandParameterSchema
} from '@/types/sylo-core';

export class CommandRegistry {
  private static instance: CommandRegistry;
  private commands: Map<string, CommandRegistryEntry> = new Map();

  private constructor() {}

  public static getInstance(): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry();
    }
    return CommandRegistry.instance;
  }

  /**
   * Register a command handler
   */
  public register(
    name: string, 
    handler: CommandHandler, 
    category: CommandCategory,
    options: {
      enabled?: boolean;
      permissions?: string[];
    } = {}
  ): void {
    const entry: CommandRegistryEntry = {
      handler,
      category,
      enabled: options.enabled ?? true,
      permissions: options.permissions
    };

    this.commands.set(name, entry);
    console.log(`[Sylo-core] Registered command: ${name} (${category})`);
  }

  /**
   * Get a command handler by name
   */
  public get(name: string): CommandRegistryEntry | undefined {
    return this.commands.get(name);
  }

  /**
   * Check if a command exists
   */
  public has(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Get all commands in a category
   */
  public getByCategory(category: CommandCategory): CommandRegistryEntry[] {
    return Array.from(this.commands.values())
      .filter(entry => entry.category === category);
  }

  /**
   * Get all available commands
   */
  public getAll(): Map<string, CommandRegistryEntry> {
    return new Map(this.commands);
  }

  /**
   * Get enabled commands only
   */
  public getEnabled(): Map<string, CommandRegistryEntry> {
    const enabled = new Map<string, CommandRegistryEntry>();
    for (const [name, entry] of this.commands) {
      if (entry.enabled) {
        enabled.set(name, entry);
      }
    }
    return enabled;
  }

  /**
   * Validate command parameters
   */
  public validateParameters(
    commandName: string, 
    parameters: Record<string, any>
  ): ValidationResult {
    const entry = this.commands.get(commandName);
    if (!entry) {
      return {
        valid: false,
        errors: [`Command '${commandName}' not found`]
      };
    }

    const errors: string[] = [];
    const schema = entry.handler.parameters;

    // Check required parameters
    for (const param of schema) {
      if (param.required && !(param.name in parameters)) {
        errors.push(`Missing required parameter: ${param.name}`);
        continue;
      }

      const value = parameters[param.name];
      if (value === undefined || value === null) {
        continue;
      }

      // Type validation
      if (!this.validateParameterType(value, param.type)) {
        errors.push(`Parameter '${param.name}' must be of type ${param.type}`);
        continue;
      }

      // Additional validation rules
      if (param.validation) {
        const validationErrors = this.validateParameterRules(
          param.name, 
          value, 
          param.validation
        );
        errors.push(...validationErrors);
      }
    }

    // Custom validation if provided
    if (entry.handler.validate) {
      const customValidation = entry.handler.validate(parameters);
      if (!customValidation.valid) {
        errors.push(...customValidation.errors);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate parameter type
   */
  private validateParameterType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Validate parameter rules
   */
  private validateParameterRules(
    paramName: string,
    value: any,
    rules: NonNullable<CommandParameterSchema['validation']>
  ): string[] {
    const errors: string[] = [];

    if (rules.min !== undefined) {
      if (typeof value === 'number' && value < rules.min) {
        errors.push(`Parameter '${paramName}' must be at least ${rules.min}`);
      } else if (typeof value === 'string' && value.length < rules.min) {
        errors.push(`Parameter '${paramName}' must be at least ${rules.min} characters`);
      } else if (Array.isArray(value) && value.length < rules.min) {
        errors.push(`Parameter '${paramName}' must have at least ${rules.min} items`);
      }
    }

    if (rules.max !== undefined) {
      if (typeof value === 'number' && value > rules.max) {
        errors.push(`Parameter '${paramName}' must be at most ${rules.max}`);
      } else if (typeof value === 'string' && value.length > rules.max) {
        errors.push(`Parameter '${paramName}' must be at most ${rules.max} characters`);
      } else if (Array.isArray(value) && value.length > rules.max) {
        errors.push(`Parameter '${paramName}' must have at most ${rules.max} items`);
      }
    }

    if (rules.pattern && typeof value === 'string') {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        errors.push(`Parameter '${paramName}' does not match required pattern`);
      }
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`Parameter '${paramName}' must be one of: ${rules.enum.join(', ')}`);
    }

    return errors;
  }

  /**
   * Enable/disable a command
   */
  public setEnabled(commandName: string, enabled: boolean): boolean {
    const entry = this.commands.get(commandName);
    if (entry) {
      entry.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Get command documentation
   */
  public getDocumentation(): Record<string, any> {
    const docs: Record<string, any> = {};
    
    for (const [name, entry] of this.commands) {
      docs[name] = {
        name: entry.handler.name,
        description: entry.handler.description,
        category: entry.category,
        enabled: entry.enabled,
        parameters: entry.handler.parameters.map(param => ({
          name: param.name,
          type: param.type,
          required: param.required,
          description: param.description,
          validation: param.validation
        })),
        permissions: entry.permissions
      };
    }

    return docs;
  }
}

// Export singleton instance
export const commandRegistry = CommandRegistry.getInstance();
