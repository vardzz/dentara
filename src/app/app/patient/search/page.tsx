import { auth } from "@/auth";
import PatientSearchClient from "@/components/app/patient/PatientSearchClient";
import { redirect } from "next/navigation";

export default async function PatientSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <PatientSearchClient />;
}