import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SearchClient from "@/components/app/SearchClient";

export default async function StudentSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Fetch actual patients from your database who need care
  const patients = await prisma.user.findMany({
    where: { role: "patient" },
    select: { id: true, fullName: true, concern: true, location: true },
    take: 10, // Limit results for performance
  });

  // Map the database data to match your UI format
  const mappedResults = patients.map((p) => ({
    id: p.id,
    name: p.fullName || "Unknown Patient",
    type: "Patient",
    dist: p.location || "Location not set",
    match: "95%", // Placeholder for your future matching algorithm
    tag: p.concern || "Consult",
  }));

  return <SearchClient initialResults={mappedResults} />;
}