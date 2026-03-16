import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/app/AppShell";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // 1. No session? Go login.
  if (!session?.user) {
    redirect("/app/login");
  }

  // 2. Wrong role? 
  if (session.user.role !== "student") {
    // Only send them to patient IF we are 100% sure they are a patient
    if (session.user.role === "patient") {
      redirect("/app/patient/home");
    } else {
      // Otherwise, their session is corrupted. Force them to log in again.
      redirect("/app/login"); 
    }
  }

  return (
    <AppShell role="Student" basePath="/app/student">
      {children}
    </AppShell>
  );
}