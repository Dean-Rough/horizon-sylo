import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { 
  getClients, 
  createClient as createClientRecord, 
  updateClient, 
  deleteClient 
} from '@/utils/supabase/clients';
import { CreateClientData } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const clientType = searchParams.get('client_type') || undefined;
    const leadSource = searchParams.get('lead_source') || undefined;
    const sortField = searchParams.get('sort_field') || 'created_at';
    const sortDirection = searchParams.get('sort_direction') || 'desc';

    // Build filters
    const filters: any = {};
    if (search) filters.search = search;
    if (clientType) filters.client_type = [clientType];
    if (leadSource) filters.lead_source = [leadSource];

    // Build sort options
    const sort = {
      field: sortField,
      direction: sortDirection as 'asc' | 'desc'
    };

    const result = await getClients(supabase, filters, sort, page, limit);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      );
    }

    const clientData: CreateClientData = {
      first_name: body.first_name,
      last_name: body.last_name,
      company_name: body.company_name || undefined,
      email: body.email,
      phone: body.phone || undefined,
      address: body.address || undefined,
      city: body.city || undefined,
      state: body.state || undefined,
      zip_code: body.zip_code || undefined,
      country: body.country || 'US',
      client_type: body.client_type || 'individual',
      preferred_contact_method: body.preferred_contact_method || 'email',
      lead_source: body.lead_source || undefined,
      referral_source: body.referral_source || undefined,
      notes: body.notes || undefined,
      tags: body.tags || []
    };

    const client = await createClientRecord(supabase, clientData);
    
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const client = await updateClient(supabase, id, updates);
    
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    await deleteClient(supabase, id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}