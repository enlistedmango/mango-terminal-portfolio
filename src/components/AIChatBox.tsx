import { useState, useRef, useEffect } from "react";

interface Message {
    role: "assistant" | "user";
    content: string;
}

interface AIChatBoxProps {
    onClose?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export function AIChatBox({ onClose }: AIChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm an AI assistant trained to help you learn more about this developer. What would you like to know?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: message }]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
                }),
            });

            if (!response.ok) {
                let errorMessage = "Sorry, I'm having trouble connecting right now.";

                if (response.status === 429) {
                    errorMessage = "I've reached my conversation limit. Please try again later.";
                } else if (response.status === 500) {
                    const data = await response.json();
                    if (data.error?.includes("quota")) {
                        errorMessage = "I've reached my daily limit. Please try again tomorrow.";
                    }
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            if (data.response) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        error instanceof Error
                            ? error.message
                            : "Sorry, I'm having trouble connecting right now. Please try again later.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="ai-chat-box">
            <div className="chat-header">
                <h3>AI Assistant</h3>
                <button
                    className="close-button"
                    onClick={handleClose}>
                    ×
                </button>
            </div>
            <div
                className="chat-messages"
                ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.role}`}>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message assistant">
                        <div className="message-content">
                            <span className="typing-indicator">...</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                />
                <button
                    onClick={() => sendMessage(input)}
                    disabled={isLoading || !input.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
}
