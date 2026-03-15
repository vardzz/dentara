import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StudentDashboard from "@/components/app/StudentDashboard";

export default async function StudentHomePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "student") redirect("/app/login");

  // Fetch real user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true }
  });

  return (
    <StudentDashboard userName={user?.fullName || "Student"} />
  );
}