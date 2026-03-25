import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StudentHomeClient from "@/components/app/student/StudentHomeClient";
import { redirect } from "next/navigation";

export default async function StudentHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      role: true,
      school: true,
    },
  });

  if (!user || user.role !== "student") redirect("/app/login");

  return <StudentHomeClient user={user} />;
}