'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SendHorizonal, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What is the Toyota Production System?',
  'How do I identify waste in my process?',
  'Explain A3 thinking',
  'What is Value Stream Mapping?',
  'How do I start a Kaizen event?',
  'What are the 7 QC tools?',
];

export default function SenseiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;
    setStarted(true);

    const userMessage: Message = { role: 'user', content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      abortRef.current = new AbortController();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error('Failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const finalAccumulated = accumulated;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: finalAccumulated };
            return updated;
          });
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'The path forward is unclear right now. Please try again.',
          };
          return updated;
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function resetConversation() {
    setMessages([]);
    setStarted(false);
    setInput('');
  }

  return (
    <div className="grain min-h-screen bg-kaizen-dark flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,213,89,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px]"
          style={{ background: 'radial-gradient(circle, rgba(255,213,89,0.03) 0%, transparent 70%)' }} />
        {/* Decorative Japanese character */}
        <div className="absolute top-8 right-8 font-display text-[120px] leading-none opacity-[0.03] select-none pointer-events-none" style={{ color: '#ffd559' }}>
          改
        </div>
        <div className="absolute bottom-8 left-8 font-display text-[80px] leading-none opacity-[0.025] select-none pointer-events-none" style={{ color: '#ffd559' }}>
          善
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-kaizen-yellow/30">
            <img
              src="http://practitioner.kaizenacademy.education/logo_round.png"
              alt="Kaizen Academy"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-display text-sm font-light tracking-widest uppercase text-kaizen-yellow/80">
              Kaizen Academy
            </div>
            <div className="text-xs text-white/30 tracking-wider -mt-0.5">
              SENSEI  ·  改善先生
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {started && (
            <button
              onClick={resetConversation}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded border border-white/10 hover:border-white/20"
            >
              <RotateCcw size={12} />
              New conversation
            </button>
          )}
          <a
            href="/admin"
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            ···
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-6">

        {/* Landing / empty state */}
        {!started && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 stagger-children">
            <div className="mb-2 font-display text-6xl font-light text-kaizen-yellow/20 select-none">
              改善
            </div>
            <h1 className="font-display text-3xl font-light text-white/90 text-center mb-2">
              Ask the Sensei
            </h1>
            <p className="text-white/40 text-center text-sm max-w-md leading-relaxed mb-10">
              Your guide to Lean thinking, the Toyota Production System, and the art of continuous improvement.
            </p>

            <div className="grid grid-cols-2 gap-2 w-full max-w-2xl">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left px-4 py-3 rounded-lg border border-white/8 bg-white/3 hover:border-kaizen-yellow/30 hover:bg-kaizen-yellow/5 transition-all duration-200 text-sm text-white/60 hover:text-white/90 group"
                >
                  <span className="text-kaizen-yellow/40 group-hover:text-kaizen-yellow/60 mr-1.5 text-xs">→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {started && (
          <div className="flex-1 py-8 space-y-6 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="animate-fade-up"
                style={{ animationDelay: `${(i % 3) * 0.05}s`, animationFillMode: 'both' }}
              >
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-kaizen-yellow/10 border border-kaizen-yellow/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white/90 leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden border border-kaizen-yellow/20 mt-0.5">
                      <img
                        src="http://practitioner.kaizenacademy.education/logo_round.png"
                        alt="Sensei"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {msg.content === '' && isLoading && i === messages.length - 1 ? (
                        <div className="flex items-center gap-1.5 py-3">
                          {[0, 1, 2].map(j => (
                            <div
                              key={j}
                              className="thinking-dot w-1.5 h-1.5 rounded-full bg-kaizen-yellow/50 animate-thinking"
                              style={{ animationDelay: `${j * 0.2}s` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="sensei-message text-sm text-white/80 leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        <div className="mt-auto pt-4">
          <div className="relative flex items-end gap-2 bg-kaizen-grey/80 backdrop-blur border border-white/8 rounded-2xl px-4 py-3 focus-within:border-kaizen-yellow/30 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Lean, Kaizen, or continuous improvement…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 resize-none outline-none leading-relaxed max-h-32"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-kaizen-yellow disabled:bg-kaizen-yellow/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
            >
              <SendHorizonal size={14} className="text-black disabled:text-white/20" />
            </button>
          </div>
          <p className="text-center text-white/20 text-xs mt-2">
            Sensei draws from Kaizen Academy's knowledge base · Certified by Kaizen Academy Australia
          </p>
        </div>
      </main>
    </div>
  );
}
