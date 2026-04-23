import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ChatConversationCompatPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/app/login');
  }

  const { conversationId } = await params;

  if (session.user.role === 'student') {
    redirect(`/app/student/chats/${conversationId}`);
  }

  if (session.user.role === 'university') {
    redirect(`/app/university/chats/${conversationId}`);
  }

  redirect(`/app/patient/chats/${conversationId}`);
}
