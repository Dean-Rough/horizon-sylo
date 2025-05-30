'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  HiPlus,
  HiEllipsisVertical,
  HiClock,
  HiUser,
  HiFlag
} from 'react-icons/hi2';
import { Task } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { getTasksByProject } from '@/utils/supabase/tasks';
import TeamAssignment from '../shared/team-assignment';

interface KanbanBoardProps {
  projectId: string;
}

// Mock tasks for now - will be replaced with real data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Create mood board',
    description: 'Gather inspiration images and create initial mood board for client review',
    status: 'todo',
    priority: 'high',
    project_id: 'project1',
    created_by: 'user1',
    due_date: '2024-01-25',
    estimated_hours: 4,
    task_type: 'design',
    tags: ['creative', 'client-facing'],
    board_column: 'todo',
    position: 0,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Source furniture options',
    description: 'Research and compile furniture options within budget range',
    status: 'in_progress',
    priority: 'medium',
    project_id: 'project1',
    created_by: 'user1',
    assigned_to: 'user1',
    due_date: '2024-01-30',
    estimated_hours: 8,
    actual_hours: 3,
    task_type: 'procurement',
    tags: ['research', 'budget'],
    board_column: 'in_progress',
    position: 0,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z'
  },
  {
    id: '3',
    title: 'Client presentation prep',
    description: 'Prepare presentation materials for client meeting',
    status: 'review',
    priority: 'high',
    project_id: 'project1',
    created_by: 'user1',
    assigned_to: 'user1',
    due_date: '2024-01-28',
    estimated_hours: 3,
    actual_hours: 2.5,
    task_type: 'client_meeting',
    tags: ['presentation', 'client-facing'],
    board_column: 'review',
    position: 0,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-23T00:00:00Z'
  },
  {
    id: '4',
    title: 'Install lighting fixtures',
    description: 'Coordinate with electrician for pendant light installation',
    status: 'completed',
    priority: 'medium',
    project_id: 'project1',
    created_by: 'user1',
    assigned_to: 'user1',
    due_date: '2024-01-20',
    estimated_hours: 6,
    actual_hours: 5.5,
    task_type: 'installation',
    tags: ['coordination', 'electrical'],
    board_column: 'completed',
    position: 0,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    completed_at: '2024-01-20T00:00:00Z'
  }
];

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100 dark:bg-green-900' }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getPriorityIcon = (priority: string) => {
  const iconClass = "h-3 w-3";
  switch (priority) {
    case 'urgent': return <HiFlag className={`${iconClass} text-red-500`} />;
    case 'high': return <HiFlag className={`${iconClass} text-orange-500`} />;
    default: return null;
  }
};

const getTaskTypeColor = (type: string) => {
  switch (type) {
    case 'design': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'procurement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'installation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'client_meeting': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError(null);

        const tasks = await getTasksByProject(supabase, projectId);
        setTasksByColumn(tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
        // Fallback to mock data
        const mockTasksByColumn = mockTasks.reduce((acc, task) => {
          if (!acc[task.board_column]) {
            acc[task.board_column] = [];
          }
          acc[task.board_column].push(task);
          return acc;
        }, {} as Record<string, Task[]>);
        setTasksByColumn(mockTasksByColumn);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="circular-light text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="circular-light text-red-500">{error}</p>
        <p className="circular-light text-sm text-muted-foreground mt-2">
          Showing sample data instead
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`${column.color} rounded-lg p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <h3 className="circular-bold text-sm font-medium">
                  {column.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {tasksByColumn[column.id]?.length || 0}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <HiPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3">
              {tasksByColumn[column.id]?.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="circular-bold text-sm leading-tight">
                        {task.title}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <HiEllipsisVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {task.description && (
                      <p className="circular-light text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Task Meta */}
                    <div className="space-y-2">
                      {/* Priority and Type */}
                      <div className="flex gap-1 flex-wrap">
                        {getPriorityIcon(task.priority)}
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                        {task.task_type && (
                          <Badge className={getTaskTypeColor(task.task_type)} variant="outline">
                            {task.task_type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>

                      {/* Due Date and Hours */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {task.due_date && (
                          <div className="flex items-center gap-1">
                            <HiClock className="h-3 w-3" />
                            <span className="circular-light">
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {task.estimated_hours && (
                          <div className="circular-light">
                            {task.actual_hours ? `${task.actual_hours}/${task.estimated_hours}h` : `${task.estimated_hours}h`}
                          </div>
                        )}
                      </div>

                      {/* Assignee */}
                      <div className="flex items-center justify-between">
                        <TeamAssignment
                          assignedTo={task.assigned_to || undefined}
                          mode="single"
                          size="sm"
                          onAssignedToChange={(userId) => {
                            // In a real app, this would update the task
                            console.log('Assign task to:', userId);
                          }}
                        />
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty State */}
              {(!tasksByColumn[column.id] || tasksByColumn[column.id].length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="circular-light text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
