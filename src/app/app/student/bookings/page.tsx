import { auth } from "@/auth";
import StudentBookingsClient from "@/components/app/student/StudentBookingsClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function StudentBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
        },
      },
      student: {
        select: {
          clinicAddress: true,
        },
      },
    },
    orderBy: [{ scheduledAt: "asc" }],
  });

  const bookingItems = bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    scheduledAt: booking.scheduledAt.toISOString(),
    notes: booking.notes,
    patientName: booking.patient.fullName,
    clinicAddress: booking.student.clinicAddress,
  }));

  return <StudentBookingsClient bookings={bookingItems} />;
}