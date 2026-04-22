'use server';

import { auth } from '@/auth';
import { isSlotAvailableForDate } from '@/lib/availability';
import { prisma } from '@/lib/prisma';
import { BookingStatus, NotificationStatus, NotificationType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function requireSession() {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    throw new Error('Unauthorized');
  }

  return session;
}

function parseDateOrThrow(scheduledAtIso: string): Date {
  const date = new Date(scheduledAtIso);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date/time');
  }

  return date;
}

export async function createOfferAction(patientId: string, notes?: string) {
  const session = await requireSession();

  if (session.user.role !== 'student') {
    throw new Error('Only students can send offers');
  }

  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: { id: true, role: true },
  });

  if (!patient || patient.role !== 'patient') {
    throw new Error('Invalid patient');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        studentId: session.user.id,
        patientId,
        // Placeholder until the patient chooses the final slot in Complete Booking.
        scheduledAt: new Date(),
        status: BookingStatus.PENDING,
        notes: notes?.trim() || null,
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: patientId,
        senderId: session.user.id,
        type: NotificationType.OFFER,
        status: NotificationStatus.UNREAD,
        referenceId: booking.id,
      },
    });

    return { booking, notification };
  });

  return {
    success: true as const,
    bookingId: result.booking.id,
    notificationId: result.notification.id,
  };
}

export async function createBookingRequestAction(
  studentId: string,
  scheduledAtIso: string,
  notes?: string,
) {
  const session = await requireSession();

  if (session.user.role !== 'patient') {
    throw new Error('Only patients can request bookings');
  }

  const scheduledAt = parseDateOrThrow(scheduledAtIso);

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      role: true,
      availabilityJson: true,
    },
  });

  if (!student || student.role !== 'student') {
    throw new Error('Invalid student');
  }

  if (!isSlotAvailableForDate(student.availabilityJson, scheduledAt)) {
    throw new Error('Selected slot is not available');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        studentId,
        patientId: session.user.id,
        scheduledAt,
        status: BookingStatus.PENDING,
        notes: notes?.trim() || null,
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: studentId,
        senderId: session.user.id,
        type: NotificationType.BOOKING_REQUEST,
        status: NotificationStatus.UNREAD,
        referenceId: booking.id,
      },
    });

    return { booking, notification };
  });

  return {
    success: true as const,
    bookingId: result.booking.id,
    notificationId: result.notification.id,
  };
}

export async function completeOfferBookingAction(
  notificationId: string,
  scheduledAtIso: string,
  notes?: string,
) {
  const session = await requireSession();

  if (session.user.role !== 'patient') {
    throw new Error('Only patients can complete offer bookings');
  }

  const scheduledAt = parseDateOrThrow(scheduledAtIso);

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: {
      booking: {
        include: {
          student: { select: { id: true, availabilityJson: true } },
        },
      },
    },
  });

  if (!notification || notification.userId !== session.user.id || notification.type !== NotificationType.OFFER) {
    throw new Error('Offer not found');
  }

  if (!notification.booking) {
    throw new Error('Offer does not have a linked booking');
  }

  const studentAvailability = notification.booking.student.availabilityJson;

  if (!isSlotAvailableForDate(studentAvailability, scheduledAt)) {
    throw new Error('Selected slot is not available');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id: notification.booking!.id },
      data: {
        scheduledAt,
        status: BookingStatus.CONFIRMED,
        notes: notes?.trim() || notification.booking!.notes,
      },
    });

    await tx.notification.update({
      where: { id: notificationId },
      data: { status: NotificationStatus.READ },
    });

    revalidatePath('/app/student/bookings');
    revalidatePath('/app/patient/bookings');
    revalidatePath('/app/student');
    revalidatePath('/app/patient');

    const acknowledgement = await tx.notification.create({
      data: {
        userId: booking.studentId,
        senderId: session.user.id,
        type: NotificationType.ACCEPTED,
        status: NotificationStatus.UNREAD,
        referenceId: booking.id,
      },
    });

    return { booking, acknowledgement };
  });

  return {
    success: true as const,
    bookingId: result.booking.id,
    notificationId: result.acknowledgement.id,
  };
}

export async function acceptBookingNotificationAction(notificationId: string) {
  const session = await requireSession();

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { booking: true },
  });

  if (!notification || notification.userId !== session.user.id || notification.type !== NotificationType.BOOKING_REQUEST) {
    throw new Error('Booking request not found');
  }

  if (!notification.booking || notification.booking.studentId !== session.user.id) {
    throw new Error('Booking not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id: notification.booking!.id },
      data: { status: BookingStatus.CONFIRMED },
    });

    await tx.notification.update({
      where: { id: notificationId },
      data: { status: NotificationStatus.READ },
    });

    revalidatePath('/app/student/bookings');
    revalidatePath('/app/patient/bookings');
    revalidatePath('/app/student');
    revalidatePath('/app/patient');

    const followup = await tx.notification.create({
      data: {
        userId: booking.patientId,
        senderId: session.user.id,
        type: NotificationType.ACCEPTED,
        status: NotificationStatus.UNREAD,
        referenceId: booking.id,
      },
    });

    return { booking, followup };
  });

  return {
    success: true as const,
    bookingId: result.booking.id,
    notificationId: result.followup.id,
  };
}

export async function rejectBookingNotificationAction(notificationId: string) {
  const session = await requireSession();

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { booking: true },
  });

  if (!notification || notification.userId !== session.user.id || notification.type !== NotificationType.BOOKING_REQUEST) {
    throw new Error('Booking request not found');
  }

  if (!notification.booking || notification.booking.studentId !== session.user.id) {
    throw new Error('Booking not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id: notification.booking!.id },
      data: { status: BookingStatus.CANCELLED },
    });

    await tx.notification.update({
      where: { id: notificationId },
      data: { status: NotificationStatus.READ },
    });

    revalidatePath('/app/student/bookings');
    revalidatePath('/app/patient/bookings');
    revalidatePath('/app/student');
    revalidatePath('/app/patient');

    const followup = await tx.notification.create({
      data: {
        userId: booking.patientId,
        senderId: session.user.id,
        type: NotificationType.REJECTED,
        status: NotificationStatus.UNREAD,
        referenceId: booking.id,
      },
    });

    return { booking, followup };
  });

  return {
    success: true as const,
    bookingId: result.booking.id,
    notificationId: result.followup.id,
  };
}

export async function completeBookingAction(bookingId: string) {
  const session = await requireSession();

  if (session.user.role !== 'student') {
    throw new Error('Only students can complete bookings');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.studentId !== session.user.id) {
    throw new Error('Booking not found');
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error('Only confirmed bookings can be completed');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'COMPLETED' as BookingStatus },
  });

  revalidatePath('/app/student/bookings');
  revalidatePath('/app/patient/bookings');
  revalidatePath('/app/student');
  revalidatePath('/app/patient');

  return {
    success: true as const,
    bookingId: updatedBooking.id,
  };
}
