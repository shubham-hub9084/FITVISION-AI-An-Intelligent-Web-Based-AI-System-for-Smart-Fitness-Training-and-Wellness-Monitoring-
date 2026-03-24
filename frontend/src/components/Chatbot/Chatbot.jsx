import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from '../../services/aiService';
import { Bot, Send, X, MessageSquare, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

    return (
        <>
            {/* Toggle Button — always on top */}
            <div className="fixed bottom-20 right-6 z-[9999]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                    aria-label="Toggle Chatbot"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7 group-hover:-rotate-12 transition-transform" />}
                </button>
            </div>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-36 right-6 w-[360px] h-[500px] z-[9999] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                        {/* Solid dark background — always fully opaque */}
                        <div className="absolute inset-0 bg-gray-950 rounded-2xl" />

                        {/* Subtle top glow accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 rounded-t-2xl" />

                        {/* Content wrapper — all z-10 to be above background */}
                        <div className="relative z-10 flex flex-col w-full h-full">

                            {/* Header */}
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm leading-tight">FitVision AI</h3>
                                        <p className="text-emerald-300 text-xs font-medium">Always here to help</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div
                                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                                style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b981 transparent' }}
                            >
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.sender === 'bot' && (
                                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                            </div>
                                        )}

                                        <div
                                            className={`px-3 py-2.5 rounded-2xl max-w-[78%] text-sm leading-relaxed ${
                                                msg.sender === 'bot'
                                                    ? 'bg-gray-800 text-gray-100 rounded-tl-sm'
                                                    : 'bg-emerald-600 text-white rounded-tr-sm'
                                            } ${msg.isError ? 'bg-red-900/40 text-red-300' : ''}`}
                                        >
                                            {msg.sender === 'bot' ? (
                                                <div className="prose prose-sm prose-invert max-w-none
                                                    [&_p]:text-gray-100 [&_p]:mb-2 [&_p:last-child]:mb-0
                                                    [&_strong]:text-white [&_em]:text-emerald-300
                                                    [&_ul]:text-gray-200 [&_ol]:text-gray-200
                                                    [&_li]:text-gray-200 [&_li]:mb-1
                                                    [&_code]:text-emerald-300 [&_code]:bg-black/40 [&_code]:px-1 [&_code]:rounded
                                                    [&_pre]:bg-black/50 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto
                                                    [&_a]:text-emerald-400 [&_a]:underline
                                                    [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <span className="text-white">{msg.text}</span>
                                            )}
                                        </div>

                                        {msg.sender === 'user' && (
                                            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-1">
                                                <User className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Typing indicator */}
                                {isLoading && (
                                    <div className="flex gap-2 justify-start">
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form
                                onSubmit={handleSendMessage}
                                className="px-4 py-3 border-t border-white/10 flex items-center gap-2 shrink-0 bg-slate-800"
                            >
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask about workouts, diet..."
                                    className="flex-1 px-4 py-2.5 text-sm bg-gray-800 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
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
