'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, CreateTaskData, Project } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { getProjects } from '@/utils/supabase/projects';

interface TaskFormProps {
  task?: Task;
  projectId?: string;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TASK_STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' }
];

const TASK_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const TASK_TYPES = [
  { value: 'design', label: 'Design' },
  { value: 'planning', label: 'Planning' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'installation', label: 'Installation' },
  { value: 'review', label: 'Review' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Other' }
];

const BOARD_COLUMNS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
];

export default function TaskForm({ task, projectId, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    project_id: task?.project_id || projectId || '',
    task_type: task?.task_type || '',
    due_date: task?.due_date || '',
    estimated_hours: task?.estimated_hours || undefined,
    assigned_to: task?.assigned_to || '',
    board_column: task?.board_column || 'todo',
    position: task?.position || 0,
    parent_task_id: task?.parent_task_id || undefined
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const supabase = createClient();

  // Fetch projects for selection
  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await getProjects(supabase, undefined, undefined, 1, 100);
        setProjects(result.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  const handleInputChange = (field: keyof CreateTaskData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="circular-bold text-xl">
          {task ? 'Edit Task' : 'New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <Label htmlFor="title" className="circular-bold">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              className="circular-light"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <Label htmlFor="description" className="circular-bold">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Task description..."
              className="circular-light"
              rows={3}
            />
          </div>

          {/* Project and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="circular-bold">Project *</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => handleInputChange('project_id', value)}
                required
              >
                <SelectTrigger className="circular-light">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {loadingProjects ? (
                    <SelectItem value="" disabled>Loading projects...</SelectItem>
                  ) : (
                    projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="circular-bold">Task Type</Label>
              <Select
                value={formData.task_type}
                onValueChange={(value) => handleInputChange('task_type', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {TASK_STATUSES.map(status => (
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
                  {TASK_PRIORITIES.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="circular-bold">Board Column</Label>
              <Select
                value={formData.board_column}
                onValueChange={(value) => handleInputChange('board_column', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOARD_COLUMNS.map(column => (
                    <SelectItem key={column.value} value={column.value}>
                      {column.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Tracking */}
          <div>
            <Label htmlFor="estimated_hours" className="circular-bold">Estimated Hours</Label>
            <Input
              id="estimated_hours"
              type="number"
              step="0.5"
              value={formData.estimated_hours || ''}
              onChange={(e) => handleInputChange('estimated_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="circular-light"
              placeholder="0"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="due_date" className="circular-bold">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              className="circular-light"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="circular-bold">
              {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
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