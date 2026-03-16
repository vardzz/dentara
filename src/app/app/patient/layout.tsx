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
    // Only send them to student IF we are 100% sure they are a student
    if (session.user.role === "student") {
      redirect("/app/student/home");
    } else {
      // Otherwise, their session is corrupted. Force them to log in again.
      redirect("/app/login"); 
    }
  }

  return (
    <AppShell role="Patient" basePath="/app/patient">
      {children}
    </AppShell>
  );
}