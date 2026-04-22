import { auth } from "@/auth";
import PatientBookingsClient from "@/components/app/patient/PatientBookingsClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PatientBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const bookings = await prisma.booking.findMany({
    where: { patientId: session.user.id },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
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
    studentName: booking.student.fullName,
    clinicAddress: booking.student.clinicAddress,
  }));

  return <PatientBookingsClient bookings={bookingItems} />;
}