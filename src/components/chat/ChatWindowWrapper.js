"use client"

import { usePathname, useRouter } from "next/navigation"
import ChatWindow from "./ChatWindow"

const ASSISTANT_FULLSCREEN_PATH = "/projects/assistant"

/**
 * Renders a single ChatWindow that persists across fullscreen and minimal.
 * Same instance is rescaled via fullScreen prop; state is preserved until hard refresh.
 */
export default function ChatWindowWrapper() {
    const pathname = usePathname()
    const router = useRouter()
    const fullScreen = pathname === ASSISTANT_FULLSCREEN_PATH

    return (
        <ChatWindow
            fullScreen={fullScreen}
            onClose={fullScreen ? () => router.back() : undefined}
        />
    )
}
