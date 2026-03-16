import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "@/components/app/ProfileClient";
import { redirect } from "next/navigation";

export default async function StudentProfilePage() {
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

  return <ProfileClient user={user} />;
}