import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BookingsClient from "@/components/app/BookingsClient";
import { redirect } from "next/navigation";

export default async function PatientBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Since Appointment model is not in schema yet, we use an empty array or fetch mock data
  const appointments: any[] = []; 

  return <BookingsClient initialAppointments={appointments} />;
}