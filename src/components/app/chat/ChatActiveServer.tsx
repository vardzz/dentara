import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getConversationMessages, getConversationList, markConversationAsRead } from '@/lib/chat-server';
import ChatActiveClient from '@/components/app/chat/ChatActiveClient';

/**
 * ChatActiveServer
 * Optimized to fix data waterfalls.
 * Phase 1: Performance & Streaming
 */
export default async function ChatActiveServer({ conversationId, basePath }: { conversationId: string; basePath: string }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/app/login');
  }

  const currentUserId = session.user.id;

  // Parallel Data Fetching: Retrieve messages and conversation list concurrently.
  // We also fire off the "mark as read" side effect in the same Promise.all.
  const [initialMessages, allConversations] = await Promise.all([
    getConversationMessages(currentUserId, conversationId),
    getConversationList(currentUserId),
    markConversationAsRead(currentUserId, conversationId)
  ]);

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
