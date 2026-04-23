import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toPlainCaseLabel } from "@/lib/plain-language";
import StudentHomeClient from "@/components/app/student/StudentHomeClient";
import { redirect } from "next/navigation";

export default async function StudentHomePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/app/login");

  const sessionUserId =
    session.user.id ??
    (
      await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    )?.id;

  if (!sessionUserId) redirect("/app/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      fullName: true,
      role: true,
      school: true,
      casesJson: true,
    },
  });

  if (!user || user.role !== "student") redirect("/app/login");

  const unreadChatCount = await prisma.message.count({
    where: {
      isRead: false,
      senderId: { not: sessionUserId },
      conversation: {
        OR: [
          { participant1Id: sessionUserId },
          { participant2Id: sessionUserId }
        ]
      }
    }
  });

  const completedBookings = await prisma.booking.findMany({
    where: {
      studentId: sessionUserId,
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
  });

  const upcomingBookings = await prisma.booking.findMany({
    where: {
      studentId: sessionUserId,
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
  });

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