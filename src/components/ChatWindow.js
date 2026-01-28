"use client"

import { Box, Heading, Text, CloseButton, Button, Group, Input } from "@chakra-ui/react"
import "@/styles/ChatWindow.css"
import { useState } from "react"



function ChatWindow() {

    const [messages, setMessages] = useState([
        {
            id: 1,
            time: '10:30 AM',
            message: 'Hello, how are you?',
            sender: 'compositor'
        }
    ])
    
    const [inputValue, setInputValue] = useState('')

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return; // Don't send empty messages

        const newMessage = {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: inputValue,
            sender: 'user'
        }

        setMessages(prev => [...prev, newMessage]) // Add new message to the messages array
        setInputValue('') // Clear the input field

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: inputValue })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            const botMessage = {
                id: Date.now(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: data[0]?.output || 'No response',
                sender: 'compositor'
            }
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    const [isOpen, setIsOpen] = useState(false)

    return isOpen ? (
        <Box className="chat-window">
            <Box className="chat-header">
                <Heading size="md">Compositor</Heading>
                <CloseButton onClick={() => setIsOpen(false)} />
            </Box>
            <Box className="messages-container">
                {messages.map((msg) => (
                    <Box 
                        key={msg.id}
                        className={`message-bubble ${msg.sender === 'user' ? 'user' : 'compositor'}`}
                    >
                        <Text>{msg.message}</Text>
                        <Text fontSize="xs" color="gray.500">{msg.time}</Text>
                    </Box>
                ))}
            </Box>
            <Group attached w="full" maxW="sm">
                <Input flex="1" placeholder="Enter your message" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }} />
                <Button bg="bg.subtle" variant="outline" onClick={handleSendMessage}>
                    Send
                </Button>
            </Group>
        </Box>) : (
        <Box className="chat-window-closed" onClick={() => setIsOpen(true)}>
            <Text fontSize="2xl">💬</Text>
        </Box>
    );
}    


export default ChatWindow;