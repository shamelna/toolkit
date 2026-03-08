import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, BookOpen, TrendingUp, Users, Target, Lightbulb, AlertCircle, Brain, Search, Clock, Package, Zap, Sparkles, Layers, ChevronRight } from 'lucide-react';

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
    content: "The Toyota Production System is a manufacturing philosophy that focuses on complete elimination of waste, continuous improvement, and respect for people. It consists of two main pillars: Just-In-Time and Jidoka (automation with human touch).",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Elimination of Waste"
  },
  "lean_manufacturing": {
    content: "Lean manufacturing is a systematic method for elimination of waste within a manufacturing system. It focuses on creating more value with less work by identifying and eliminating non-value-adding activities.",
    source: "Lean Thinking - Womack & Jones",
    principle: "Value Creation"
  },
  "kaizen": {
    content: "Kaizen means continuous improvement involving everyone in the organization, from top management to frontline workers. It's about small, incremental changes that add up to significant improvements over time.",
    source: "Gemba Kaizen - Masaaki Imai",
    principle: "Continuous Improvement"
  },
  "jidoka": {
    content: "Jidoka is one of two pillars of TPS. It means 'automation with a human touch' - machines stop automatically when there's a problem, allowing humans to focus on value-adding work.",
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
      
      // Check if query matches any keywords in content
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
      answer += `${mainConcept}. This is fundamental to both the Toyota Production System and lean thinking.\n\n`;
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section - Premium Wood Style */}
      <div className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white py-24 px-8 overflow-hidden">
        {/* Wood texture overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-800/40"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(139, 69, 19, 0.1) 40px,
              rgba(139, 69, 19, 0.1) 41px
            )`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center items-center gap-8 mb-12">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-amber-400/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-3xl"></div>
                  <Bot className="w-12 h-12 text-white relative z-10" />
                </div>
                <div className="text-left">
                  <h1 className="text-6xl font-black tracking-tight mb-3 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                    Kaizen Academy Sensei
                  </h1>
                  <p className="text-amber-200 text-xl font-medium">Traditional Lean Manufacturing Wisdom</p>
                </div>
              </div>
            </div>
            
            <p className="text-amber-100 text-xl max-w-4xl mx-auto leading-relaxed font-light">
              "The path to lean mastery is not found in books alone, but in wisdom of practice and humility of continuous learning."
            </p>
            
            <div className="flex justify-center gap-8 mt-12">
              <div className="group flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 cursor-pointer">
                <Target className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors" />
                <span className="text-amber-100 font-medium group-hover:text-white transition-colors">Toyota Principles</span>
                <ChevronRight className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div className="group flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 cursor-pointer">
                <Lightbulb className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors" />
                <span className="text-amber-100 font-medium group-hover:text-white transition-colors">Lean Tools</span>
                <ChevronRight className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div className="group flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 cursor-pointer">
                <TrendingUp className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors" />
                <span className="text-amber-100 font-medium group-hover:text-white transition-colors">Kaizen Methods</span>
                <ChevronRight className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Feature Cards with Wood Theme */}
          <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl border border-amber-200/50 p-8 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-transparent to-orange-100/30 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-400/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-2xl"></div>
                  <Brain className="w-7 h-7 text-white relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">Smart Search</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Advanced semantic understanding that finds relevant content even when you use different words or phrases.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl backdrop-blur-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-md"></div>
                  <span className="text-sm font-medium text-gray-800">Vector embeddings for semantic matching</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl backdrop-blur-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-md"></div>
                  <span className="text-sm font-medium text-gray-800">Query expansion for better results</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl border border-green-200/50 p-8 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-transparent to-emerald-100/30 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-green-400/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/20 rounded-2xl"></div>
                  <Clock className="w-7 h-7 text-white relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Real-time</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Instant responses with loading states and smooth animations for a professional conversational experience.
              </p>
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl backdrop-blur-sm">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-800">Fast processing</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl border border-blue-200/50 p-8 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-transparent to-indigo-100/30 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-blue-400/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-500/20 rounded-2xl"></div>
                  <Package className="w-7 h-7 text-white relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Knowledge Base</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Built on Toyota Production System principles and established lean manufacturing literature.
              </p>
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">5 core concepts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface - Premium Design */}
        <div className="relative bg-gradient-to-br from-gray-50 to-amber-50 rounded-3xl shadow-3xl border border-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-gray-100/10 to-amber-200/20 opacity-60"></div>
          
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-10 py-8 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-300/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-orange-400/20 rounded-2xl"></div>
                    <Bot className="w-8 h-8 text-white relative z-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-amber-200" />
                    Ask Your Sensei
                  </h3>
                  <p className="text-amber-100 mt-2">Get instant answers from traditional lean wisdom</p>
                </div>
              </div>
            </div>

            <div className="p-10">
              {/* Chat Messages */}
              <div className="bg-white rounded-2xl border border-gray-200 h-[500px] flex flex-col shadow-inner">
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex justify-end max-w-[85%] animate-fade-in"
                      style={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                    >
                      <div
                        className={message.sender === 'sensei' 
                          ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white p-6 rounded-2xl shadow-2xl border-2 border-gray-600/50' 
                          : 'bg-gradient-to-br from-white via-gray-50 to-amber-50 text-gray-900 p-6 rounded-2xl shadow-xl border-2 border-amber-200/50'}
                        style={{ 
                          borderBottomLeftRadius: message.sender === 'sensei' ? '2rem' : '0.75rem',
                          borderBottomRightRadius: message.sender === 'sensei' ? '0.75rem' : '2rem'
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          {message.sender === 'sensei' ? 
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                              <Bot className="w-5 h-5 text-white" />
                            </div> : 
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center shadow-md">
                              <Users className="w-5 h-5 text-amber-700" />
                            </div>
                          }
                          <span className="text-sm font-bold">
                            {message.sender === 'sensei' ? 'Sensei' : 'Student'}
                          </span>
                        </div>
                        <div className="leading-relaxed text-sm">
                          {message.text}
                        </div>
                        {message.principle && (
                          <div className="mt-4 pt-4 border-t border-gray-200 text-xs italic text-amber-600 font-medium">
                            <div className="flex items-center gap-2 mb-1">
                              <Layers className="w-4 h-4" />
                              Principle: {message.principle}
                            </div>
                          </div>
                        )}
                        {message.sources && (
                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span>Sources: {message.sources.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start max-w-[85%] animate-fade-in">
                      <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white p-6 rounded-2xl shadow-2xl border-2 border-gray-600/50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-bold">Sensei</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse shadow-lg"></div>
                          <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse animation-delay-200 shadow-lg"></div>
                          <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse animation-delay-400 shadow-lg"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="mt-6 bg-gradient-to-br from-gray-50 to-amber-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask your sensei about Toyota Production System, lean tools, or kaizen methods..."
                      className="w-full p-5 border-2 border-gray-300 rounded-2xl resize-none min-h-[100px] max-h-[180px] bg-white text-gray-900 placeholder-gray-500 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all text-sm shadow-inner"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className={inputText.trim() && !isLoading
                      ? 'group relative bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none rounded-2xl p-6 px-10 flex items-center gap-4 cursor-pointer hover:from-amber-600 hover:to-orange-700 transition-all duration-500 shadow-2xl font-bold' 
                      : 'bg-gray-300 text-gray-500 border-none rounded-2xl p-6 px-10 flex items-center gap-4 cursor-not-allowed transition-all duration-500 font-bold'}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Send className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Ask Sensei</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section - Premium */}
        <div className="mt-16 relative bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-3xl p-12 border-2 border-amber-200/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-yellow-200/20 opacity-60"></div>
          <div className="relative z-10">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-2xl"></div>
                  <AlertCircle className="w-8 h-8 text-white relative z-10" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-amber-600" />
                  The Sensei Philosophy
                </h4>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  This AI assistant embodies the traditional Japanese sensei approach - wise, patient, and deeply knowledgeable about lean manufacturing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-md"></div>
                    <span className="text-sm font-medium text-gray-800">Semantic understanding</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-md"></div>
                    <span className="text-sm font-medium text-gray-800">Context-aware responses</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-md"></div>
                    <span className="text-sm font-medium text-gray-800">Traditional wisdom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaizenSensei;
