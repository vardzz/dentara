import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PatientHomeClient from "@/components/app/patient/PatientHomeClient";
import { redirect } from "next/navigation";

export default async function PatientHomePage() {
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
      location: true,
      concern: true,
    },
  });

  if (!user || user.role !== "patient") redirect("/app/login");

  const bookings = await prisma.booking.findMany({
    where: { patientId: sessionUserId },
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
  });

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