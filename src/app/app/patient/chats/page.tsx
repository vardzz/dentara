import { auth } from "@/auth";
import PatientChatsClient from "@/components/app/patient/PatientChatsClient";
import { redirect } from "next/navigation";

export default async function PatientChatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <PatientChatsClient />;
}
