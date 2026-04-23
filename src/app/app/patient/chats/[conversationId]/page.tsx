import ChatActiveServer from '@/components/app/chat/ChatActiveServer';

export default async function PatientChatActivePage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  return <ChatActiveServer conversationId={conversationId} basePath="/app/patient" />;
}
