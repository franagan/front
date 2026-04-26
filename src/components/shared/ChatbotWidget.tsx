"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Maximize2, Minimize2, Download, Trash2 } from "lucide-react";
import api from "@/services/api";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

import { useAuthStore } from "@/stores/useAuthStore";

export default function ChatbotWidget() {
    const { isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Cargar historial al montar
    useEffect(() => {
        if (isAuthenticated && isOpen) {
            fetchHistory();
        }
    }, [isAuthenticated, isOpen]);

    const fetchHistory = async () => {
        try {
            const response = await api.get("/chat/history");
            if (response.data && response.data.length > 0) {
                const history = response.data.map((m: any) => ({
                    id: m.id,
                    text: m.text,
                    sender: m.sender,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(history);
            } else {
                // Mensaje de bienvenida si no hay historial
                setMessages([{
                    id: "welcome",
                    text: "¡Hola! Soy LIA, tu asesora inteligente para el camino hacia el FIRE. ¿En qué puedo ayudarte hoy?",
                    sender: "bot",
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error("Error al cargar el historial:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isExpanded]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (isOpen) setIsExpanded(false);
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const clearHistory = async () => {
        if (confirm("¿Estás seguro de que quieres borrar el historial de esta conversación permanentemente?")) {
            try {
                await api.delete("/chat/history");
                setMessages([
                    {
                        id: Date.now().toString(),
                        text: "Historial borrado de la base de datos. ¿En qué puedo ayudarte ahora?",
                        sender: "bot",
                        timestamp: new Date(),
                    },
                ]);
            } catch (error) {
                console.error("Error al borrar historial:", error);
                alert("No se pudo borrar el historial del servidor.");
            }
        }
    };

    const exportChat = () => {
        const text = messages
            .map((m) => `[${m.timestamp.toLocaleString()}] ${m.sender.toUpperCase()}: ${m.text}`)
            .join("\n\n---\n\n");
        
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `conversacion-inversion-libre-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await api.post("/chat", {
                message: userMsg.text,
            });

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.response || "No recibí una respuesta válida del asistente.",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Error al comunicarse con el chatbot:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Lo siento, tuve un problema al conectarme con el servidor. Por favor, intenta de nuevo más tarde.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className={`fixed z-50 flex flex-col items-end transition-all duration-500 ${
            isExpanded ? "inset-4 sm:inset-10" : "bottom-6 right-6"
        }`}>
            {/* Marco del Chat */}
            {isOpen && (
                <div className={`flex flex-col bg-background/95 backdrop-blur-md rounded-3xl shadow-2xl border border-border overflow-hidden transition-all duration-500 transform origin-bottom-right ${
                    isExpanded 
                        ? "w-full h-full max-w-4xl mx-auto" 
                        : "mb-4 w-80 sm:w-96 h-[500px]"
                }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-primary/5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-inner">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base">LIA: Tu Asesora FIRE</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">IA Activa • Método FIRE</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={exportChat}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                title="Exportar conversación"
                            >
                                <Download size={18} />
                            </button>
                            <button
                                onClick={clearHistory}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                title="Borrar historial"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={toggleExpand}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                title={isExpanded ? "Contraer" : "Expandir"}
                            >
                                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button
                                onClick={toggleChat}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all ml-1"
                                aria-label="Cerrar chat"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área de Mensajes */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-muted/20">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div
                                    className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div
                                        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${msg.sender === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground border border-border"
                                            }`}
                                    >
                                        {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm ${msg.sender === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-background text-foreground rounded-tl-none border border-border/50"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <span className={`text-[10px] text-muted-foreground px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex gap-3 max-w-[85%] flex-row">
                                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center border border-border">
                                        <Bot size={16} />
                                    </div>
                                    <div className="px-5 py-4 rounded-2xl bg-muted/50 text-foreground rounded-tl-none border border-border/50 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 sm:p-6 bg-background border-t border-border">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-3 bg-muted/30 rounded-2xl p-2 pl-4 border border-border/50 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30 focus-within:bg-background transition-all duration-300"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Hazme una pregunta sobre inversiones, ahorro o FIRE..."
                                className="flex-1 bg-transparent border-none outline-none py-2 text-sm sm:text-base placeholder:text-muted-foreground"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-primary text-primary-foreground p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md shadow-primary/20 transition-all"
                                aria-label="Enviar mensaje"
                            >
                                <Send size={20} className={isLoading ? "animate-pulse" : ""} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Botón Flotante */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-primary text-primary-foreground p-5 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
                    aria-label="Abrir asistente financiero"
                >
                    <MessageCircle size={28} />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-semibold whitespace-nowrap">
                        Asistente LIA
                    </span>
                </button>
            )}
        </div>
    );
}
