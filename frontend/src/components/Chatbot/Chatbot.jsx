import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from '../../services/aiService';
import { Bot, Send, X, MessageSquare, Sparkles, User } from 'lucide-react';
import { cn } from "@/lib/utils";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your FitVision AI assistant. How can I help you with your fitness journey today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        const response = await getGeminiResponse(inputText);

        const botMessage = {
            id: Date.now() + 1,
            text: response.text,
            sender: 'bot',
            isError: response.error
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    // Chatbot Toggle Button
    // We'll keep the floating button logic but use Lucide icons
    // The Modal will use AIChatCard's structure

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                    aria-label="Toggle Chatbot"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7 group-hover:-rotate-12 transition-transform" />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn("fixed bottom-24 right-6 w-[360px] h-[500px] rounded-2xl overflow-hidden p-[2px] z-50 shadow-2xl")}
                    >
                        {/* Animated Outer Border (from AIChatCard) */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Inner Card content */}
                        <div className="relative flex flex-col w-full h-full rounded-xl border border-white/10 overflow-hidden bg-black/90 backdrop-blur-xl">
                            {/* Inner Animated Background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-900"
                                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: "200% 200%" }}
                            />

                            {/* Floating Particles */}
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 rounded-full bg-white/10"
                                    animate={{
                                        y: ["0%", "-140%"],
                                        x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 5 + Math.random() * 3,
                                        repeat: Infinity,
                                        delay: i * 0.5,
                                        ease: "easeInOut",
                                    }}
                                    style={{ left: `${Math.random() * 100}%`, bottom: "-10%" }}
                                />
                            ))}


                            {/* Header */}
                            <div className="px-4 py-3 border-b border-white/10 relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-emerald-400" />
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">FitVision AI</h3>
                                        <p className="text-emerald-100/70 text-xs">Always here to help</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative z-10">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={cn(
                                            "px-3 py-2 rounded-xl max-w-[85%] shadow-md backdrop-blur-md flex items-start gap-2",
                                            msg.sender === 'bot'
                                                ? "bg-white/10 text-white self-start"
                                                : "bg-emerald-500/20 text-white border border-emerald-500/30 self-end"
                                        )}>
                                            {msg.sender === 'bot' && <Sparkles className="w-4 h-4 mt-1 text-emerald-400 shrink-0" />}
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                            {msg.sender === 'user' && <User className="w-4 h-4 mt-1 text-emerald-400 shrink-0" />}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        className="flex items-center gap-1 px-3 py-2 rounded-xl max-w-[30%] bg-white/10 self-start"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0.6, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.2 }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse delay-200"></span>
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse delay-400"></span>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 relative z-10 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask about workouts, diet..."
                                    className="flex-1 px-3 py-2 text-sm bg-black/50 rounded-lg border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 placeholder:text-gray-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="p-2 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
