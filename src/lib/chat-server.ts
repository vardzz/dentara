import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export type ChatConversationItem = {
  id: string;
  updatedAt: string;
  otherUser: {
    id: string;
    fullName: string;
    image: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
};

export type ChatMessageItem = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export async function resolveSessionUserId() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const sessionUserId =
    session.user.id ??
    (
      await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    )?.id;

  return sessionUserId ?? null;
}

function canonicalPair(userA: string, userB: string) {
  return userA < userB ? [userA, userB] : [userB, userA];
}

export async function ensureConversationBetweenUsers(currentUserId: string, targetUserId: string) {
  if (currentUserId === targetUserId) {
    throw new Error('Cannot create a conversation with yourself');
  }

  const [participant1Id, participant2Id] = canonicalPair(currentUserId, targetUserId);

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true },
  });

  if (!target) {
    throw new Error('Target user not found');
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      participant1Id_participant2Id: {
        participant1Id,
        participant2Id,
      },
    },
    update: {},
    create: {
      participant1Id,
      participant2Id,
    },
    select: {
      id: true,
    },
  });

  return conversation.id;
}

export async function getConversationList(currentUserId: string): Promise<ChatConversationItem[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participant1Id: currentUserId }, { participant2Id: currentUserId }],
    },
    include: {
      participant1: {
        select: {
          id: true,
          fullName: true,
          image: true,
        },
      },
      participant2: {
        select: {
          id: true,
          fullName: true,
          image: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          content: true,
          createdAt: true,
          senderId: true,
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: { not: currentUserId },
              isRead: false,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return conversations.map((conversation) => {
    const otherUser = conversation.participant1Id === currentUserId ? conversation.participant2 : conversation.participant1;
    const lastMessage = conversation.messages[0] ?? null;

    return {
      id: conversation.id,
      updatedAt: conversation.updatedAt.toISOString(),
      otherUser,
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt.toISOString(),
            senderId: lastMessage.senderId,
          }
        : null,
      unreadCount: conversation._count.messages,
    };
  });
}

export async function getConversationMessages(currentUserId: string, conversationId: string): Promise<ChatMessageItem[]> {
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

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      isRead: true,
      createdAt: true,
    },
  });

  return messages.map((message) => ({
    ...message,
    createdAt: message.createdAt.toISOString(),
  }));
}

export async function markConversationAsRead(currentUserId: string, conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
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

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: currentUserId },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}
