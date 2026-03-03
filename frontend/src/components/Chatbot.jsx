import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your FitVision AI assistant. Ask me anything about fitness, nutrition, or workouts!", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(input);
            const response = await result.response;
            const text = response.text();

            setMessages((prev) => [...prev, { text: text, sender: "bot" }]);
        } catch (error) {
            console.error("Error fetching from Gemini:", error);
            setMessages((prev) => [...prev, { text: "Sorry, I encountered an error. Please check your API key or try again later.", sender: "bot" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col mb-4 ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden animate-fade-in-up transition-all duration-300 transform">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <FaRobot className="text-xl" />
                            </div>
                            <h3 className="font-bold text-lg">FitVision AI</h3>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                                <FaMinus />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600"
                                        }`}
                                >
                                    {/* Basic Markdown rendering for bolding could be added here if needed, for now just text */}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about fitness..."
                                className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-400"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className={`p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30 ${(isLoading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                >
                    <FaRobot className="text-2xl group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default Chatbot;
