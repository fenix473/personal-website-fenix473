"use client"

import { usePathname } from "next/navigation"
import ChatWindow from "./ChatWindow"

/**
 * Renders floating ChatWindow (FAB + panel) except on the full-screen assistant page,
 * so the chat icon is hidden when the user is already in full-screen chat.
 */
export default function ChatWindowWrapper() {
    const pathname = usePathname()
    const isAssistantPage = pathname === "/projects/assistant"

    if (isAssistantPage) return null

    return <ChatWindow />
}
