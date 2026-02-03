"use client"

import { Box, Spinner } from "@chakra-ui/react"
import { FaFeather, FaAtom, FaCog, FaCommentDots, FaPaperPlane, FaTimes, FaExpand } from "react-icons/fa"
import "@/styles/ChatWindow.css"
import { useState } from "react"
import { useRouter } from "next/navigation"

const PERSONAS = [
    { key: "poet", label: "Poet", Icon: FaFeather },
    { key: "einstein", label: "Einstein", Icon: FaAtom },
    { key: "enginseer", label: "Enginseer", Icon: FaCog },
]

const ASSISTANT_FULLSCREEN_PATH = "/projects/assistant"

function ChatWindow({ fullScreen = false, onClose }) {
    const router = useRouter()
    const [selectedAgent, setSelectedAgent] = useState("poet")
    const [messages, setMessages] = useState([
        {
            id: 1,
            time: "10:30 AM",
            message: "Hello, how are you?",
            sender: "compositor",
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () => {
        if (fullScreen && onClose) {
            onClose();
        } else {
            setIsOpen(false);
        }
    }

    const showContent = fullScreen || isOpen;

    if (!showContent) {
        return (
            <button
                type="button"
                className="chat-fab"
                onClick={() => setIsOpen(true)}
                aria-label="Open chat"
            >
                <FaCommentDots size={24} />
            </button>
        )
    }

    const windowClassName = fullScreen ? "chat-window chat-window--fullscreen" : "chat-window";

    const handleSendMessage = async () => {
        const userMessage = inputValue.trim()
        if (!userMessage) return

        const newMessage = {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            message: userMessage,
            sender: "user",
        }
        setMessages((prev) => [...prev, newMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/claude", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, agent: selectedAgent }),
            })
            if (!response.ok) {
                const errText = await response.text()
                throw new Error(errText || `Request failed: ${response.status}`)
            }
            const data = await response.json()
            const botMessage = {
                id: Date.now(),
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                message: data.text || "No response",
                sender: "compositor",
            }
            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error("Error sending message:", error)
            const botMessage = {
                id: Date.now(),
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                message: "Something went wrong. Please try again.",
                sender: "compositor",
            }
            setMessages((prev) => [...prev, botMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box className={windowClassName}>
            <header className="chat-header">
                <div className="chat-personas">
                    {PERSONAS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            type="button"
                            className={`chat-persona ${selectedAgent === key ? "active" : ""}`}
                            onClick={() => setSelectedAgent(key)}
                            title={label}
                            aria-pressed={selectedAgent === key}
                        >
                            <Icon size={18} aria-hidden />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
                <div className="chat-header-actions">
                    {!fullScreen && (
                        <button
                            type="button"
                            className="chat-expand"
                            onClick={() => router.push(ASSISTANT_FULLSCREEN_PATH)}
                            aria-label="Open chat in full screen"
                        >
                            <FaExpand size={18} />
                        </button>
                    )}
                    <button
                        type="button"
                        className="chat-close"
                        onClick={handleClose}
                        aria-label="Close chat"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>
            </header>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-message ${msg.sender === "user" ? "user" : "compositor"}`}
                    >
                        <p className="chat-message-text">{msg.message}</p>
                        <span className="chat-message-time">{msg.time}</span>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message chat-message--loading compositor" aria-busy="true" aria-live="polite">
                        <Box display="flex" alignItems="center" gap="10px">
                            <Spinner size="sm" color="white" />
                            <span className="chat-message-text">Thinking...</span>
                        </Box>
                    </div>
                )}
            </div>

            <div className="chat-input-wrap">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                        }
                    }}
                />
                <button
                    type="button"
                    className="chat-send"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    aria-label="Send message"
                >
                    <FaPaperPlane size={16} />
                </button>
            </div>
        </Box>
    )
}

export default ChatWindow
