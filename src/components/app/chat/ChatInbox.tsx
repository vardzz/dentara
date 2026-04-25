import { getMyConversations } from '@/app/actions/chat';
import Link from 'next/link';
import { Search } from 'lucide-react';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatShortTime(iso: string) {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  if (diffMins > 0) return `${diffMins}m`;
  return 'now';
}

export default async function ChatInbox({ basePath }: { basePath: string }) {
  const conversations = await getMyConversations();

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 md:p-10 -mx-6 -mt-24 pt-24 md:m-0 md:p-0 md:bg-transparent min-h-[100svh] md:min-h-0">
      <div className="max-w-2xl w-full mx-auto space-y-6 md:mt-0 px-6 md:px-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Chats</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-white rounded-full border border-gray-200 pl-12 pr-6 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          />
        </div>

        {/* Conversation List Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No chats yet.</div>
          ) : (
            <div className="flex flex-col">
              {conversations.map((conversation, index) => {
                const isLast = index === conversations.length - 1;
                return (
                  <Link
                    key={conversation.id}
                    href={`${basePath}/chats/${conversation.id}`}
                    className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${
                      !isLast ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm">
                        {initials(conversation.otherUser.fullName)}
                      </div>
                      {/* Online Indicator */}
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-bold truncate">
                        {conversation.otherUser.fullName}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {conversation.lastMessage?.content ?? 'Start a new conversation...'}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                      <span className="text-xs font-medium text-gray-400">
                        {conversation.lastMessage ? formatShortTime(conversation.lastMessage.createdAt) : ''}
                      </span>
                      {conversation.unreadCount > 0 ? (
                        <span className="h-5 min-w-5 px-1.5 rounded-full bg-brand-teal text-white text-[10px] font-bold flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      ) : (
                        <div className="h-5" /> /* Placeholder to keep alignment */
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
