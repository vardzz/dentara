import { auth } from "@/auth";
import PatientBookingsClient from "@/components/app/PatientBookingsClient";
import { redirect } from "next/navigation";

export default async function PatientBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <PatientBookingsClient />;
}