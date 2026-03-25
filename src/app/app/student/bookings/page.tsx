import { auth } from "@/auth";
import StudentBookingsClient from "@/components/app/student/StudentBookingsClient";
import { redirect } from "next/navigation";

export default async function StudentBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <StudentBookingsClient />;
}