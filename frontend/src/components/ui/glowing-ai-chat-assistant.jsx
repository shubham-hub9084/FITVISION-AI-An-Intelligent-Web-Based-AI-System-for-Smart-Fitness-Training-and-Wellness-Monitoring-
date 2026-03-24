import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, User } from 'lucide-react';
import { getGeminiResponse } from '../../services/aiService';
import { useTheme } from '../../context/ThemeContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FloatingAiAssistant = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your FitVision AI assistant. How can I help you with your fitness journey today?", sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleInputChange = (e) => {
    if (e.target.value.length <= 2000) setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    const response = await getGeminiResponse(message);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      text: response.text,
      sender: 'bot',
      isError: response.error
    }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        if (!event.target.closest('.fv-ai-toggle')) setIsChatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Theme-aware colour tokens ───────────────────────────────────────────────
  const panel = isDark
    ? 'bg-slate-900 border-emerald-500/20'
    : 'bg-white border-emerald-500/30';

  const header = isDark
    ? 'bg-slate-800 border-slate-700'
    : 'bg-emerald-50 border-emerald-100';

  const headerTitle = isDark ? 'text-white' : 'text-slate-900';
  const headerSub   = isDark ? 'text-slate-400' : 'text-slate-500';

  const messagesBg = isDark ? 'bg-slate-900' : 'bg-gray-50';

  const botBubble = isDark
    ? 'bg-slate-800 text-slate-100'
    : 'bg-white text-slate-800 shadow-sm border border-gray-100';

  const inputSection = isDark
    ? 'bg-slate-800 border-slate-700'
    : 'bg-emerald-50 border-emerald-100';

  const textareaClass = isDark
    ? 'text-slate-100 placeholder-slate-500'
    : 'text-slate-800 placeholder-slate-400';

  const scrollbarColor = isDark ? '#10b981 #1e293b' : '#10b981 #f0fdf4';

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">

      {/* ── Toggle Button ───────────────────────────────────────────────────── */}
      <button
        className="fv-ai-toggle relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Toggle AI Assistant"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 0 18px rgba(16,185,129,0.6), 0 0 36px rgba(5,150,105,0.35)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-emerald-400 pointer-events-none" />
        <div className="relative z-10">
          {isChatOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-7 h-7 text-white" />}
        </div>
      </button>

      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      {isChatOpen && (
        <div
          ref={chatRef}
          className={`absolute bottom-20 right-0 w-[370px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${panel}`}
          style={{ animation: 'chatPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
        >



          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${header}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-sm font-bold leading-tight ${headerTitle}`}>FitVision AI</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className={`text-xs ${headerSub}`}>Always here to help</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-emerald-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Messages ────────────────────────────────────────────────────── */}
          <div
            className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[260px] max-h-[320px] ${messagesBg}`}
            style={{ scrollbarWidth: 'thin', scrollbarColor }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}

                <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[78%]
                  ${msg.sender === 'bot'
                    ? `${botBubble} rounded-tl-sm`
                    : 'text-white rounded-tr-sm'}
                  ${msg.isError ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''}`}
                  style={msg.sender === 'user' ? {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  } : {}}
                >
                  {msg.sender === 'bot' ? (
                    <div className={`prose prose-sm max-w-none
                      ${isDark
                        ? '[&_p]:text-slate-100 [&_strong]:text-white [&_em]:text-emerald-300 [&_li]:text-slate-200 [&_code]:text-emerald-300 [&_code]:bg-black/40 [&_a]:text-emerald-400'
                        : '[&_p]:text-slate-800 [&_strong]:text-slate-900 [&_em]:text-emerald-700 [&_li]:text-slate-700 [&_code]:text-emerald-700 [&_code]:bg-emerald-50 [&_a]:text-emerald-600'}
                      [&_p]:mb-1.5 [&_p:last-child]:mb-0
                      [&_code]:px-1 [&_code]:rounded
                      [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:overflow-x-auto`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="text-white">{msg.text}</span>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing dots */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ───────────────────────────────────────────────────────── */}
          <div className={`border-t ${inputSection}`}>
            <textarea
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={3}
              className={`w-full px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none text-sm leading-relaxed ${textareaClass}`}
              placeholder="Ask about workouts, diet, form tips..."
              style={{ scrollbarWidth: 'none' }}
            />
            <div className="px-4 pb-3 flex justify-end">
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPopIn {
          from { opacity: 0; transform: scale(0.85) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .fv-ai-toggle:hover {
          box-shadow: 0 0 28px rgba(16,185,129,0.8), 0 0 52px rgba(5,150,105,0.5) !important;
        }
      `}</style>
    </div>
  );
};

export { FloatingAiAssistant };
export default FloatingAiAssistant;
