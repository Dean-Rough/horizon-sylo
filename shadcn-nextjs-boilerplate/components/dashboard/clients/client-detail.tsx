'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client, Project } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { getClient } from '@/utils/supabase/clients';
import { getProjects } from '@/utils/supabase/projects';
import {
  HiPencil,
  HiTrash,
  HiUser,
  HiBuildingOffice2,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiTag,
  HiDocumentText,
  HiPlus,
  HiEye
} from 'react-icons/hi2';

interface ClientDetailProps {
  clientId: string;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onClose: () => void;
}

export default function ClientDetail({ clientId, onEdit, onDelete, onClose }: ClientDetailProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchClientData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch client details
        const clientData = await getClient(supabase, clientId);
        setClient(clientData);

        // Fetch client's projects
        const projectsResult = await getProjects(supabase, { client_id: clientId });
        setProjects(projectsResult.projects);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client details');
      } finally {
        setLoading(false);
      }
    }

    fetchClientData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="circular-light text-muted-foreground">Loading client details...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="circular-light text-red-500">{error || 'Client not found'}</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return <HiBuildingOffice2 className="h-5 w-5" />;
      case 'organization': return <HiBuildingOffice2 className="h-5 w-5" />;
      default: return <HiUser className="h-5 w-5" />;
    }
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'business': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'organization': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'on_hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getClientTypeIcon(client.client_type)}
          <div>
            <h1 className="circular-bold text-2xl text-foreground">
              {client.company_name || `${client.first_name} ${client.last_name}`}
            </h1>
            {client.company_name && (
              <p className="circular-light text-lg text-muted-foreground">
                {client.first_name} {client.last_name}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(client)} variant="outline" size="sm">
            <HiPencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={() => onDelete(client.id)} variant="outline" size="sm">
            <HiTrash className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="circular-bold text-lg flex items-center gap-2">
                  <HiUser className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Badge className={getClientTypeColor(client.client_type)}>
                    {client.client_type}
                  </Badge>
                  {client.preferred_contact_method && (
                    <Badge variant="outline">
                      {client.preferred_contact_method}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  {client.email && (
                    <div className="flex items-center gap-3">
                      <HiEnvelope className="h-4 w-4 text-muted-foreground" />
                      <span className="circular-light">{client.email}</span>
                    </div>
                  )}

                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <HiPhone className="h-4 w-4 text-muted-foreground" />
                      <span className="circular-light">{client.phone}</span>
                    </div>
                  )}

                  {(client.address || client.city || client.state) && (
                    <div className="flex items-start gap-3">
                      <HiMapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="circular-light">
                        {client.address && <div>{client.address}</div>}
                        {(client.city || client.state) && (
                          <div>
                            {client.city}{client.city && client.state && ', '}{client.state} {client.zip_code}
                          </div>
                        )}
                        {client.country && client.country !== 'US' && (
                          <div>{client.country}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lead Information */}
            <Card>
              <CardHeader>
                <CardTitle className="circular-bold text-lg flex items-center gap-2">
                  <HiDocumentText className="h-5 w-5" />
                  Lead Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="circular-light text-muted-foreground">Lead Source:</span>
                    <span className="circular-bold">{client.lead_source || 'Unknown'}</span>
                  </div>

                  {client.referral_source && (
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Referred by:</span>
                      <span className="circular-bold">{client.referral_source}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="circular-light text-muted-foreground">Added:</span>
                    <span className="circular-bold">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="circular-light text-muted-foreground">Last Updated:</span>
                    <span className="circular-bold">
                      {new Date(client.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {client.tags && client.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="circular-bold text-lg flex items-center gap-2">
                  <HiTag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="circular-bold text-lg">Client Projects</h3>
            <Button size="sm">
              <HiPlus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="circular-light text-muted-foreground">
                  No projects yet. Create the first project for this client.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="circular-bold text-lg">{project.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <HiEye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <HiPencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getProjectStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {project.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="circular-light text-sm text-muted-foreground mb-3">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      {project.budget_min && project.budget_max && (
                        <div className="flex justify-between">
                          <span className="circular-light text-muted-foreground">Budget:</span>
                          <span className="circular-bold">
                            ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {project.start_date && (
                        <div className="flex justify-between">
                          <span className="circular-light text-muted-foreground">Start Date:</span>
                          <span className="circular-bold">
                            {new Date(project.start_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {project.target_completion_date && (
                        <div className="flex justify-between">
                          <span className="circular-light text-muted-foreground">Target:</span>
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
          )}
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="circular-bold text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes ? (
                <p className="circular-light whitespace-pre-wrap">{client.notes}</p>
              ) : (
                <p className="circular-light text-muted-foreground italic">
                  No notes available for this client.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}