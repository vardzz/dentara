import { auth } from "@/auth";
import UniversitySearchClient from "@/components/app/UniversitySearchClient";
import { redirect } from "next/navigation";

export default async function UniversitySearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <UniversitySearchClient />;
}
