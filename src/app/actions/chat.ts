'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  ensureConversationBetweenUsers,
  getConversationList,
  getConversationMessages,
  markConversationAsRead,
  resolveSessionUserId,
} from '@/lib/chat-server';

export async function findOrCreateConversation(targetUserId: string) {
  const currentUserId = await resolveSessionUserId();

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  const conversationId = await ensureConversationBetweenUsers(currentUserId, targetUserId);
  return { conversationId };
}

export async function getMyConversations() {
  const currentUserId = await resolveSessionUserId();

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  return getConversationList(currentUserId);
}

export async function getConversationMessagesAction(conversationId: string) {
  const currentUserId = await resolveSessionUserId();

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  return getConversationMessages(currentUserId, conversationId);
}

export async function markConversationAsReadAction(conversationId: string) {
  const currentUserId = await resolveSessionUserId();

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  await markConversationAsRead(currentUserId, conversationId);
}

export async function sendMessage(conversationId: string, content: string) {
  const currentUserId = await resolveSessionUserId();

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error('Message cannot be empty');
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      participant1Id: true,
      participant2Id: true,
    },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const isParticipant =
    conversation.participant1Id === currentUserId || conversation.participant2Id === currentUserId;

  if (!isParticipant) {
    throw new Error('Unauthorized conversation access');
  }

  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: {
        conversationId,
        senderId: currentUserId,
        content: trimmed,
      },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
    });

    return created;
  });

  // Keep role-specific chat inbox pages fresh.
  revalidatePath('/app/student/chats');
  revalidatePath('/app/patient/chats');
  revalidatePath('/app/university/chats');
  revalidatePath('/app/chats');

  return {
    ...message,
    createdAt: message.createdAt.toISOString(),
  };
}
