import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/app/AppShell";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // 1. No session? Go login.
  if (!session?.user) {
    redirect("/app/login");
  }

  // 2. Wrong role?
  if (session.user.role !== "patient") {
    if (session.user.role === "student") {
      redirect("/app/student/home");
    } else if (session.user.role === "university") {
      redirect("/app/university/home");
    } else {
      redirect("/app/login"); 
    }
  }

  return (
    <AppShell role="Patient" basePath="/app/patient" userName={session.user.name}>
      {children}
    </AppShell>
  );
}