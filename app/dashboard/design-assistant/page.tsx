import { getUserDetails, getUser } from '@/utils/supabase/queries';
import DesignChat from '@/components/dashboard/design-chat';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function DesignAssistant() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <DesignChat user={user} userDetails={userDetails} />;
}
