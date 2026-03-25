import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UniversityProfileClient from "@/components/app/UniversityProfileClient";
import { redirect } from "next/navigation";

export default async function UniversityProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      role: true,
    },
  });

  if (!user || user.role !== "university") redirect("/app/login");

  return <UniversityProfileClient user={user} />;
}
