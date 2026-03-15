import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SearchClient from "@/components/app/SearchClient";

export default async function PatientSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Patients are searching for STUDENTS and CLINICS
  const students = await prisma.user.findMany({
    where: { role: "student" },
    select: { id: true, fullName: true, school: true, clinicAddress: true },
    take: 10,
  });

  // Map the database data to match your UI format
  const mappedResults = students.map((s) => ({
    id: s.id,
    name: s.fullName || "Unknown Student",
    type: "Student",
    dist: s.clinicAddress || "Location TBA",
    match: "98%", // Placeholder matching algorithm
    tag: s.school || "Dental School",
  }));

  // Reuse the exact same SearchClient!
  return <SearchClient initialResults={mappedResults} />;
}