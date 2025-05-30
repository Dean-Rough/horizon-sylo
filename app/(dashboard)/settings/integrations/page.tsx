'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Plus, Settings, Trash2, Key, Shield, Activity, Code, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'webhook' | 'service';
  status: 'active' | 'inactive' | 'error';
  permissions: string[];
  endpoints: string[];
  apiKey?: string;
  webhookUrl?: string;
  lastUsed?: string;
  requestCount?: number;
  errorCount?: number;
}

interface CommandCategory {
  name: string;
  description: string;
  commands: string[];
  enabled: boolean;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [commandCategories, setCommandCategories] = useState<CommandCategory[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setIntegrations([
        {
          id: '1',
          name: 'AI Design Assistant',
          description: 'AI-powered design suggestions and analysis',
          type: 'service',
          status: 'active',
          permissions: ['create_project', 'list_projects', 'add_material', 'search_materials'],
          endpoints: ['projects', 'materials'],
          lastUsed: '2024-01-15T10:30:00Z',
          requestCount: 1247,
          errorCount: 3
        },
        {
          id: '2',
          name: 'Pinterest Integration',
          description: 'Search and import design inspiration from Pinterest',
          type: 'api',
          status: 'inactive',
          permissions: ['search_materials', 'add_material'],
          endpoints: ['materials'],
          apiKey: 'pk_test_***************',
          requestCount: 0,
          errorCount: 0
        },
        {
          id: '3',
          name: 'Project Webhook',
          description: 'Receive notifications when projects are updated',
          type: 'webhook',
          status: 'active',
          permissions: ['get_project', 'list_projects'],
          endpoints: ['projects'],
          webhookUrl: 'https://example.com/webhook/projects',
          lastUsed: '2024-01-15T09:15:00Z',
          requestCount: 89,
          errorCount: 1
        }
      ]);

      setCommandCategories([
        {
          name: 'Project Management',
          description: 'Commands for managing projects',
          commands: ['create_project', 'update_project', 'delete_project', 'list_projects'],
          enabled: true
        },
        {
          name: 'Task Management',
          description: 'Commands for managing tasks',
          commands: ['create_task', 'update_task', 'assign_task', 'move_task'],
          enabled: true
        },
        {
          name: 'Material Library',
          description: 'Commands for managing materials',
          commands: ['add_material', 'search_materials', 'assign_material_to_project'],
          enabled: true
        }
      ]);

      setIsLoading(false);
    }, 1000);

    // Fetch system health
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/sylo-core?action=health');
      const health = await response.json();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Key className="h-4 w-4" />;
      case 'webhook': return <Zap className="h-4 w-4" />;
      case 'service': return <Code className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const AddIntegrationDialog = () => {
    const [newIntegration, setNewIntegration] = useState<{
      name: string;
      description: string;
      type: 'api' | 'webhook' | 'service';
      permissions: string[];
      apiKey: string;
      webhookUrl: string;
    }>({
      name: '',
      description: '',
      type: 'api',
      permissions: [],
      apiKey: '',
      webhookUrl: ''
    });

    const handleSubmit = () => {
      const integration: Integration = {
        id: Date.now().toString(),
        ...newIntegration,
        status: 'inactive',
        endpoints: [],
        requestCount: 0,
        errorCount: 0
      };

      setIntegrations(prev => [...prev, integration]);
      setShowAddDialog(false);
      setNewIntegration({
        name: '',
        description: '',
        type: 'api',
        permissions: [],
        apiKey: '',
        webhookUrl: ''
      });
    };

    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
            <DialogDescription>
              Create a new integration to connect external services with Sylo-core
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Integration Name</Label>
                <Input
                  id="name"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Integration"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newIntegration.type}
                  onValueChange={(value) => 
                    setNewIntegration(prev => ({ ...prev, type: value as 'api' | 'webhook' | 'service' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API Integration</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newIntegration.description}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this integration does..."
              />
            </div>

            {newIntegration.type === 'api' && (
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={newIntegration.apiKey}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key..."
                />
              </div>
            )}

            {newIntegration.type === 'webhook' && (
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={newIntegration.webhookUrl}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://example.com/webhook"
                />
              </div>
            )}

            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {commandCategories.map(category => (
                  <div key={category.name} className="space-y-2">
                    <h4 className="font-medium text-sm">{category.name}</h4>
                    {category.commands.map(command => (
                      <div key={command} className="flex items-center space-x-2">
                        <Checkbox
                          id={command}
                          checked={newIntegration.permissions.includes(command)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewIntegration(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, command]
                              }));
                            } else {
                              setNewIntegration(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== command)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={command} className="text-sm">{command}</Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!newIntegration.name}>
              Create Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sylo-core Integrations</h1>
          <p className="text-muted-foreground">
            Manage external integrations and API access to your Sylo-core system
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* System Health Alert */}
      {systemHealth && systemHealth.status !== 'healthy' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            System Status: {systemHealth.status}. Some integrations may be affected.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Active Integrations</TabsTrigger>
          <TabsTrigger value="commands">Command Access</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(integration.type)}
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {integration.type}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`} />
                    <span className="text-sm capitalize">{integration.status}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Permissions</p>
                      <p className="text-muted-foreground">{integration.permissions.length} commands</p>
                    </div>
                    <div>
                      <p className="font-medium">Requests</p>
                      <p className="text-muted-foreground">{integration.requestCount?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium">Errors</p>
                      <p className="text-muted-foreground">{integration.errorCount || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Used</p>
                      <p className="text-muted-foreground">
                        {integration.lastUsed ? new Date(integration.lastUsed).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-wrap gap-1">
                      {integration.permissions.slice(0, 3).map(permission => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {integration.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{integration.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          <div className="grid gap-4">
            {commandCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Switch checked={category.enabled} />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.commands.map(command => (
                      <Badge key={command} variant="outline">
                        {command}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + (i.requestCount || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all integrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {integrations.length} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((integrations.reduce((sum, i) => sum + (i.errorCount || 0), 0) / 
                     Math.max(integrations.reduce((sum, i) => sum + (i.requestCount || 0), 0), 1)) * 100).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {systemHealth && (
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current status of Sylo-core components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Overall Status</span>
                    <Badge variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}>
                      {systemHealth.status}
                    </Badge>
                  </div>
                  {systemHealth.details && Object.entries(systemHealth.details).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <Badge variant={value.status === 'healthy' ? 'default' : 'destructive'}>
                        {value.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AddIntegrationDialog />
    </div>
  );
}
