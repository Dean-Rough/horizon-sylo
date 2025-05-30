# Sylo-core AI Orchestration Engine

Sylo-core is the central AI orchestration engine for the Sylo platform, providing a unified command interface for all platform functions. It enables AI agents and applications to control projects, tasks, materials, and integrations through a single, consistent API.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Sylo-core Engine                         │
├─────────────────────────────────────────────────────────────┤
│  API Endpoint: /api/sylo-core                              │
│  ├── Authentication & Authorization                         │
│  ├── Command Validation                                     │
│  └── Response Formatting                                    │
├─────────────────────────────────────────────────────────────┤
│  Orchestrator                                              │
│  ├── Command Routing                                       │
│  ├── Execution Context                                     │
│  ├── Error Handling                                       │
│  └── Logging & Monitoring                                 │
├─────────────────────────────────────────────────────────────┤
│  Command Registry                                          │
│  ├── Command Registration                                  │
│  ├── Parameter Validation                                  │
│  ├── Permission Checking                                   │
│  └── Documentation Generation                              │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                             │
│  ├── Project Service                                       │
│  ├── Task Service                                         │
│  ├── Material Service                                     │
│  └── MCP Service (Future)                                 │
├─────────────────────────────────────────────────────────────┤
│  Command Categories                                        │
│  ├── Project Commands (9 commands)                        │
│  ├── Task Commands (14 commands)                          │
│  ├── Material Commands (17 commands)                      │
│  ├── MCP Commands (Future)                                │
│  ├── AI Commands (Future)                                 │
│  └── Workflow Commands (Future)                           │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. API Endpoint (`/app/api/sylo-core/route.ts`)
- **POST**: Execute commands
- **GET**: Retrieve system information, commands, documentation, health status
- **OPTIONS**: CORS support

### 2. Orchestrator (`orchestrator.ts`)
- Central command execution engine
- Context management
- Error handling and logging
- Health monitoring
- Permission validation

### 3. Command Registry (`command-registry.ts`)
- Dynamic command registration
- Parameter validation
- Documentation generation
- Command categorization

### 4. Service Layer
- **Project Service**: CRUD operations for projects
- **Task Service**: Task management and kanban operations
- **Material Service**: Material library and project assignments

## Available Commands

### Project Commands (9)
- `create_project` - Create a new project
- `update_project` - Update project details
- `delete_project` - Soft delete a project
- `get_project` - Get project by ID
- `list_projects` - List projects with filtering
- `update_project_status` - Change project status
- `assign_team_members` - Assign team members
- `update_project_budget` - Update budget range
- `update_project_timeline` - Update project dates

### Task Commands (14)
- `create_task` - Create a new task
- `update_task` - Update task details
- `delete_task` - Soft delete a task
- `get_task` - Get task by ID
- `list_tasks` - List tasks with filtering
- `update_task_status` - Change task status
- `assign_task` - Assign task to user
- `move_task` - Move task in kanban board
- `set_task_priority` - Set task priority
- `set_task_due_date` - Set task due date
- `set_task_estimated_hours` - Set estimated hours
- `get_subtasks` - Get child tasks
- `get_tasks_by_project` - Get all project tasks
- `get_overdue_tasks` - Get overdue tasks

### Material Commands (17)
- `add_material` - Add material to library
- `update_material` - Update material details
- `remove_material` - Remove material
- `get_material_details` - Get material by ID
- `search_materials` - Search materials
- `list_materials` - List materials with filtering
- `get_materials_by_category` - Filter by category
- `get_materials_by_supplier` - Filter by supplier
- `get_materials_by_sustainability` - Filter by rating
- `get_materials_in_price_range` - Filter by price
- `update_material_specifications` - Update specs
- `update_material_pricing` - Update pricing
- `assign_material_to_project` - Assign to project
- `remove_material_from_project` - Remove from project
- `get_project_materials` - Get project materials
- `get_material_categories` - Get all categories
- `get_material_suppliers` - Get all suppliers

## Usage Examples

### Basic Command Execution

