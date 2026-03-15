import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/app/AppShell";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/app/login");
  if (session.user.role !== "patient") redirect("/app/student/home");

  return (
    <AppShell role="Patient" basePath="/app/patiient">
      {children}
    </AppShell>
  );
}