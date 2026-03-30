"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import axios from "axios";


interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
}

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "¡Hola! Soy tu asistente financiero virtual experto en el método FIRE. ¿En qué puedo ayudarte hoy?",
            sender: "bot",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // This hook is used for potential future translation, but for now we hardcode some spanish strings
    // const t = useTranslations("Chatbot");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            sender: "user",
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/api/chat", {
                message: userMsg.text,
            });

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.response || "No recibí una respuesta válida del asistente.",
                sender: "bot",
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Error al comunicarse con el chatbot:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Lo siento, tuve un problema al conectarme con el servidor. Por favor, intenta de nuevo más tarde.",
                sender: "bot",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Marco del Chat */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-[500px] flex flex-col bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300 transform origin-bottom-right">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-full">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Asistente Financiero</h3>
                                <p className="text-xs text-muted-foreground">Inversión Libre IA</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            aria-label="Cerrar chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Área de Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground border border-border"
                                            }`}
                                    >
                                        {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div
                                        className={`px-3 py-2 rounded-2xl text-sm ${msg.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none border border-border/50"
                                            }`}
                                    >
                                        {/* Renderizamos la respuesta con saltos de línea */}
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Indicador de carga */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%] flex-row">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground border border-border">
                                        <Bot size={14} />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-muted text-foreground rounded-tl-none border border-border/50 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-background border-t border-border">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2 bg-muted/50 rounded-full p-1 border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribe tu consulta financiera..."
                                className="flex-1 bg-transparent border-none outline-none px-3 py-1.5 text-sm placeholder:text-muted-foreground"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-primary text-primary-foreground p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                aria-label="Enviar mensaje"
                            >
                                <Send size={16} className={isLoading ? "animate-pulse" : ""} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Botón Flotante */}
            <button
                onClick={toggleChat}
                className={`bg-primary text-primary-foreground p-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    } absolute bottom-0 right-0`}
                aria-label="Abrir asistente financiero"
            >
                <MessageCircle size={28} />
            </button>

            {/* Botón de cierre alternativo cuando el chat está abierto (opcional, para móvil) */}
            <button
                onClick={toggleChat}
                className={`bg-background text-foreground border border-border p-4 rounded-full shadow-lg hover:bg-muted transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    } absolute bottom-0 right-0 z-0`}
                aria-hidden={!isOpen}
            >
                <X size={28} />
            </button>
        </div>
    );
}
