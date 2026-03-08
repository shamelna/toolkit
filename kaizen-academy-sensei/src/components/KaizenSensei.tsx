import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, BookOpen, TrendingUp, Users, Target, Lightbulb, AlertCircle, Search, Brain } from 'lucide-react';
import SemanticSearchService from '../services/SemanticSearchService.js';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sensei';
  timestamp: Date;
  sources?: string[];
  principle?: string;
}

interface KnowledgeBase {
  [key: string]: {
    content: string;
    principle?: string;
    source: string;
    page?: string;
    category: 'tps' | 'tools' | 'kaizen';
  };
}

const KaizenSensei: React.FC = () => {
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
    const service = new SemanticSearchService();
    service.initialize().then(() => {
      setSearchService(service);
      console.log('🧠 Semantic search service ready');
    }).catch(error => {
      console.error('Failed to initialize search service:', error);
    });
  }, []);
      category: "tps"
    },
    just_in_time: {
      content: "Just-In-Time means making what is needed, when it is needed, and in the amount needed. It requires continuous flow, pull production, and leveling (heijunka). The goal is to minimize inventory and maximize flow. Remember: inventory is the root of all evil in production.",
      principle: "Flow & Pull",
      source: "Toyota Production System - Taiichi Ohno",
      page: "Page 28",
      category: "tps"
    },
    jidoka: {
      content: "Jidoka means 'automation with a human touch.' Machines stop automatically when abnormality occurs, preventing defect production. Workers focus on value-adding activities while machines handle repetitive work. This builds quality into the process rather than inspecting it later.",
      principle: "Built-in Quality",
      source: "The Toyota Way - Jeffrey Liker",
      page: "Page 89",
      category: "tps"
    },
    heijunka: {
      content: "Heijunka is production leveling that smooths the workload to create consistent flow. It prevents overburden (muri) and unevenness (mura). By leveling production volume and product mix, we create stability for continuous improvement.",
      principle: "Stability & Consistency",
      source: "Lean Production Simplified - Dennis Pascal",
      page: "Page 67",
      category: "tools"
    },
    kaizen: {
      content: "Kaizen is continuous improvement involving everyone, everywhere, every day. It's not about dramatic breakthroughs but small, incremental improvements that compound over time. Gemba kaizen means going to the actual place where value is created to observe and improve.",
      principle: "Continuous Improvement",
      source: "Gemba Kaizen - A Commonsense Approach",
      page: "Page 23",
      category: "kaizen"
    },
    muda_waste: {
      content: "Muda (waste) has seven types: Overproduction, Waiting, Transportation, Over-processing, Inventory, Motion, and Defects. Later, an 8th waste was added: Underutilized human potential. The wise sensei teaches to see waste everywhere and eliminate it systematically.",
      principle: "Elimination of Waste",
      source: "Toyota Production System - Taiichi Ohno",
      page: "Page 19",
      category: "tps"
    },
    standard_work: {
      content: "Standardized Work is the foundation for kaizen. It defines the current best method and provides a baseline for improvement. Without standards, there can be no kaizen. Standard Work consists of takt time, work sequence, and standard work-in-process.",
      principle: "Standardization",
      source: "The Toyota Way - Jeffrey Liker",
      page: "Page 156",
      category: "tools"
    },
    poka_yoke: {
      content: "Poka-yoke means 'mistake-proofing.' It's a mechanism that prevents errors or makes them immediately visible. Examples include guides that only allow parts to fit one way, or systems that stop machines when abnormalities occur. This is practical wisdom in action.",
      principle: "Built-in Quality",
      source: "Lean Production Simplified - Dennis Pascal",
      page: "Page 84",
      category: "tools"
    },
    value_stream: {
      content: "A value stream is all actions required to bring a product from concept to customer. Value Stream Mapping helps us see the flow and identify waste. The sensei asks: Does this step add value from the customer's perspective? If not, why do we do it?",
      principle: "Customer Value",
      source: "Creating a Lean Culture - David Mann",
      page: "Page 45",
      category: "tools"
    },
    respect_people: {
      content: "Respect for People is fundamental to Toyota's philosophy. It means developing people to their fullest potential, listening to their ideas, and creating a culture where everyone contributes to improvement. The company grows as people grow.",
      principle: "Respect for People",
      source: "The Toyota Way - Jeffrey Liker",
      page: "Page 67",
      category: "tps"
    },
    genchi_genbutsu: {
      content: "Genchi Genbutsu means 'go and see for yourself.' The sensei teaches that we must go to the gemba (actual place) to understand the real situation. Reports and data are useful, but direct observation reveals the truth.",
      principle: "Direct Observation",
      source: "The Toyota Way - Jeffrey Liker",
      page: "Page 112",
      category: "kaizen"
    },
    hoshin_kanri: {
      content: "Hoshin Kanri is policy deployment that aligns the entire organization toward common goals. It connects strategic objectives to daily actions through catchball process and regular reviews. This ensures everyone pulls in the same direction.",
      principle: "Strategic Alignment",
      source: "Creating a Lean Culture - David Mann",
      page: "Page 78",
      category: "tools"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findSenseiAnswer = (question: string): { answer: string; sources: string[]; principle?: string } => {
    const lowerQuestion = question.toLowerCase();
    const sources: string[] = [];
    
    // Check for keywords in the question
    for (const [key, value] of Object.entries(knowledgeBase)) {
      const keywords = key.split('_');
      const hasKeyword = keywords.some(keyword => 
        lowerQuestion.includes(keyword) || 
        lowerQuestion.includes(keyword.replace('_', ' ')) ||
        (key.includes('waste') && lowerQuestion.includes('muda')) ||
        (key.includes('just_in_time') && lowerQuestion.includes('jit')) ||
        (key.includes('respect_people') && lowerQuestion.includes('respect'))
      );
      
      if (hasKeyword) {
        sources.push(`${value.source} - ${value.page || 'Multiple Pages'}`);
        return {
          answer: value.content,
          sources,
          principle: value.principle
        };
      }
    }

    // Check for general categories
    if (lowerQuestion.includes('toyota') || lowerQuestion.includes('tps')) {
      return {
        answer: "The Toyota Production System is the foundation of lean thinking. It emphasizes eliminating waste, continuous improvement, and respect for people. The system is built on Just-In-Time and Jidoka, with kaizen as the driving philosophy. What specific aspect of TPS would you like to explore?",
        sources: ["Toyota Production System - Taiichi Ohno", "The Toyota Way - Jeffrey Liker"],
        principle: "System Thinking"
      };
    }

    if (lowerQuestion.includes('waste') || lowerQuestion.includes('muda')) {
      return {
        answer: "The eight wastes of lean are: Overproduction, Waiting, Transportation, Over-processing, Inventory, Motion, Defects, and Underutilized human potential. The wise sensei teaches to see waste everywhere and eliminate it systematically. Which type of waste concerns you most?",
        sources: ["Toyota Production System - Taiichi Ohno", "Lean Production Simplified - Dennis Pascal"],
        principle: "Elimination of Waste"
      };
    }

    if (lowerQuestion.includes('kaizen')) {
      return {
        answer: "Kaizen is the philosophy of continuous improvement involving everyone. It's not about dramatic breakthroughs but small, incremental improvements that compound over time. True kaizen requires gemba (going to the actual place) and direct observation. How can I help you implement kaizen in your context?",
        sources: ["Gemba Kaizen - A Commonsense Approach"],
        principle: "Continuous Improvement"
      };
    }

    if (lowerQuestion.includes('tool') || lowerQuestion.includes('implement')) {
      return {
        answer: "Lean implementation tools include Standardized Work, Value Stream Mapping, Poka-yoke, Heijunka, and Hoshin Kanri. Each tool serves a specific purpose in the lean journey. Which tool would you like to understand better?",
        sources: ["Lean Production Simplified - Dennis Pascal", "Creating a Lean Culture - David Mann"],
        principle: "Practical Application"
      };
    }

    return {
      answer: "I can guide you in Toyota Production System fundamentals, lean implementation tools, and kaizen methodologies. Please ask about specific concepts like Just-In-Time, Jidoka, waste elimination, standardized work, or continuous improvement. The path to lean mastery begins with understanding.",
      sources: ["Kaizen Academy Sensei Knowledge Base"],
      principle: "Foundational Learning"
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate Sensei contemplation time
    setTimeout(() => {
      const { answer, sources, principle } = findSenseiAnswer(inputText);
      
      const senseiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'sensei',
        timestamp: new Date(),
        sources,
        principle
      };

      setMessages(prev => [...prev, senseiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tps': return <Target className="w-4 h-4" />;
      case 'tools': return <Lightbulb className="w-4 h-4" />;
      case 'kaizen': return <TrendingUp className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
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
          "The path to lean mastery is not found in books alone, but in the wisdom of practice and the humility of continuous learning."
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

      {/* Knowledge Areas */}
      <div className="bg-[rgba(139,69,19,0.1)] border-2 border-[var(--border-color)] rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-[var(--dark)] mb-4">
          📚 Areas of Wisdom
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(knowledgeBase).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-1">
                {getCategoryIcon(value.category)}
                <strong className="text-[var(--dark)]">
                  {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </strong>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {value.principle} • {value.source.split(' - ')[0]}
              </div>
            </div>
          ))}
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
          disabled={!inputText.trim() || isLoading}
          className={inputText.trim() && !isLoading 
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
          <strong className="text-[var(--dark)] block mb-1">Teaching Philosophy:</strong>
          This Sensei draws wisdom exclusively from the Toyota Production System and established lean literature. Answers are grounded in proven principles and practical experience. For deep implementation, always combine this knowledge with gemba observation.
        </div>
      </div>
    </div>
  );
};

export default KaizenSensei;
