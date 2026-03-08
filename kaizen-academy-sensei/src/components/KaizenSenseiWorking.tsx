import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, BookOpen, TrendingUp, Users, Target, Lightbulb, AlertCircle, Brain, Search } from 'lucide-react';
import SimpleVectorSearch from '../services/SimpleVectorSearch.js';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sensei';
  timestamp: Date;
  sources?: string[];
  principle?: string;
}

const KaizenSensei = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome, student. I am your guide on the path to lean mastery. My wisdom comes from the Toyota Production System and established lean literature. What would you like to learn today?',
      sender: 'sensei',
      timestamp: new Date(),
      principle: 'Continuous Learning',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchService, setSearchService] = useState(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize semantic search service
    const service = new SimpleVectorSearch();
    setSearchService(service);
    console.log('🧠 Semantic search service ready');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !searchService) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Perform semantic search
      console.log('🔍 Searching for:', inputText);
      const searchResults = await searchService.search(inputText, 5);
      
      if (searchResults.length === 0) {
        const noResultsMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I cannot find information about that topic in the provided lean literature. Perhaps you could ask about Toyota Production System, waste elimination, or continuous improvement?',
          sender: 'sensei',
          timestamp: new Date(),
          principle: 'Respect for People',
        };
        setMessages(prev => [...prev, noResultsMessage]);
        setIsLoading(false);
        return;
      }

      // Generate answer using LLM
      console.log('🤖 Generating answer from context...');
      const answerResponse = await searchService.generateAnswer(inputText, searchResults);

      const senseiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answerResponse.answer,
        sender: 'sensei',
        timestamp: new Date(),
        sources: answerResponse.sources,
        principle: 'Wisdom from Experience',
      };

      setMessages(prev => [...prev, senseiMessage]);
      console.log(`✅ Answer generated using ${answerResponse.contextUsed} context sources`);
      
    } catch (error) {
      console.error('Error processing question:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error while processing your question. Please try again or rephrase your question.',
        sender: 'sensei',
        timestamp: new Date(),
        principle: 'Problem Solving',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sensei Header */}
      <div className="bg-gradient-to-r from-[var(--dark)] to-[var(--grey)] text-white p-8 rounded-2xl mb-8 border-4 border-[var(--primary-yellow)] text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Bot className="w-10 h-10 text-[var(--primary-yellow)]" />
          <h1 className="text-3xl font-bold text-[var(--primary-yellow)]">Kaizen Academy Sensei</h1>
        </div>
        <p className="text-lg italic mb-6 text-[var(--white)] opacity-90">
          "The path to lean mastery is not found in books alone, but in wisdom of practice and humility of continuous learning."
        </p>
        <div className="flex items-center justify-center gap-6 text-base">
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--primary-yellow)]" />
            Toyota Principles
          </span>
          <span className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[var(--primary-yellow)]" />
            Lean Tools
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--primary-yellow)]" />
            Kaizen Methods
          </span>
        </div>
      </div>

      {/* Semantic Search Info */}
      <div className="bg-[rgba(139,69,19,0.1)] border-2 border-[var(--border-color)] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-[var(--dark)]" />
          <h3 className="text-xl font-bold text-[var(--dark)]">
            🧠 Semantic Search Technology
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-start gap-2">
            <Search className="w-4 h-4 text-[var(--primary-yellow)] mt-0.5" />
            <div>
              <strong className="text-[var(--dark)] block">Vector Embeddings:</strong>
              Converts text into mathematical representations for semantic understanding
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-[var(--primary-yellow)] mt-0.5" />
            <div>
              <strong className="text-[var(--dark)] block">Query Expansion:</strong>
              Automatically rephrases questions to improve retrieval accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border-2 border-[var(--border-color)] rounded-2xl h-[450px] flex flex-col mb-5 shadow-lg">
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex justify-end max-w-[85%]"
              style={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div
                className={message.sender === 'sensei' 
                  ? 'bg-gradient-to-r from-[var(--dark)] to-[var(--grey)] text-white p-4 p-5 rounded-2xl shadow-md' 
                  : 'bg-gray-100 text-[var(--dark)] p-4 p-5 rounded-2xl shadow-sm'}
                style={{ 
                  borderBottomLeftRadius: message.sender === 'sensei' ? '1rem' : '0.25rem',
                  borderBottomRightRadius: message.sender === 'sensei' ? '0.25rem' : '1rem'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.sender === 'sensei' ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {message.sender === 'sensei' ? 'Sensei' : 'Student'}
                  </span>
                </div>
                <div className="leading-relaxed text-sm">
                  {message.text}
                </div>
                {message.principle && (
                  <div className="mt-3 pt-3 border-t border-t-[rgba(244,228,212,0.3)] text-xs italic text-[var(--primary-yellow)]">
                    Principle: {message.principle}
                  </div>
                )}
                {message.sources && (
                  <div className="mt-2 pt-2 border-t border-t-[rgba(244,228,212,0.3)] text-xs opacity-80">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Sources: {message.sources.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start max-w-[85%]">
              <div className="bg-gradient-to-r from-[var(--dark)] to-[var(--grey)] text-white p-4 p-5 rounded-2xl shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-medium">Sensei</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 bg-[var(--primary-yellow)] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[var(--primary-yellow)] rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-[var(--primary-yellow)] rounded-full animate-pulse animation-delay-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-2 border-[var(--border-color)] rounded-2xl p-5 flex gap-4 items-end shadow-lg">
        <div className="flex-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your sensei about Toyota Production System, lean tools, or kaizen methods..."
            className="w-full p-4 p-5 border-2 border-[var(--border-color)] rounded-xl resize-none min-h-[60px] max-h-[140px] bg-[var(--light-grey)] outline-none text-sm"
            rows={1}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading || !searchService}
          className={inputText.trim() && !isLoading && searchService
            ? 'bg-[var(--dark)] text-white border-none rounded-xl p-4 p-6 flex items-center gap-2 cursor-pointer transition-all duration-300 text-sm font-medium' 
            : 'bg-gray-300 text-white border-none rounded-xl p-4 p-6 flex items-center gap-2 cursor-not-allowed transition-all duration-300 text-sm font-medium'}
        >
          <Send className="w-4 h-4" />
          Ask Sensei
        </button>
      </div>

      {/* Teaching Philosophy */}
      <div className="flex items-start gap-3 mt-5 p-4 bg-[rgba(139,69,19,0.05)] rounded-lg text-sm text-[var(--text-muted)] border border-[rgba(139,69,19,0.2)]">
        <AlertCircle className="w-5 h-5 text-[var(--dark)] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--dark)] block mb-1">Semantic Search Philosophy:</strong>
          This Sensei uses vector embeddings to understand the meaning behind your questions, not just keywords. Ask "What is lean?" and it will find content about lean manufacturing, lean methodology, or lean principles automatically.
        </div>
      </div>
    </div>
  );
};

export default KaizenSensei;
