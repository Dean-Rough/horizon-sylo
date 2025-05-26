'use client';

import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { 
  HiPlus, 
  HiMagnifyingGlass, 
  HiEye, 
  HiPencil, 
  HiTrash,
  HiHome,
  HiOfficeBuilding,
  HiWrenchScrewdriver
} from 'react-icons/hi2';
import { Project } from '@/types/database';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

// Mock data for now - will be replaced with real Supabase data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Downtown Loft',
    description: 'Complete renovation of a 2-bedroom loft in downtown area',
    status: 'in_progress',
    priority: 'high',
    project_type: 'residential',
    budget_min: 50000,
    budget_max: 75000,
    square_footage: 1200,
    start_date: '2024-01-15',
    target_completion_date: '2024-04-15',
    address: '123 Main St, Downtown',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    created_by: 'user1',
    assigned_to: 'user1',
    team_members: [],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    client: {
      id: 'client1',
      first_name: 'Sarah',
      last_name: 'Johnson',
      company_name: '',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      client_type: 'individual',
      preferred_contact_method: 'email',
      tags: [],
      created_by: 'user1',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z',
      country: 'US'
    }
  },
  {
    id: '2',
    name: 'Corporate Office Redesign',
    description: 'Modern office space design for tech startup',
    status: 'planning',
    priority: 'medium',
    project_type: 'commercial',
    budget_min: 100000,
    budget_max: 150000,
    square_footage: 5000,
    start_date: '2024-03-01',
    target_completion_date: '2024-06-01',
    address: '456 Tech Blvd',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    created_by: 'user1',
    assigned_to: 'user1',
    team_members: [],
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    client: {
      id: 'client2',
      first_name: 'Mike',
      last_name: 'Chen',
      company_name: 'TechFlow Inc',
      email: 'mike@techflow.com',
      phone: '(555) 987-6543',
      client_type: 'business',
      preferred_contact_method: 'email',
      tags: ['tech', 'startup'],
      created_by: 'user1',
      created_at: '2024-01-25T00:00:00Z',
      updated_at: '2024-01-25T00:00:00Z',
      country: 'US'
    }
  }
];

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

const getProjectTypeIcon = (type: string) => {
  switch (type) {
    case 'residential': return <HiHome className="h-4 w-4" />;
    case 'commercial': return <HiOfficeBuilding className="h-4 w-4" />;
    case 'renovation': return <HiWrenchScrewdriver className="h-4 w-4" />;
    default: return <HiHome className="h-4 w-4" />;
  }
};

export default function Projects(props: Props) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Projects"
      description="Manage your design projects"
    >
      <div className="h-full w-full">
        {/* Header */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            PROJECTS
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="circular-bold text-3xl text-foreground mb-2">
                Design Projects
              </h1>
              <p className="circular-light text-lg text-muted-foreground">
                Manage and track your interior design projects
              </p>
            </div>
            <Button className="circular-bold">
              <HiPlus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, clients, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getProjectTypeIcon(project.project_type || 'residential')}
                    <CardTitle className="circular-bold text-lg">{project.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <HiEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="circular-light text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="circular-light text-muted-foreground">Client:</span>
                    <span className="circular-bold">
                      {project.client?.company_name || 
                       `${project.client?.first_name} ${project.client?.last_name}`}
                    </span>
                  </div>
                  
                  {project.budget_min && (
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Budget:</span>
                      <span className="circular-bold">
                        ${project.budget_min.toLocaleString()} - ${project.budget_max?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {project.square_footage && (
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Size:</span>
                      <span className="circular-bold">{project.square_footage.toLocaleString()} sq ft</span>
                    </div>
                  )}
                  
                  {project.target_completion_date && (
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Due:</span>
                      <span className="circular-bold">
                        {new Date(project.target_completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="circular-light text-muted-foreground">
              {searchTerm ? 'No projects found matching your search.' : 'No projects yet. Create your first project!'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
