'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * Fetches the current user's profile from the database.
 *
 * SECURITY: This action no longer accepts a userId parameter.
 * It derives the user ID exclusively from the authenticated session,
 * preventing IDOR (Insecure Direct Object Reference) attacks where
 * an attacker could enumerate other users' profiles.
 */
export async function getCurrentUserProfile() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

/**
 * Updates the current user's profile.
 * 
 * Protocol 5: Persists patient concern and other profile fields to the DB.
 */
export async function updateUserProfile(data: {
  fullName?: string;
  school?: string;
  yearLevel?: string;
  clinicAddress?: string;
  age?: string;
  phone?: string;
  location?: string;
  concern?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const updateData: any = { ...data };
    
    // Parse numeric fields
    if (data.age) {
      updateData.age = parseInt(data.age, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
}
