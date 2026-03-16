import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SearchClient from "@/components/app/SearchClient";
import { redirect } from "next/navigation";

export default async function PatientSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Fetch student users as potential matches for a patient
  const students = await prisma.user.findMany({
    where: { role: "student" },
    select: {
      id: true,
      fullName: true,
      school: true,
      location: true,
    },
    take: 10,
  });

  const initialResults = students.map(s => ({
    id: s.id,
    name: s.fullName,
    type: "Student Clinician",
    dist: "Nearby", // Mock data for distance
    match: "95%",   // Mock data for match percentage
    tag: s.school || "Verified",
  }));

  return <SearchClient initialResults={initialResults} />;
}