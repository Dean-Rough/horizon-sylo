import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Collections from '@/components/dashboard/collections';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function CollectionsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <Collections user={user} userDetails={userDetails} />;
}
