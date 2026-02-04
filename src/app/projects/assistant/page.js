'use client';

import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';

export default function AssistantPage() {
  const router = useRouter();

  return (
    <ChatWindow
    fullScreen onClose={() => router.back()}
    />
  )
}
