'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NotificationStatus, NotificationType } from '@prisma/client';

export type NotificationPayload = {
  id: string;
  type: 'OFFER' | 'BOOKING_REQUEST' | 'ACCEPTED' | 'REJECTED';
  status: 'UNREAD' | 'READ';
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
  };
  booking: {
    id: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    scheduledAt: string;
    notes: string | null;
    studentId: string;
    patientId: string;
    studentName: string;
    patientName: string;
    studentAvailabilityJson: string | null;
  } | null;
};

export type PendingBookingPayload = {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  scheduledAt: string;
  notes: string | null;
  student: { id: string; fullName: string };
  patient: { id: string; fullName: string };
};

export type NotificationState = {
  unreadCount: number;
  notifications: NotificationPayload[];
  pendingBookings: PendingBookingPayload[];
};

async function requireSession() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function getNotificationStateAction(): Promise<NotificationState> {
  const session = await requireSession();
  const userId = session.user.id;

  const [unreadCount, notifications, pendingBookings] = await Promise.all([
    prisma.notification.count({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
        type: {
          in: [NotificationType.OFFER, NotificationType.BOOKING_REQUEST],
        },
      },
    }),
    prisma.notification.findMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
        type: {
          in: [NotificationType.OFFER, NotificationType.BOOKING_REQUEST],
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        booking: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
            notes: true,
            studentId: true,
            patientId: true,
            student: {
              select: {
                fullName: true,
                availabilityJson: true,
              },
            },
            patient: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.booking.findMany({
      where: {
        status: 'PENDING',
        OR: [{ studentId: userId }, { patientId: userId }],
      },
      include: {
        student: { select: { id: true, fullName: true } },
        patient: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  return {
    unreadCount,
    notifications: notifications.map((item) => ({
      id: item.id,
      type: item.type,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      sender: {
        id: item.sender.id,
        fullName: item.sender.fullName,
        role: item.sender.role,
      },
      booking: item.booking
        ? {
            id: item.booking.id,
            status: item.booking.status,
            scheduledAt: item.booking.scheduledAt.toISOString(),
            notes: item.booking.notes,
            studentId: item.booking.studentId,
            patientId: item.booking.patientId,
            studentName: item.booking.student.fullName,
            patientName: item.booking.patient.fullName,
            studentAvailabilityJson: item.booking.student.availabilityJson,
          }
        : null,
    })),
    pendingBookings: pendingBookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      scheduledAt: booking.scheduledAt.toISOString(),
      notes: booking.notes,
      student: booking.student,
      patient: booking.patient,
    })),
  };
}

export async function markAsReadAction(notificationId: string): Promise<{ success: true }> {
  const session = await requireSession();

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
    data: {
      status: NotificationStatus.READ,
    },
  });

  return { success: true };
}
