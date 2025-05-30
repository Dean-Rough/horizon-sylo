import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint to verify Sylo-Core without authentication
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          components: {
            database: 'pending_setup',
            commands: 'ready',
            api: 'ready'
          }
        });

      case 'commands':
        return NextResponse.json({
          commands: [
            {
              name: 'test_command',
              description: 'A simple test command',
              category: 'test',
              parameters: [
                {
                  name: 'message',
                  type: 'string',
                  required: false,
                  description: 'Test message to echo back'
                }
              ]
            },
            {
              name: 'create_project',
              description: 'Create a new project (mock)',
              category: 'project',
              parameters: [
                {
                  name: 'name',
                  type: 'string',
                  required: true,
                  description: 'Project name'
                },
                {
                  name: 'description',
                  type: 'string',
                  required: false,
                  description: 'Project description'
                }
              ]
            },
            {
              name: 'list_projects',
              description: 'List all projects (mock)',
              category: 'project',
              parameters: [
                {
                  name: 'limit',
                  type: 'number',
                  required: false,
                  description: 'Maximum number of projects to return'
                }
              ]
            }
          ]
        });

      default:
        return NextResponse.json({
          error: 'Invalid action',
          available_actions: ['health', 'commands']
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Test Sylo-Core API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, parameters = {}, metadata = {} } = body;

    const startTime = Date.now();
    const requestId = metadata.requestId || `req-${Date.now()}`;

    let result;
    let success = true;

    switch (action) {
      case 'test_command':
        result = {
          message: parameters.message || 'Hello from Sylo-Core!',
          timestamp: new Date().toISOString(),
          echo: parameters
        };
        break;

      case 'create_project':
        if (!parameters.name) {
          success = false;
          result = {
            error: {
              code: 'MISSING_PARAMETERS',
              message: 'Project name is required',
              details: { missing: ['name'] }
            }
          };
        } else {
          result = {
            id: `proj-${Date.now()}`,
            name: parameters.name,
            description: parameters.description || '',
            status: 'planning',
            created_at: new Date().toISOString(),
            mock: true
          };
        }
        break;

      case 'list_projects':
        const limit = parameters.limit || 10;
        result = {
          projects: Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
            id: `proj-${Date.now()}-${i}`,
            name: `Sample Project ${i + 1}`,
            description: `This is a mock project for testing purposes`,
            status: ['planning', 'in_progress', 'completed'][i % 3],
            created_at: new Date(Date.now() - i * 86400000).toISOString(),
            mock: true
          })),
          total: 3,
          limit,
          mock: true
        };
        break;

      default:
        success = false;
        result = {
          error: {
            code: 'COMMAND_NOT_FOUND',
            message: `Command '${action}' not found`,
            details: { available_commands: ['test_command', 'create_project', 'list_projects'] }
          }
        };
    }

    const executionTime = Date.now() - startTime;

    const response = {
      success,
      ...(success ? { data: result } : { error: result.error }),
      metadata: {
        requestId,
        action,
        executionTime,
        timestamp: new Date().toISOString(),
        mock: true
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Test Sylo-Core command execution error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EXECUTION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      metadata: {
        requestId: `req-${Date.now()}`,
        action: 'unknown',
        executionTime: 0,
        timestamp: new Date().toISOString(),
        mock: true
      }
    }, { status: 500 });
  }
}
