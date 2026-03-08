import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, BookOpen, TrendingUp, Users, Target, Lightbulb, AlertCircle, Brain, Search } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sensei';
  timestamp: Date;
  sources?: string[];
  principle?: string;
}

// Sample knowledge base for demo - in production this would be loaded from vectors
const sampleKnowledge = {
  "toyota_production_system": {
    content: "The Toyota Production System is a manufacturing philosophy that focuses on complete elimination of waste, continuous improvement, and respect for people. It consists of two main pillars: Just-In-Time (Jidoka) and Jidoka (automation with human touch).",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Elimination of Waste"
  },
  "lean_manufacturing": {
    content: "Lean manufacturing is a systematic method for the elimination of waste within a manufacturing system. It focuses on creating more value with less work by identifying and eliminating non-value-adding activities.",
    source: "Lean Thinking - Womack & Jones",
    principle: "Value Creation"
  },
  "kaizen": {
    content: "Kaizen means continuous improvement involving everyone in the organization, from top management to frontline workers. It's about small, incremental changes that add up to significant improvements over time.",
    source: "Gemba Kaizen - Masaaki Imai",
    principle: "Continuous Improvement"
  },
  "jidoka": {
    content: "Jidoka is one of the two pillars of TPS. It means 'automation with a human touch' - machines stop automatically when there's a problem, allowing humans to focus on value-adding work.",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Built-in Quality"
  },
  "just_in_time": {
    content: "Just-In-Time production means making what is needed, when it's needed, and in the amount needed. It requires continuous flow, pull production, and leveling to minimize inventory.",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Flow & Pull"
  }
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple keyword search with semantic understanding
  const searchKnowledge = (query: string) => {
    const queryLower = query.toLowerCase();
    const results = [];

    Object.entries(sampleKnowledge).forEach(([key, data]) => {
      const { content, source, principle } = data;
      
      // Check if query matches any keywords in the content
      const keywords = queryLower.split(' ');
      const contentLower = content.toLowerCase();
      
      let relevanceScore = 0;
      keywords.forEach(keyword => {
        if (contentLower.includes(keyword)) {
          relevanceScore += 1;
        }
      });

      // Also check for semantic matches
      if (queryLower.includes('lean') && contentLower.includes('manufacturing')) relevanceScore += 2;
      if (queryLower.includes('kaizen') && contentLower.includes('improvement')) relevanceScore += 2;
      if (queryLower.includes('waste') && contentLower.includes('elimination')) relevanceScore += 2;
      if (queryLower.includes('toyota') && contentLower.includes('production')) relevanceScore += 2;

      if (relevanceScore > 0) {
        results.push({
          text: content,
          source,
          principle,
          relevance: relevanceScore
        });
      }
    });

    // Sort by relevance and return top 3
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
  };

  const generateAnswer = (query: string, context: any[]) => {
    if (context.length === 0) {
      return "I cannot find information about that topic in the provided lean literature. Perhaps you could ask about Toyota Production System, waste elimination, or continuous improvement?";
    }

    const contextText = context
      .map((result, index) => `[Source ${index + 1}: ${result.source}]\n${result.text}`)
      .join('\n\n');

    // Simple answer generation based on context
    let answer = `Based on the lean literature I've studied:\n\n${contextText}\n\n`;
    
    if (query.toLowerCase().includes('what is')) {
      answer += "The concept you're asking about relates to ";
      const mainConcept = context[0].principle;
      answer += `${mainConcept}. This is fundamental to both Toyota Production System and lean thinking.\n\n`;
    }
    
    answer += "Remember, true understanding comes not just from reading, but from applying these principles at the gemba (the actual place where value is created).";

    return answer;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      try {
        console.log('🔍 Searching for:', inputText);
        const searchResults = searchKnowledge(inputText);
        
        console.log('🤖 Generating answer from context...');
        const answer = generateAnswer(inputText, searchResults);

        const senseiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: answer,
          sender: 'sensei',
          timestamp: new Date(),
          sources: searchResults.map(r => r.source),
          principle: 'Wisdom from Experience',
        };

        setMessages(prev => [...prev, senseiMessage]);
        console.log(`✅ Answer generated using ${searchResults.length} context sources`);
        
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
    }, 1500); // Simulate API call delay
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sensei Header - VSM Style */}
      <div className="relative bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] text-white py-16 px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo + Brand */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#ffd559] rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-[#1a1a1a]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Kaizen Academy Sensei</h1>
                <p className="text-[#ffd559] text-lg opacity-90">Traditional Lean Manufacturing Wisdom</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#" className="text-[#ffd559] hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">Toyota Principles</a>
              <a href="#" className="text-[#ffd559] hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">Lean Tools</a>
              <a href="#" className="text-[#ffd559] hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">Kaizen Methods</a>
            </nav>
          </div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffd559]/10 via-transparent to-transparent opacity-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Technology Card */}
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <Brain className="w-8 h-8 text-[#1a1a1a]" />
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">🧠 Smart Search Technology</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#666666]">
              <div className="flex items-start gap-2">
                <Search className="w-4 h-4 text-[#ffd559] mt-0.5" />
                <div>
                  <strong className="text-[#1a1a1a] block">Vector Embeddings:</strong>
                  Converts text into mathematical representations for semantic understanding
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-[#ffd559] mt-0.5" />
                <div>
                  <strong className="text-[#1a1a1a] block">Query Expansion:</strong>
                  Automatically rephrases questions to improve retrieval accuracy
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface Card */}
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <Bot className="w-6 h-6 text-[#ffd559]" />
                Ask Your Sensei
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl h-[450px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex justify-end max-w-[85%]"
                    style={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    <div
                      className={message.sender === 'sensei' 
                        ? 'bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] text-white p-4 p-5 rounded-xl shadow-md' 
                        : 'bg-gray-100 text-[#1a1a1a] p-4 p-5 rounded-xl shadow-sm'}
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
                        <div className="mt-3 pt-3 border-t border-t-[rgba(255,213,89,0.3)] text-xs italic text-[#ffd559]">
                          Principle: {message.principle}
                        </div>
                      )}
                      {message.sources && (
                        <div className="mt-2 pt-2 border-t border-t-[rgba(255,213,89,0.3)] text-xs opacity-80">
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
                    <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] text-white p-4 p-5 rounded-xl shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4" />
                        <span className="text-sm font-medium">Sensei</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-[#ffd559] rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[#ffd559] rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 bg-[#ffd559] rounded-full animate-pulse animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your sensei about Toyota Production System, lean tools, or kaizen methods..."
                    className="w-full p-4 p-5 border border-[#e5e5e5] rounded-xl resize-none min-h-[60px] max-h-[140px] bg-[#fafafa] outline-none text-sm"
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className={inputText.trim() && !isLoading
                    ? 'bg-[#1a1a1a] text-white border-none rounded-xl p-4 p-6 flex items-center gap-2 cursor-pointer transition-all duration-300 text-sm font-medium' 
                    : 'bg-gray-300 text-white border-none rounded-xl p-4 p-6 flex items-center gap-2 cursor-not-allowed transition-all duration-300 text-sm font-medium'}
                >
                  <Send className="w-4 h-4" />
                  Ask Sensei
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Philosophy Card */}
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#1a1a1a] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1a1a1a] block mb-1">Smart Search Philosophy:</strong>
              <p className="text-sm text-[#666666] leading-relaxed">
                This Sensei uses intelligent keyword matching with semantic understanding. Ask "What is lean?" and it will find content about lean manufacturing, lean methodology, or lean principles automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaizenSensei;
