import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PatientHomeClient from "@/components/app/patient/PatientHomeClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import HomeLoading from "./loading";

/**
 * PatientHomePage
 * Optimized to fix data waterfalls and implement streaming with Suspense.
 * Phase 1: Performance & Streaming
 */
export default async function PatientHomePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/app/login");
  }

  // We wrap the heavy data fetching in a separate component and use Suspense
  // to allow the layout to render immediately with a loading state.
  return (
    <Suspense fallback={<HomeLoading />}>
      <PatientHomeData userId={session.user.id} />
    </Suspense>
  );
}

async function PatientHomeData({ userId }: { userId: string }) {
  // Parallel Data Fetching: Fix the waterfall by running queries concurrently.
  const [user, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        role: true,
        location: true,
        concern: true,
      },
    }),
    prisma.booking.findMany({
      where: { patientId: userId },
      include: {
        student: {
          select: {
            fullName: true,
            clinicAddress: true,
          },
        },
      },
      orderBy: [
        { scheduledAt: "asc" },
        { updatedAt: "desc" },
      ],
    })
  ]);

  if (!user || user.role !== "patient") {
    redirect("/app/login");
  }

  const bookingItems = bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    scheduledAt: booking.scheduledAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    caseLabel: booking.caseLabel,
    notes: booking.notes,
    studentName: booking.student.fullName,
    clinicAddress: booking.student.clinicAddress,
  }));

  return <PatientHomeClient user={user} bookings={bookingItems} />;
}
