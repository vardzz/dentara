import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/app/AppShell";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/app/login");
  if (session.user.role !== "student") redirect("/app/patient/home");

  return (
    <AppShell role="Student" basePath="/app/student">
      {children}
    </AppShell>
  );
}