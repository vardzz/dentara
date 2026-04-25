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
    if (session.user.role === "patient") {
      redirect("/app/patient/home");
    } else if (session.user.role === "university") {
      redirect("/app/university/home");
    } else {
      redirect("/app/login"); 
    }
  }

  return (
    <AppShell role="Student" basePath="/app/student" userName={session.user.name}>
      {children}
    </AppShell>
  );
}