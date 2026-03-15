import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PatientDashboard from "@/components/app/PatientDashboard";

export default async function PatientHomePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "patient") redirect("/app/login");

  // Fetch real user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true }
  });

  return (
    <PatientDashboard userName={user?.fullName || "Patient"} />
  );
}