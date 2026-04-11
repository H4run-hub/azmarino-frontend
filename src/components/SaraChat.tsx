'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { BotIcon, CloseIcon, PlayIcon } from './Icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SaraChat() {
  const { t, lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          language: lang,
          history: messages
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.message || 'Error processing request.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Support is currently unavailable. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <BotIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Sara AI</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Global Concierge</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center py-10 px-6">
                <p className="text-sm font-bold text-gray-900 mb-2">Welcome to Azmarino</p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  I am Sara, your AI concierge. How can I assist you with your premium shopping experience today?
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Sara anything..."
              className="flex-1 bg-gray-100 border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none transition-all"
            />
            <button type="submit" disabled={loading} className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
              <PlayIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-white text-black border border-gray-100' : 'bg-black text-white'
        }`}
      >
        {isOpen ? <CloseIcon className="w-6 h-6" /> : <BotIcon className="w-7 h-7" />}
      </button>
    </div>
  );
}
