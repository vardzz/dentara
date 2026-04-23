import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getConversationMessages, getConversationList, markConversationAsRead } from '@/lib/chat-server';
import ChatActiveClient from '@/components/app/chat/ChatActiveClient';

export default async function ChatActiveServer({ conversationId, basePath }: { conversationId: string; basePath: string }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/app/login');
  }

  const currentUserId = session.user.id;

  // Retrieve messages
  const initialMessages = await getConversationMessages(currentUserId, conversationId);

  // Mark as read
  await markConversationAsRead(currentUserId, conversationId);

  // Retrieve conversation to get the other user's info
  const allConversations = await getConversationList(currentUserId);
  const conversation = allConversations.find((c) => c.id === conversationId);

  if (!conversation) {
    redirect(`${basePath}/chats`);
  }

  return (
    <div className="flex flex-col h-[100svh] -mx-6 -mt-24 pt-24 md:m-0 md:p-0 md:h-[calc(100vh-5rem)] md:border md:border-gray-100 md:rounded-3xl md:overflow-hidden md:shadow-sm">
      <ChatActiveClient
        currentUserId={currentUserId}
        conversationId={conversationId}
        initialMessages={initialMessages}
        otherUser={conversation.otherUser}
        basePath={basePath}
      />
    </div>
  );
}
