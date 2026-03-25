import { auth } from "@/auth";
import UniversityChatsClient from "@/components/app/UniversityChatsClient";
import { redirect } from "next/navigation";

export default async function UniversityChatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <UniversityChatsClient />;
}
