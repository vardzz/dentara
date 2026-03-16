import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ChatsClient from "@/components/app/ChatsClient";
import { redirect } from "next/navigation";

export default async function StudentChatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  // Since Chat model is not specifically in schema snippet, we use an empty array
  const chats: any[] = []; 

  return <ChatsClient initialChats={chats} />;
}
