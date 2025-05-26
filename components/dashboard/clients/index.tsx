'use client';

import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getClients } from '@/utils/supabase/clients';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiEye,
  HiPencil,
  HiTrash,
  HiUser,
  HiOfficeBuilding,
  HiEnvelope,
  HiPhone
} from 'react-icons/hi2';
import { Client } from '@/types/database';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

// Mock data for now - will be replaced with real Supabase data
const mockClients: Client[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    company_name: '',
    email: 'sarah@email.com',
    phone: '(555) 123-4567',
    address: '123 Oak Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94102',
    country: 'US',
    client_type: 'individual',
    preferred_contact_method: 'email',
    lead_source: 'referral',
    referral_source: 'Jane Smith',
    notes: 'Looking for modern minimalist design for new loft',
    tags: ['high-value', 'referral'],
    created_by: 'user1',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  {
    id: '2',
    first_name: 'Mike',
    last_name: 'Chen',
    company_name: 'TechFlow Inc',
    email: 'mike@techflow.com',
    phone: '(555) 987-6543',
    address: '456 Tech Blvd',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    country: 'US',
    client_type: 'business',
    preferred_contact_method: 'email',
    lead_source: 'website',
    notes: 'Tech startup needing modern office design',
    tags: ['tech', 'startup', 'commercial'],
    created_by: 'user1',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },
  {
    id: '3',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    company_name: '',
    email: 'emily.r@gmail.com',
    phone: '(555) 456-7890',
    address: '789 Pine Avenue',
    city: 'Oakland',
    state: 'CA',
    zip_code: '94610',
    country: 'US',
    client_type: 'individual',
    preferred_contact_method: 'phone',
    lead_source: 'social_media',
    notes: 'Family home renovation, 3 bedrooms',
    tags: ['family', 'renovation'],
    created_by: 'user1',
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  }
];

const getClientTypeIcon = (type: string) => {
  switch (type) {
    case 'business': return <HiOfficeBuilding className="h-4 w-4" />;
    case 'organization': return <HiOfficeBuilding className="h-4 w-4" />;
    default: return <HiUser className="h-4 w-4" />;
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

const getContactMethodIcon = (method: string) => {
  switch (method) {
    case 'email': return <HiEnvelope className="h-3 w-3" />;
    case 'phone': return <HiPhone className="h-3 w-3" />;
    default: return <HiEnvelope className="h-3 w-3" />;
  }
};

export default function Clients(props: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch clients from Supabase
  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        setError(null);

        const result = await getClients(supabase);
        setClients(result.clients);
        setFilteredClients(result.clients);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
        // Fallback to mock data if database isn't ready
        setClients(mockClients);
        setFilteredClients(mockClients);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    const filtered = clients.filter(client =>
      client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Clients"
      description="Manage your design clients"
    >
      <div className="h-full w-full">
        {/* Header */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            CLIENTS
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="circular-bold text-3xl text-foreground mb-2">
                Client Directory
              </h1>
              <p className="circular-light text-lg text-muted-foreground">
                Manage your client relationships and contact information
              </p>
            </div>
            <Button className="circular-bold">
              <HiPlus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, company, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="circular-light text-muted-foreground">Loading clients...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="circular-light text-red-500">{error}</p>
            <p className="circular-light text-sm text-muted-foreground mt-2">
              Showing sample data instead
            </p>
          </div>
        )}

        {/* Clients Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getClientTypeIcon(client.client_type)}
                    <CardTitle className="circular-bold text-lg">
                      {client.company_name || `${client.first_name} ${client.last_name}`}
                    </CardTitle>
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
                  <Badge className={getClientTypeColor(client.client_type)}>
                    {client.client_type}
                  </Badge>
                  {client.preferred_contact_method && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getContactMethodIcon(client.preferred_contact_method)}
                      {client.preferred_contact_method}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {client.company_name && (
                  <p className="circular-bold text-sm mb-2">
                    {client.first_name} {client.last_name}
                  </p>
                )}

                <div className="space-y-2 text-sm mb-4">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <HiEnvelope className="h-3 w-3 text-muted-foreground" />
                      <span className="circular-light text-muted-foreground">{client.email}</span>
                    </div>
                  )}

                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <HiPhone className="h-3 w-3 text-muted-foreground" />
                      <span className="circular-light text-muted-foreground">{client.phone}</span>
                    </div>
                  )}

                  {client.city && client.state && (
                    <div className="flex items-center gap-2">
                      <span className="circular-light text-muted-foreground">
                        {client.city}, {client.state}
                      </span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <p className="circular-light text-sm text-muted-foreground mb-3">
                    {client.notes}
                  </p>
                )}

                {client.tags && client.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {client.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {client.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{client.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="circular-light text-muted-foreground">Lead Source:</span>
                    <span className="circular-bold">{client.lead_source || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="circular-light text-muted-foreground">Added:</span>
                    <span className="circular-bold">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="circular-light text-muted-foreground">
              {searchTerm ? 'No clients found matching your search.' : 'No clients yet. Add your first client!'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
