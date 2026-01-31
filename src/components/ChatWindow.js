"use client"

import { Box } from "@chakra-ui/react"
import { FaFeather, FaAtom, FaCog, FaCommentDots, FaPaperPlane, FaTimes } from "react-icons/fa"
import "@/styles/ChatWindow.css"
import { useState } from "react"

const PERSONAS = [
    { key: "poet", label: "Poet", Icon: FaFeather },
    { key: "einstein", label: "Einstein", Icon: FaAtom },
    { key: "enginseer", label: "Enginseer", Icon: FaCog },
]

function ChatWindow() {
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
        }
    }

    if (!isOpen) {
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

    return (
        <Box className="chat-window">
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
                <button
                    type="button"
                    className="chat-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                >
                    <FaTimes size={18} />
                </button>
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
                    aria-label="Send message"
                >
                    <FaPaperPlane size={16} />
                </button>
            </div>
        </Box>
    )
}

export default ChatWindow
