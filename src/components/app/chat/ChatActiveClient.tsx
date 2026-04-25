'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImageIcon, MoreVertical, Paperclip, Phone, Send } from 'lucide-react';
import { sendMessage, markConversationAsReadAction } from '@/app/actions/chat';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { ChatMessageItem, ChatConversationItem } from '@/lib/chat-server';

type Props = {
  currentUserId: string;
  conversationId: string;
  initialMessages: ChatMessageItem[];
  otherUser: {
    fullName: string;
    image: string | null;
  };
  basePath: string;
};

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatShortTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatActiveClient({ currentUserId, conversationId, initialMessages, otherUser, basePath }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) return;

    // ── Protocol 8: Robust real-time chat subscription ──
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
        },
        async (payload) => {
          const incoming = payload.new as ChatMessageItem;

          // Filter for this specific conversation context
          if (incoming.conversationId !== conversationId) return;

          setMessages((prev) => {
            if (prev.some((msg) => msg.id === incoming.id)) {
              return prev;
            }
            return [...prev, incoming];
          });

          if (incoming.senderId !== currentUserId) {
            await markConversationAsReadAction(conversationId);
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  async function onSend() {
    if (sending) return;

    const content = messageInput.trim();
    if (!content) return;

    setSending(true);

    try {
      const sent = await sendMessage(conversationId, content);
      setMessageInput('');

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === sent.id)) {
          return prev;
        }
        return [...prev, sent as ChatMessageItem];
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[100svh] bg-slate-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/chats`}
            prefetch={true}
            className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm">
              {initials(otherUser.fullName)}
            </div>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-slate-900">{otherUser.fullName}</h2>
            <span className="text-[11px] text-emerald-500 font-medium">Online</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-slate-50 text-gray-500 transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-50 text-gray-500 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const mine = message.senderId === currentUserId;

          return (
            <div key={message.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 shadow-sm text-sm ${
                  mine
                    ? 'bg-brand-teal text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-50 rounded-2xl rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              <span className={`text-[10px] mt-1 px-1 font-medium ${mine ? 'text-gray-400' : 'text-gray-400'}`}>
                {formatShortTime(message.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-transparent shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-full p-2 border border-gray-200 shadow-sm">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-50 rounded-full transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-50 rounded-full transition-colors">
            <ImageIcon className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void onSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent px-2 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
          
          <button
            onClick={() => void onSend()}
            disabled={sending || !messageInput.trim()}
            className="h-10 w-10 bg-brand-teal text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
