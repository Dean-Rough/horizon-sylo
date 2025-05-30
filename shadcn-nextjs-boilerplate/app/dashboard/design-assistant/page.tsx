import { getUserDetails, getUser } from '@/utils/supabase/queries';
import DesignAssistant from '@/components/dashboard/design-assistant';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function DesignAssistantPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <DesignAssistant user={user} userDetails={userDetails} />;
}
