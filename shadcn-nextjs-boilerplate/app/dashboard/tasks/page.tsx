import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Tasks from '@/components/dashboard/tasks';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function TasksPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <Tasks user={user} userDetails={userDetails} />;
}
