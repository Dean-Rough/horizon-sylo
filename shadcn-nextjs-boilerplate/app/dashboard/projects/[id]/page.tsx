import { getUserDetails, getUser } from '@/utils/supabase/queries';
import ProjectDetail from '@/components/dashboard/projects/project-detail';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <ProjectDetail user={user} userDetails={userDetails} projectId={params.id} />;
}
