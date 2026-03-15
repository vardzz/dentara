import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookingsClient from "@/components/app/BookingsClient";

export default async function PatientBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Pass an empty array until we create the Prisma Appointment model
  const dbAppointments: any[] = []; 

  // Reuse the exact same BookingsClient!
  return <BookingsClient initialAppointments={dbAppointments} />;
}