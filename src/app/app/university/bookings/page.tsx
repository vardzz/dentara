import { auth } from "@/auth";
import UniversityBookingsClient from "@/components/app/university/UniversityBookingsClient";
import { redirect } from "next/navigation";

export default async function UniversityBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  return <UniversityBookingsClient />;
}
