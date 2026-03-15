import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookingsClient from "@/components/app/BookingsClient";

export default async function StudentBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Note: Once you build an Appointment model in Prisma, fetch it here!
  // For now, we pass an empty array or mock data to prove the DB connection works.
  const dbAppointments: any[] = []; 

  return <BookingsClient initialAppointments={dbAppointments} />;
}