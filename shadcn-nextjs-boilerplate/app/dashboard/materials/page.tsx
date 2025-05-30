import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Materials from '@/components/dashboard/materials';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function MaterialsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <Materials user={user} userDetails={userDetails} />;
}
