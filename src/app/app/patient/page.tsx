import { redirect } from "next/navigation";
import { auth } from "@/auth"; 
import StudentDashboard from "@/components/app/StudentDashboard"; 

export default async function StudentRoute() {
  const session = await auth();

  // 1. Kick out unauthenticated users
  if (!session?.user) {
    redirect("/app/login"); // Assuming your login page is at /app/login
  }

  // 2. Kick patients over to their specific URL
  if (session.user.role !== "patient") {
    redirect("/app/student");
  }

  // 3. Render the dashboard
  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <StudentDashboard userName={session.user.name || "Patient"} />
      </div>
    </main>
  );
}