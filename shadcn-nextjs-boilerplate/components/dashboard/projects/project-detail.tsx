'use client';

import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import {
  HiArrowLeft,
  HiPencil,
  HiTrash,
  HiShare,
  HiCalendarDays,
  HiCurrencyDollar,
  HiHome,
  HiUser,
  HiPhone,
  HiEnvelope
} from 'react-icons/hi2';
import { Project } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { getProject } from '@/utils/supabase/projects';
import ProjectTimeline from './project-timeline';
import KanbanBoard from '../tasks/kanban-board';
import TeamAssignment from '../shared/team-assignment';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
  projectId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'on_hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function ProjectDetail(props: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const supabase = createClient();

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);

        const projectData = await getProject(supabase, props.projectId);
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [props.projectId]);

  if (loading) {
    return (
      <DashboardLayout
        user={props.user}
        userDetails={props.userDetails}
        title="Loading..."
        description="Loading project details"
      >
        <div className="text-center py-12">
          <p className="circular-light text-muted-foreground">Loading project...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout
        user={props.user}
        userDetails={props.userDetails}
        title="Project Not Found"
        description="Unable to load project details"
      >
        <div className="text-center py-12">
          <p className="circular-light text-red-500">{error || 'Project not found'}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            <HiArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title={project.name}
      description="Project details and management"
    >
      <div className="h-full w-full">
        {/* Header */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            PROJECT
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                <HiArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="circular-bold text-3xl text-foreground mb-2">
                  {project.name}
                </h1>
                <p className="circular-light text-lg text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                  {project.project_type && (
                    <Badge variant="outline">
                      {project.project_type}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <HiShare className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <HiPencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <HiTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="circular-bold">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="circular-light text-sm text-muted-foreground">Start Date</label>
                        <p className="circular-bold">
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="circular-light text-sm text-muted-foreground">Target Completion</label>
                        <p className="circular-bold">
                          {project.target_completion_date ? new Date(project.target_completion_date).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      {project.budget_min && (
                        <>
                          <div>
                            <label className="circular-light text-sm text-muted-foreground">Budget Range</label>
                            <p className="circular-bold">
                              ${project.budget_min.toLocaleString()} - ${project.budget_max?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <label className="circular-light text-sm text-muted-foreground">Square Footage</label>
                            <p className="circular-bold">
                              {project.square_footage?.toLocaleString()} sq ft
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {project.address && (
                      <div>
                        <label className="circular-light text-sm text-muted-foreground">Location</label>
                        <p className="circular-bold">
                          {project.address}
                          {project.city && project.state && (
                            <span>, {project.city}, {project.state}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Team Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="circular-bold">Team Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="circular-light text-sm text-muted-foreground mb-2 block">
                        Project Lead
                      </label>
                      <TeamAssignment
                        assignedTo={project.assigned_to || undefined}
                        mode="single"
                        onAssignedToChange={(userId) => {
                          // In a real app, this would update the project
                          console.log('Assign project lead:', userId);
                        }}
                      />
                    </div>

                    <div>
                      <label className="circular-light text-sm text-muted-foreground mb-2 block">
                        Team Members
                      </label>
                      <TeamAssignment
                        teamMembers={project.team_members || []}
                        mode="multiple"
                        onTeamMembersChange={(userIds) => {
                          // In a real app, this would update the project
                          console.log('Update team members:', userIds);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Information */}
              <div className="space-y-6">
                {project.client && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="circular-bold flex items-center gap-2">
                        <HiUser className="h-5 w-5" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="circular-bold">
                          {project.client.company_name ||
                           `${project.client.first_name} ${project.client.last_name}`}
                        </h4>
                        {project.client.company_name && (
                          <p className="circular-light text-sm text-muted-foreground">
                            {project.client.first_name} {project.client.last_name}
                          </p>
                        )}
                      </div>

                      {project.client.email && (
                        <div className="flex items-center gap-2">
                          <HiEnvelope className="h-4 w-4 text-muted-foreground" />
                          <span className="circular-light text-sm">{project.client.email}</span>
                        </div>
                      )}

                      {project.client.phone && (
                        <div className="flex items-center gap-2">
                          <HiPhone className="h-4 w-4 text-muted-foreground" />
                          <span className="circular-light text-sm">{project.client.phone}</span>
                        </div>
                      )}

                      <Badge variant="outline">
                        {project.client.client_type}
                      </Badge>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="circular-bold">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Created</span>
                      <span className="circular-bold text-sm">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Last Updated</span>
                      <span className="circular-bold text-sm">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <ProjectTimeline projectId={project.id} />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="circular-bold">Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="circular-light text-muted-foreground">
                    File management coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
