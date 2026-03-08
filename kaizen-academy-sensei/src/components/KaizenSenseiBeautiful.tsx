import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, BookOpen, TrendingUp, Users, Target, Lightbulb, AlertCircle, Brain, Search, Clock, Package, Zap } from 'lucide-react';

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
      {/* Hero Section - VSM Style */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-orange-900/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-amber-400">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight mb-2">Kaizen Academy Sensei</h1>
                <p className="text-amber-300 text-xl font-medium">Traditional Lean Manufacturing Wisdom</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              "The path to lean mastery is not found in books alone, but in wisdom of practice and humility of continuous learning."
            </p>
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Target className="w-5 h-5 text-amber-400" />
                <span className="text-amber-200 font-medium">Toyota Principles</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span className="text-amber-200 font-medium">Lean Tools</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span className="text-amber-200 font-medium">Kaizen Methods</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Smart Search</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Advanced semantic understanding that finds relevant content even when you use different words or phrases.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Vector embeddings for semantic matching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Query expansion for better results</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Real-time</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Instant responses with loading states and smooth animations for a professional conversational experience.
            </p>
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Fast processing</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Knowledge Base</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Built on Toyota Production System principles and established lean manufacturing literature.
            </p>
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">5 core concepts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="mt-12 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-6">
            <div className="flex items-center gap-4">
              <Bot className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold">Ask Your Sensei</h3>
            </div>
          </div>

          <div className="p-8">
            {/* Chat Messages */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex justify-end max-w-[85%]"
                    style={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    <div
                      className={message.sender === 'sensei' 
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white p-5 rounded-2xl shadow-lg' 
                        : 'bg-white text-gray-900 p-5 rounded-2xl shadow-md border border-gray-200'}
                      style={{ 
                        borderBottomLeftRadius: message.sender === 'sensei' ? '1.5rem' : '0.5rem',
                        borderBottomRightRadius: message.sender === 'sensei' ? '0.5rem' : '1.5rem'
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {message.sender === 'sensei' ? <Bot className="w-5 h-5 text-amber-400" /> : <Users className="w-5 h-5 text-gray-600" />}
                        <span className="text-sm font-semibold">
                          {message.sender === 'sensei' ? 'Sensei' : 'Student'}
                        </span>
                      </div>
                      <div className="leading-relaxed text-sm">
                        {message.text}
                      </div>
                      {message.principle && (
                        <div className="mt-4 pt-4 border-t border-gray-200 text-xs italic text-amber-600">
                          Principle: {message.principle}
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
                  <div className="flex justify-start max-w-[85%]">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-5 rounded-2xl shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Bot className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-semibold">Sensei</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your sensei about Toyota Production System, lean tools, or kaizen methods..."
                    className="w-full p-4 border-2 border-gray-300 rounded-xl resize-none min-h-[80px] max-h-[160px] bg-white text-gray-900 placeholder-gray-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className={inputText.trim() && !isLoading
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none rounded-xl p-4 px-8 flex items-center gap-3 cursor-pointer hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg font-semibold' 
                    : 'bg-gray-300 text-gray-500 border-none rounded-xl p-4 px-8 flex items-center gap-3 cursor-not-allowed transition-all duration-300 font-semibold'}
                >
                  <Send className="w-5 h-5" />
                  Ask Sensei
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">The Sensei Philosophy</h4>
              <p className="text-gray-700 leading-relaxed">
                This AI assistant embodies the traditional Japanese sensei approach - wise, patient, and deeply knowledgeable about lean manufacturing. 
                It uses intelligent search to understand your questions and provide answers based on established Toyota Production System principles.
              </p>
              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Semantic understanding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Context-aware responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Traditional wisdom</span>
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
