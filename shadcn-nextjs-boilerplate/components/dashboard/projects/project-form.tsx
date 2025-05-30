'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, CreateProjectData, Client } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { getClients } from '@/utils/supabase/clients';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' }
];

const PROJECT_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const PROJECT_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'retail', label: 'Retail' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' }
];

export default function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    priority: project?.priority || 'medium',
    client_id: project?.client_id || '',
    project_type: project?.project_type || '',
    budget_min: project?.budget_min || undefined,
    budget_max: project?.budget_max || undefined,
    square_footage: project?.square_footage || undefined,
    start_date: project?.start_date || '',
    target_completion_date: project?.target_completion_date || '',
    address: project?.address || '',
    city: project?.city || '',
    state: project?.state || '',
    zip_code: project?.zip_code || '',
    country: project?.country || 'US',
    assigned_to: project?.assigned_to || '',
    team_members: project?.team_members || []
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const supabase = createClient();

  // Fetch clients for selection
  useEffect(() => {
    async function fetchClients() {
      try {
        const result = await getClients(supabase, undefined, undefined, 1, 100);
        setClients(result.clients);
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        setLoadingClients(false);
      }
    }

    fetchClients();
  }, []);

  const handleInputChange = (field: keyof CreateProjectData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="circular-bold text-xl">
          {project ? 'Edit Project' : 'New Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="circular-bold">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="circular-light"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <Label className="circular-bold">Client</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => handleInputChange('client_id', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {loadingClients ? (
                    <SelectItem value="" disabled>Loading clients...</SelectItem>
                  ) : (
                    clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name || `${client.first_name} ${client.last_name}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="circular-bold">Project Type</Label>
              <Select
                value={formData.project_type}
                onValueChange={(value) => handleInputChange('project_type', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="circular-bold">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Project description..."
              className="circular-light"
              rows={3}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="circular-bold">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="circular-bold">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_PRIORITIES.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="budget_min" className="circular-bold">Budget Min ($)</Label>
              <Input
                id="budget_min"
                type="number"
                value={formData.budget_min || ''}
                onChange={(e) => handleInputChange('budget_min', e.target.value ? parseInt(e.target.value) : undefined)}
                className="circular-light"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="budget_max" className="circular-bold">Budget Max ($)</Label>
              <Input
                id="budget_max"
                type="number"
                value={formData.budget_max || ''}
                onChange={(e) => handleInputChange('budget_max', e.target.value ? parseInt(e.target.value) : undefined)}
                className="circular-light"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="square_footage" className="circular-bold">Square Footage</Label>
              <Input
                id="square_footage"
                type="number"
                value={formData.square_footage || ''}
                onChange={(e) => handleInputChange('square_footage', e.target.value ? parseInt(e.target.value) : undefined)}
                className="circular-light"
                placeholder="0"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="circular-bold">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="target_completion_date" className="circular-bold">Target Completion</Label>
              <Input
                id="target_completion_date"
                type="date"
                value={formData.target_completion_date}
                onChange={(e) => handleInputChange('target_completion_date', e.target.value)}
                className="circular-light"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="circular-bold">Project Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="circular-light"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="circular-bold">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="state" className="circular-bold">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="zip_code" className="circular-bold">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                className="circular-light"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="circular-bold">
              {isLoading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="circular-bold">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}