'use client';

import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiViewColumns,
  HiListBullet
} from 'react-icons/hi2';
import KanbanBoard from './kanban-board';
import TaskForm from './task-form';
import { createClient } from '@/utils/supabase/client';
import { getProjects } from '@/utils/supabase/projects';
import { createTask, updateTask } from '@/utils/supabase/tasks';
import { Project, Task, CreateTaskData } from '@/types/database';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

export default function Tasks(props: Props) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  // Fetch projects for the dropdown
  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await getProjects(supabase);
        setProjects(result.projects);
        // Auto-select first project if available
        if (result.projects.length > 0) {
          setSelectedProject(result.projects[0].id);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        // Use mock project for demo
        setSelectedProject('project1');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Handler functions
  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      setIsSubmitting(true);
      await createTask(supabase, taskData);
      setShowTaskForm(false);
      setSelectedTask(null);
      // Refresh the kanban board by triggering a re-render
    } catch (err) {
      console.error('Error creating task:', err);
      // Handle error (could show toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: CreateTaskData) => {
    if (!selectedTask) return;
    
    try {
      setIsSubmitting(true);
      await updateTask(supabase, selectedTask.id, taskData);
      setShowTaskForm(false);
      setSelectedTask(null);
      // Refresh the kanban board by triggering a re-render
    } catch (err) {
      console.error('Error updating task:', err);
      // Handle error (could show toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Tasks"
      description="Manage project tasks and workflows"
    >
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            TASKS
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="circular-bold text-3xl text-foreground mb-2">
                Task Management
              </h1>
              <p className="circular-light text-lg text-muted-foreground">
                Organize and track project tasks with Kanban workflow
              </p>
            </div>
            <Button onClick={handleNewTask} className="circular-bold">
              <HiPlus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Project Selection */}
          <div className="flex-1">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
                {/* Fallback for demo */}
                {projects.length === 0 && (
                  <SelectItem value="project1">Modern Downtown Loft</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Controls */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <HiViewColumns className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <HiListBullet className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button variant="outline" size="sm">
              <HiAdjustmentsHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="circular-light text-muted-foreground">Loading tasks...</p>
          </div>
        )}

        {/* No Project Selected */}
        {!loading && selectedProject === 'all' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="circular-bold text-lg mb-2">Select a Project</h3>
              <p className="circular-light text-muted-foreground">
                Choose a project to view and manage its tasks
              </p>
            </div>
          </div>
        )}

        {/* Task Views */}
        {!loading && selectedProject !== 'all' && (
          <div className="flex-1 overflow-hidden">
            {viewMode === 'kanban' ? (
              <KanbanBoard projectId={selectedProject} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="circular-bold text-lg mb-2">List View</h3>
                  <p className="circular-light text-muted-foreground">
                    List view coming soon! Use Kanban view for now.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'Edit Task' : 'New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask || undefined}
            projectId={selectedProject !== 'all' ? selectedProject : undefined}
            onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseTaskForm}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
