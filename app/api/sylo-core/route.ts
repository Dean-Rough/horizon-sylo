import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase';
import { orchestrator } from '@/lib/sylo-core/orchestrator';
import { initializeCommands, getAllCommandDocumentation } from '@/lib/sylo-core/commands';
import type { SyloCoreCommand, SyloCoreResponse } from '@/types/sylo-core';

// Initialize commands on module load
initializeCommands();

/**
 * POST /api/sylo-core
 * Execute a command through the Sylo-core orchestration engine
 */
export async function POST(req: NextRequest): Promise<NextResponse<SyloCoreResponse>> {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        },
        metadata: {
          requestId: 'unknown',
          action: 'unknown',
          executionTime: 0,
          timestamp: new Date().toISOString()
        }
      }, { status: 401 });
    }

    // Parse request body
    let command: SyloCoreCommand;
    try {
      command = await req.json();
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_COMMAND',
          message: 'Invalid JSON in request body'
        },
        metadata: {
          requestId: 'unknown',
          action: 'unknown',
          executionTime: 0,
          timestamp: new Date().toISOString()
        }
      }, { status: 400 });
    }

    // Validate command structure
    if (!command.action || typeof command.action !== 'string') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_COMMAND',
          message: 'Command must have a valid action field'
        },
        metadata: {
          requestId: command.metadata?.requestId || 'unknown',
          action: 'unknown',
          executionTime: 0,
          timestamp: new Date().toISOString()
        }
      }, { status: 400 });
    }

    if (!command.parameters || typeof command.parameters !== 'object') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_COMMAND',
          message: 'Command must have a parameters object'
        },
        metadata: {
          requestId: command.metadata?.requestId || 'unknown',
          action: command.action,
          executionTime: 0,
          timestamp: new Date().toISOString()
        }
      }, { status: 400 });
    }

    // Execute command through orchestrator
    const result = await orchestrator.execute(command, {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    });

    // Return appropriate HTTP status based on result
    const status = result.success ? 200 : 
                  result.error?.code === 'UNAUTHORIZED' ? 401 :
                  result.error?.code === 'COMMAND_NOT_FOUND' ? 404 :
                  result.error?.code === 'VALIDATION_FAILED' ? 400 :
                  result.error?.code === 'RATE_LIMITED' ? 429 :
                  500;

    return NextResponse.json(result, { status });

  } catch (error) {
    console.error('[Sylo-core API] Unexpected error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      },
      metadata: {
        requestId: 'unknown',
        action: 'unknown',
        executionTime: 0,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/sylo-core
 * Get available commands and system information
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Handle different GET actions
    switch (action) {
      case 'commands':
        // Get available commands for authenticated user
        const { user, error: authError } = await getAuthenticatedUser();
        if (authError || !user) {
          return NextResponse.json({
            error: 'Authentication required'
          }, { status: 401 });
        }

        const availableCommands = await orchestrator.getAvailableCommands({
          id: user.id,
          email: user.email,
          role: user.role || 'user'
        });

        return NextResponse.json({
          commands: availableCommands,
          total: Object.keys(availableCommands).length
        });

      case 'documentation':
        // Get full command documentation
        const documentation = getAllCommandDocumentation();
        return NextResponse.json({
          documentation,
          total: Object.keys(documentation).length,
          categories: {
            project: Object.values(documentation).filter((cmd: any) => cmd.category === 'project').length,
            task: Object.values(documentation).filter((cmd: any) => cmd.category === 'task').length,
            material: Object.values(documentation).filter((cmd: any) => cmd.category === 'material').length,
            mcp: Object.values(documentation).filter((cmd: any) => cmd.category === 'mcp').length,
            ai: Object.values(documentation).filter((cmd: any) => cmd.category === 'ai').length,
            workflow: Object.values(documentation).filter((cmd: any) => cmd.category === 'workflow').length,
            analytics: Object.values(documentation).filter((cmd: any) => cmd.category === 'analytics').length,
            system: Object.values(documentation).filter((cmd: any) => cmd.category === 'system').length
          }
        });

      case 'health':
        // Get system health status
        const healthStatus = await orchestrator.healthCheck();
        const httpStatus = healthStatus.status === 'healthy' ? 200 :
                          healthStatus.status === 'degraded' ? 200 :
                          503;
        
        return NextResponse.json(healthStatus, { status: httpStatus });

      default:
        // Default: return basic system information
        return NextResponse.json({
          name: 'Sylo-core AI Orchestration Engine',
          version: '1.0.0',
          status: 'operational',
          endpoints: {
            execute: 'POST /api/sylo-core',
            commands: 'GET /api/sylo-core?action=commands',
            documentation: 'GET /api/sylo-core?action=documentation',
            health: 'GET /api/sylo-core?action=health'
          },
          timestamp: new Date().toISOString()
        });
    }

  } catch (error) {
    console.error('[Sylo-core API] GET error:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/sylo-core
 * Handle CORS preflight requests
 */
export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
