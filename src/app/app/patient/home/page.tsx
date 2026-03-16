import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/app/HomeClient";
import { redirect } from "next/navigation";

export default async function PatientHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      role: true,
      location: true,
    },
  });

  if (!user || user.role !== "patient") redirect("/app/login");

  return <HomeClient user={user} />;
}