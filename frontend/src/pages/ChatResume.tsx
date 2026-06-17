import { useUser } from '@clerk/react';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

const ChatResume = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const PORT = import.meta.env.VITE_BACKEND_PORT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post(`${PORT}/api/user/query`, {
        userId,
        query: trimmed,
      });
      const answer = res.data.response.kwargs.content;
      setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
          <Bot size={18} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Resume assistant</p>
          <p className="text-xs text-gray-400">Ask anything about your resume</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 min-h-[200px] flex flex-col gap-3">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[160px] gap-2">
            <MessageCircle size={28} className="text-gray-300" />
            <p className="text-xs text-gray-400">Your conversation will appear here</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[11px] text-gray-400 px-1">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white border border-gray-100 text-gray-800'
                      : 'bg-blue-50 text-blue-900'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="flex gap-1.5 px-3.5 py-3 bg-blue-50 rounded-xl">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-2.5">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="e.g. How should I tailor my resume for a backend role?"
          className="resize-none border-none outline-none text-sm text-gray-800 placeholder-gray-300 bg-transparent w-full leading-relaxed"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">
            Enter to send · Shift+Enter for newline
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatResume;