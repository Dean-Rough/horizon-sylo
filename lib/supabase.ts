import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting error
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal error
          }
        },
      },
    }
  );
}

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Helper function to get authenticated user
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, error: error || new Error('User not authenticated') };
  }
  
  return { user, error: null };
}

// Helper function to handle database errors
export function handleDatabaseError(error: any) {
  console.error('Database error:', error);
  
  return {
    error: error.message || 'An unexpected error occurred',
    status: error.code === '23505' ? 409 : // Unique violation
            error.code === '23503' ? 404 : // Foreign key violation
            error.code === '42P01' ? 404 : // Undefined table
            500 // Default to internal server error
  };
}

// Types for database responses
export type DatabaseError = {
  error: string;
  status: number;
};

export type DatabaseResponse<T> = {
  data: T | null;
  error: DatabaseError | null;
};
