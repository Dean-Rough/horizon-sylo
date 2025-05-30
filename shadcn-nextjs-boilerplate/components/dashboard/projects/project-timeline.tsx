'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  HiCalendarDays,
  HiClock,
  HiFlag,
  HiCheckCircle,
  HiExclamationTriangle,
  HiEye
} from 'react-icons/hi2';
import { Project, Task } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { getProject } from '@/utils/supabase/projects';
import { getProjectTasks } from '@/utils/supabase/tasks';

interface ProjectTimelineProps {
  projectId: string;
}

// Mock timeline data for development
const mockTimelineData = {
  project: {
    id: 'project1',
    name: 'Modern Downtown Loft',
    start_date: '2024-01-15',
    target_completion_date: '2024-04-15',
    status: 'in_progress',
    progress: 65
  },
  milestones: [
    {
      id: '1',
      title: 'Design Phase Complete',
      date: '2024-02-15',
      status: 'completed',
      description: 'Initial design concepts and mood boards approved'
    },
    {
      id: '2',
      title: 'Procurement Phase',
      date: '2024-03-01',
      status: 'in_progress',
      description: 'Sourcing furniture and materials'
    },
    {
      id: '3',
      title: 'Installation Begins',
      date: '2024-03-15',
      status: 'upcoming',
      description: 'Start of physical installation work'
    },
    {
      id: '4',
      title: 'Project Completion',
      date: '2024-04-15',
      status: 'upcoming',
      description: 'Final walkthrough and project delivery'
    }
  ],
  recentTasks: [
    {
      id: '1',
      title: 'Create mood board',
      status: 'completed',
      completed_at: '2024-01-22',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Source furniture options',
      status: 'in_progress',
      due_date: '2024-01-30',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Client presentation prep',
      status: 'review',
      due_date: '2024-01-28',
      priority: 'high'
    }
  ]
};

const getMilestoneIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <HiCheckCircle className="h-5 w-5 text-green-500" />;
    case 'in_progress':
      return <HiClock className="h-5 w-5 text-blue-500" />;
    case 'upcoming':
      return <HiCalendarDays className="h-5 w-5 text-gray-400" />;
    case 'overdue':
      return <HiExclamationTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <HiCalendarDays className="h-5 w-5 text-gray-400" />;
  }
};

const getMilestoneColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700';
    case 'in_progress':
      return 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700';
    case 'upcoming':
      return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600';
    case 'overdue':
      return 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700';
    default:
      return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getPriorityIcon = (priority: string) => {
  if (priority === 'high' || priority === 'urgent') {
    return <HiFlag className="h-3 w-3 text-red-500" />;
  }
  return null;
};

export default function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjectData() {
      try {
        setLoading(true);
        setError(null);
        
        const [projectData, tasksData] = await Promise.all([
          getProject(supabase, projectId),
          getProjectTasks(supabase, projectId)
        ]);
        
        setProject(projectData);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching project timeline:', err);
        setError('Failed to load project timeline');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="circular-light text-muted-foreground">Loading timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="circular-light text-red-500">{error}</p>
        <p className="circular-light text-sm text-muted-foreground mt-2">
          Showing sample timeline instead
        </p>
      </div>
    );
  }

  // Use mock data for now since we don't have milestone data structure yet
  const timelineData = mockTimelineData;

  // Calculate project progress
  const totalDays = project?.start_date && project?.target_completion_date 
    ? Math.ceil((new Date(project.target_completion_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 90;
  
  const daysPassed = project?.start_date 
    ? Math.ceil((new Date().getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 30;
  
  const progressPercentage = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="circular-bold flex items-center gap-2">
            <HiCalendarDays className="h-5 w-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="circular-bold text-lg">{project?.name || timelineData.project.name}</h3>
                <p className="circular-light text-sm text-muted-foreground">
                  {project?.start_date && new Date(project.start_date).toLocaleDateString()} - {project?.target_completion_date && new Date(project.target_completion_date).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getStatusColor(project?.status || 'in_progress')}>
                {project?.status?.replace('_', ' ') || 'In Progress'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="circular-light text-muted-foreground">Progress</span>
                <span className="circular-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="circular-bold">Project Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineData.milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full border-2 ${getMilestoneColor(milestone.status)}`}>
                    {getMilestoneIcon(milestone.status)}
                  </div>
                  {index < timelineData.milestones.length - 1 && (
                    <div className="w-px h-12 bg-border mt-2" />
                  )}
                </div>
                
                {/* Milestone Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="circular-bold text-sm">{milestone.title}</h4>
                    <span className="circular-light text-xs text-muted-foreground">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="circular-light text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Task Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="circular-bold">Recent Task Activity</CardTitle>
            <Button variant="outline" size="sm">
              <HiEye className="h-4 w-4 mr-2" />
              View All Tasks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(tasks.slice(0, 5) || timelineData.recentTasks).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(task.priority)}
                  <div>
                    <h4 className="circular-bold text-sm">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status.replace('_', ' ')}
                      </Badge>
                      {task.due_date && (
                        <span className="circular-light text-xs text-muted-foreground">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                      {task.completed_at && (
                        <span className="circular-light text-xs text-muted-foreground">
                          Completed: {new Date(task.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!tasks || tasks.length === 0) && timelineData.recentTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="circular-light text-sm">No recent task activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
