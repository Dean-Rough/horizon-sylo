import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Projects from '@/components/dashboard/projects';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <Projects user={user} userDetails={userDetails} />;
}
