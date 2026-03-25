import { auth } from "@/auth";
import StudentChatsClient from "@/components/app/student/StudentChatsClient";
import { redirect } from "next/navigation";

export default async function StudentChatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <StudentChatsClient />;
}
