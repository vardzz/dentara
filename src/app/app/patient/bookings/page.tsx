import { auth } from "@/auth";
import PatientBookingsClient from "@/components/app/patient/PatientBookingsClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PatientBookingsPageFixed() {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Bookings</h1>
      <PatientBookingsClient bookings={bookingItems} />
    </div>
  );
}