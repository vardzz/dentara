import { auth } from "@/auth";
import StudentSearchClient from "@/components/app/StudentSearchClient";
import { redirect } from "next/navigation";

export default async function StudentSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <StudentSearchClient />;
}