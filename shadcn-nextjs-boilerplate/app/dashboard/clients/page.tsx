import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Clients from '@/components/dashboard/clients';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ClientsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <Clients user={user} userDetails={userDetails} />;
}
