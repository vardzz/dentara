import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ChatsRootPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/app/login');
  }

  const role = session.user.role;

  if (role === 'student') {
    redirect('/app/student/chats');
  }

  if (role === 'university') {
    redirect('/app/university/chats');
  }

  redirect('/app/patient/chats');
}
