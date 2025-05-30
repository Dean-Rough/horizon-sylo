'use client';

import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { HiUser, HiSparkles, HiCog6Tooth, HiCommandLine } from 'react-icons/hi2';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

interface CommandResult {
  success: boolean;
  data?: any;
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

interface AvailableCommand {
  name: string;
  description: string;
  category: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

export default function SyloCoreChat(props: Props) {
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [commandParams, setCommandParams] = useState<string>('{}');
  const [result, setResult] = useState<CommandResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableCommands, setAvailableCommands] = useState<AvailableCommand[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [commandHistory, setCommandHistory] = useState<CommandResult[]>([]);

  // Load available commands and system info on mount
  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    try {
      // Get available commands
      const commandsResponse = await fetch('/api/sylo-core?action=commands');
      if (commandsResponse.ok) {
        const commandsData = await commandsResponse.json();
        setAvailableCommands(commandsData.commands || []);
      }

      // Get system health
      const healthResponse = await fetch('/api/sylo-core?action=health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setSystemHealth(healthData);
      }
    } catch (error) {
      console.error('Error loading system info:', error);
    }
  };

  const executeCommand = async () => {
    if (!selectedCommand) {
      alert('Please select a command');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let parameters = {};
      if (commandParams.trim()) {
        parameters = JSON.parse(commandParams);
      }

      const response = await fetch('/api/sylo-core', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: selectedCommand,
          parameters,
          metadata: {
            requestId: `req-${Date.now()}`,
            userId: props.user?.id,
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await response.json();
      setResult(data);
      setCommandHistory(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error) {
      const errorResult: CommandResult = {
        success: false,
        error: {
          code: 'CLIENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          requestId: `req-${Date.now()}`,
          action: selectedCommand,
          executionTime: 0,
          timestamp: new Date().toISOString()
        }
      };
      setResult(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const getCommandsByCategory = () => {
    const categories: { [key: string]: AvailableCommand[] } = {};
    availableCommands.forEach(cmd => {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push(cmd);
    });
    return categories;
  };

  const selectedCommandInfo = availableCommands.find(cmd => cmd.name === selectedCommand);

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Sylo-Core Testing Interface"
      description="Test and debug Sylo-Core commands and database integration"
    >
      <div className="flex w-full flex-col space-y-6 p-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiCog6Tooth className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {availableCommands.length}
                </div>
                <div className="text-sm text-gray-600">Available Commands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {systemHealth?.status === 'healthy' ? '✓' : '⚠'}
                </div>
                <div className="text-sm text-gray-600">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {commandHistory.length}
                </div>
                <div className="text-sm text-gray-600">Commands Executed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="execute" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="execute">Execute Commands</TabsTrigger>
            <TabsTrigger value="commands">Browse Commands</TabsTrigger>
            <TabsTrigger value="history">Command History</TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Command Execution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HiCommandLine className="h-5 w-5" />
                    Execute Command
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Command</label>
                    <select
                      className="w-full mt-1 p-2 border rounded-md"
                      value={selectedCommand}
                      onChange={(e) => setSelectedCommand(e.target.value)}
                    >
                      <option value="">Choose a command...</option>
                      {Object.entries(getCommandsByCategory()).map(([category, commands]) => (
                        <optgroup key={category} label={category.toUpperCase()}>
                          {commands.map(cmd => (
                            <option key={cmd.name} value={cmd.name}>
                              {cmd.name} - {cmd.description}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {selectedCommandInfo && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium">{selectedCommandInfo.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{selectedCommandInfo.description}</p>
                      <div className="text-xs">
                        <strong>Parameters:</strong>
                        {selectedCommandInfo.parameters.length === 0 ? (
                          <span className="ml-1 text-gray-500">None</span>
                        ) : (
                          <ul className="mt-1 space-y-1">
                            {selectedCommandInfo.parameters.map(param => (
                              <li key={param.name} className="flex items-center gap-2">
                                <code className="bg-gray-200 px-1 rounded">{param.name}</code>
                                <span className="text-gray-600">({param.type})</span>
                                {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                                <span className="text-gray-500">- {param.description}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Parameters (JSON)</label>
                    <textarea
                      className="w-full mt-1 p-2 border rounded-md font-mono text-sm"
                      rows={4}
                      value={commandParams}
                      onChange={(e) => setCommandParams(e.target.value)}
                      placeholder='{"key": "value"}'
                    />
                  </div>

                  <Button
                    onClick={executeCommand}
                    disabled={loading || !selectedCommand}
                    className="w-full"
                  >
                    {loading ? 'Executing...' : 'Execute Command'}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? 'Success' : 'Error'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {result.metadata.executionTime}ms
                        </span>
                      </div>

                      {result.success && result.data && (
                        <div>
                          <h4 className="font-medium mb-2">Data:</h4>
                          <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-64">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {result.error && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Error:</h4>
                          <div className="bg-red-50 p-3 rounded-md">
                            <div className="text-sm">
                              <strong>Code:</strong> {result.error.code}
                            </div>
                            <div className="text-sm">
                              <strong>Message:</strong> {result.error.message}
                            </div>
                            {result.error.details && (
                              <pre className="text-xs mt-2 overflow-auto">
                                {JSON.stringify(result.error.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Request ID: {result.metadata.requestId}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Execute a command to see results here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Available Commands ({availableCommands.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {Object.entries(getCommandsByCategory()).map(([category, commands]) => (
                    <div key={category} className="mb-6">
                      <h3 className="font-semibold text-lg mb-3 text-blue-600">
                        {category.toUpperCase()} ({commands.length})
                      </h3>
                      <div className="grid gap-3">
                        {commands.map(cmd => (
                          <div key={cmd.name} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {cmd.name}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedCommand(cmd.name)}
                              >
                                Use Command
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{cmd.description}</p>
                            {cmd.parameters.length > 0 && (
                              <div className="text-xs">
                                <strong>Parameters:</strong> {cmd.parameters.map(p => p.name).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Command History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {commandHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No commands executed yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {commandHistory.map((cmd, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <code className="font-mono text-sm">{cmd.metadata.action}</code>
                            <div className="flex items-center gap-2">
                              <Badge variant={cmd.success ? "default" : "destructive"}>
                                {cmd.success ? 'Success' : 'Error'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(cmd.metadata.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          {cmd.error && (
                            <div className="text-sm text-red-600">
                              {cmd.error.message}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