```typescript
// Execute a command via API
const response = await fetch('/api/sylo-core', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    action: 'create_project',
    parameters: {
      name: 'Modern Office Renovation',
      description: 'Complete renovation of office space',
      status: 'planning',
      priority: 'high',
      budget_min: 50000,
      budget_max: 75000
    },
    metadata: {
      requestId: 'req-123'
    }
  })
});

const result = await response.json();
```

### Direct Integration

```typescript
import { executeCommand } from '@/lib/sylo-core';

// Execute command directly
const result = await executeCommand(
  'list_projects',
  { status: 'in_progress', limit: 10 },
  { id: 'user-123', email: 'user@example.com' }
);
```

### Get Available Commands

```typescript
// Get commands available to user
const response = await fetch('/api/sylo-core?action=commands');
const { commands } = await response.json();
```

### System Health Check

```typescript
// Check system health
const response = await fetch('/api/sylo-core?action=health');
const health = await response.json();
```

## Command Structure

### Request Format
```typescript
{
  action: string;           // Command name
  parameters: object;       // Command parameters
  metadata?: {              // Optional metadata
    requestId?: string;
    userId?: string;
    timestamp?: string;
  };
}
```

### Response Format
```typescript
{
  success: boolean;
  data?: any;              // Command result data
  error?: {                // Error information
    code: string;
    message: string;
    details?: any;
  };
  metadata: {              // Response metadata
    requestId: string;
    action: string;
    executionTime: number;
    timestamp: string;
  };
}
```

## Error Codes

- `INVALID_COMMAND` - Invalid command structure
- `MISSING_PARAMETERS` - Required parameters missing
- `VALIDATION_FAILED` - Parameter validation failed
- `UNAUTHORIZED` - Authentication/authorization failed
- `COMMAND_NOT_FOUND` - Command doesn't exist
- `EXECUTION_FAILED` - Command execution error
- `INTERNAL_ERROR` - System error
- `RATE_LIMITED` - Too many requests

## Authentication & Authorization

All commands require authentication. The system supports:
- JWT token authentication
- Role-based access control
- Permission-based command filtering

## Extending Sylo-core

### Adding New Commands

1. Create command handler:
```typescript
export const myCommand: CommandHandler = {
  name: 'my_command',
  description: 'My custom command',
  parameters: [
    {
      name: 'param1',
      type: 'string',
      required: true,
      description: 'Parameter description'
    }
  ],
  async execute(params: any, context: CommandContext) {
    // Command implementation
    return { result: 'success' };
  }
};
```

2. Register command:
```typescript
import { commandRegistry } from '@/lib/sylo-core';

commandRegistry.register('my_command', myCommand, 'custom');
```

### Adding New Services

1. Implement service interface
2. Create service commands
3. Register commands in initialization

## Monitoring & Logging

Sylo-core provides comprehensive logging:
- Command execution logs
- Performance metrics
- Error tracking
- Health monitoring

## Future Enhancements

### Phase 2: MCP Integration
- Pinterest search commands
- SketchUp model generation
- Design asset management

### Phase 3: AI Commands
- Design suggestions
- Project analysis
- Resource optimization
- Timeline prediction

### Phase 4: Workflow Engine
- Multi-step workflows
- Conditional execution
- Scheduled tasks
- Event triggers

### Phase 5: Analytics
- Usage analytics
- Performance reports
- Business intelligence
- Predictive insights

## Development

### Setup
```bash
# Install dependencies
npm install

# Initialize Sylo-core
import { initializeSyloCore } from '@/lib/sylo-core';
initializeSyloCore();
```

### Testing
```bash
# Run tests
npm test

# Test specific command
curl -X POST http://localhost:3000/api/sylo-core \
  -H "Content-Type: application/json" \
  -d '{"action":"get_project","parameters":{"id":"project-123"}}'
```

## Support

For technical support or questions:
- Documentation: `/api/sylo-core?action=documentation`
- Health Status: `/api/sylo-core?action=health`
- Available Commands: `/api/sylo-core?action=commands`

---

**Sylo-core** - Powering AI-driven design management through unified command orchestration.
