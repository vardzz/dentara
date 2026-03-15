import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "@/components/app/ProfileClient";

export default async function PatientProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Fetch full user details from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Reuse the exact same ProfileClient! It already checks user.role internally.
  return <ProfileClient user={user} />;
}