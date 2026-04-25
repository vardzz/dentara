import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/app/AppShell";

export default async function UniversityLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/app/login");
  }

  if (session.user.role !== "university") {
    if (session.user.role === "student") {
      redirect("/app/student/home");
    } else if (session.user.role === "patient") {
      redirect("/app/patient/home");
    } else {
      redirect("/app/login");
    }
  }

  return (
    <AppShell role="University" basePath="/app/university" userName={session.user.name}>
      {children}
    </AppShell>
  );
}
