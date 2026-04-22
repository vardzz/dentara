'use server';

import { prisma } from '@/lib/prisma';

export async function getCurrentUserProfile(userId: string) {
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        role: true,
        email: true,
        school: true,
        yearLevel: true,
        clinicAddress: true,
        casesJson: true,
        availabilityJson: true,
        concern: true,
        location: true,
        age: true,
        phone: true,
        studentId: true,
        name: true,
        image: true,
        // Also fetch relations that might be useful for dashboard counters
        _count: {
          select: {
            receivedNotifications: {
              where: { status: 'UNREAD' }
            },
            studentBookings: {
              where: { status: 'PENDING' }
            },
            patientBookings: {
              where: { status: 'PENDING' }
            }
          }
        }
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
