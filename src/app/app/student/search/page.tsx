import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SearchClient from "@/components/app/SearchClient";
import { redirect } from "next/navigation";

export default async function StudentSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Fetch patient users as potential cases for a student
  const patients = await prisma.user.findMany({
    where: { role: "patient" },
    select: {
      id: true,
      fullName: true,
      concern: true,
      location: true,
    },
    take: 10,
  });

  const initialResults = patients.map(p => ({
    id: p.id,
    name: p.fullName,
    type: "Patient",
    dist: "Nearby", // Mock data for distance
    match: "98%",   // Mock data for match percentage
    tag: p.concern || "General",
  }));

  return <SearchClient initialResults={initialResults} />;
}