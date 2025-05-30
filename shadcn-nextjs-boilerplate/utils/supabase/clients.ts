import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Client, 
  CreateClientData, 
  ClientFilters, 
  SortOptions 
} from '@/types/database';

export async function getClients(
  supabase: SupabaseClient,
  filters?: ClientFilters,
  sort?: SortOptions,
  page = 1,
  limit = 10
) {
  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .is('deleted_at', null);

  // Apply filters
  if (filters?.client_type?.length) {
    query = query.in('client_type', filters.client_type);
  }
  
  if (filters?.lead_source?.length) {
    query = query.in('lead_source', filters.lead_source);
  }
  
  if (filters?.search) {
    query = query.or(`
      first_name.ilike.%${filters.search}%,
      last_name.ilike.%${filters.search}%,
      company_name.ilike.%${filters.search}%,
      email.ilike.%${filters.search}%
    `);
  }

  // Apply sorting
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    clients: data as Client[],
    total: count || 0,
    page,
    limit
  };
}

export async function getClient(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      projects:projects(*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw error;
  return data as Client;
}

export async function createClient(
  supabase: SupabaseClient, 
  clientData: CreateClientData
) {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select('*')
    .single();

  if (error) throw error;
  return data as Client;
}

export async function updateClient(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<CreateClientData>
) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Client;
}

export async function deleteClient(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('clients')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function getRecentClients(supabase: SupabaseClient, limit = 5) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Client[];
}

export async function getClientsByType(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('clients')
    .select('client_type')
    .is('deleted_at', null);

  if (error) throw error;

  const typeCounts = data.reduce((acc, client) => {
    acc[client.client_type] = (acc[client.client_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return typeCounts;
}

export async function searchClients(supabase: SupabaseClient, searchTerm: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('id, first_name, last_name, company_name, email')
    .is('deleted_at', null)
    .or(`
      first_name.ilike.%${searchTerm}%,
      last_name.ilike.%${searchTerm}%,
      company_name.ilike.%${searchTerm}%,
      email.ilike.%${searchTerm}%
    `)
    .limit(10);

  if (error) throw error;
  return data as Partial<Client>[];
}
