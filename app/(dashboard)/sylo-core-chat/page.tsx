import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import SyloCoreChat from '@/components/dashboard/sylo-core-chat';

export default async function SyloCoreChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin');
  }

  // Get user details
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return <SyloCoreChat user={user} userDetails={userDetails} />;
}
