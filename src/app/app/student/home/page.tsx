import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toPlainCaseLabel } from "@/lib/plain-language";
import StudentHomeClient from "@/components/app/student/StudentHomeClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import HomeLoading from "./loading";

/**
 * StudentHomePage
 * Optimized to fix data waterfalls and implement streaming with Suspense.
 * Phase 1: Performance & Streaming
 */
export default async function StudentHomePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/app/login");
  }

  return (
    <Suspense fallback={<HomeLoading />}>
      <StudentHomeData userId={session.user.id} />
    </Suspense>
  );
}

async function StudentHomeData({ userId }: { userId: string }) {
  // Parallel Data Fetching: Fix the waterfall by running queries concurrently.
  const [user, unreadChatCount, completedBookings, upcomingBookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        role: true,
        school: true,
        casesJson: true,
      },
    }),
    prisma.message.count({
      where: {
        isRead: false,
        senderId: { not: userId },
        conversation: {
          OR: [
            { participant1Id: userId },
            { participant2Id: userId }
          ]
        }
      }
    }),
    prisma.booking.findMany({
      where: {
        studentId: userId,
        status: "COMPLETED",
      },
      select: {
        id: true,
        caseLabel: true,
        notes: true,
        updatedAt: true,
        patient: {
          select: {
            fullName: true,
            concern: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        studentId: userId,
        status: "CONFIRMED",
      },
      select: {
        id: true,
        caseLabel: true,
        notes: true,
        scheduledAt: true,
        patient: {
          select: {
            fullName: true,
            concern: true,
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    })
  ]);

  if (!user || user.role !== "student") {
    redirect("/app/login");
  }

  const progress = completedBookings.reduce(
    (acc, booking) => {
      const sourceLabel =
        booking.caseLabel?.trim() || booking.patient.concern?.trim() || booking.notes?.trim();
      if (sourceLabel) {
        const normalizedLabel = toPlainCaseLabel(sourceLabel);
        acc[normalizedLabel] = (acc[normalizedLabel] ?? 0) + 1;
      }

      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <StudentHomeClient 
      user={user} 
      progress={progress} 
      unreadChatCount={unreadChatCount}
      upcomingCases={upcomingBookings}
      recentActivities={completedBookings}
    />
  );
}
