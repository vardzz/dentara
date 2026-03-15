import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ChatsClient from "@/components/app/ChatsClient";

export default async function ChatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Pass empty array until Prisma Chat models are built
  const dbChats: any[] = [];

  return <ChatsClient initialChats={dbChats} />;
}