import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
}

interface KnowledgeBase {
  [key: string]: {
    content: string;
    page?: string;
    section?: string;
  };
}

const KaizenBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm the Kaizen Academy AI Assistant. I can answer questions about Value Stream Mapping based on our comprehensive PDF guides. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Knowledge base extracted from VSM PDF content
  const knowledgeBase: KnowledgeBase = {
    takt_time: {
      content: "Takt Time is the rate at which products must be produced to meet customer demand. Formula: Takt Time = Available Production Time / Customer Demand. It represents the heartbeat of the process and sets the pace for production.",
      page: "Page 15",
      section: "Takt Time Calculator"
    },
    cycle_time: {
      content: "Cycle Time is the actual time it takes to complete one unit of work. It should be less than or equal to Takt Time to meet customer demand. If Cycle Time > Takt Time, you cannot meet customer demand.",
      page: "Page 16", 
      section: "Process Analysis"
    },
    lead_time: {
      content: "Lead Time is the total time from when a customer places an order to when they receive it. It includes processing time, waiting time, and transport time. Formula: Lead Time = Processing Time + Waiting Time.",
      page: "Page 22",
      section: "Lead Time Analysis"
    },
    value_added_ratio: {
      content: "Value Added Ratio (VAR) measures the percentage of time that adds value to the product. Formula: VAR = (Value Added Time / Total Lead Time) × 100%. A higher VAR indicates more efficient processes.",
      page: "Page 24",
      section: "Efficiency Metrics"
    },
    inventory_turns: {
      content: "Inventory Turns measures how many times inventory is sold and replaced over a period. Formula: Inventory Turns = Cost of Goods Sold / Average Inventory. Higher turns indicate better inventory management.",
      page: "Page 28",
      section: "Inventory Analysis"
    },
    oee: {
      content: "Overall Equipment Effectiveness (OEE) measures manufacturing productivity. Formula: OEE = Availability × Performance × Quality. World-class OEE is 85%.",
      page: "Page 35",
      section: "Equipment Metrics"
    },
    kanban: {
      content: "Kanban is a visual signaling system to control work-in-progress. It helps implement pull systems and prevent overproduction. Basic formula: Number of Kanban = (Daily Demand × Lead Time × Safety Factor) / Container Quantity.",
      page: "Page 42",
      section: "Pull Systems"
    },
    process_capacity: {
      content: "Process Capacity is the maximum output a process can produce under ideal conditions. Formula: Capacity = Available Time × Cycle Time × Number of Operators. Use this to plan workforce and identify bottlenecks.",
      page: "Page 18",
      section: "Capacity Planning"
    },
    bottleneck: {
      content: "A Bottleneck is the process step with the lowest capacity that limits the entire system's throughput. Identify bottlenecks by comparing cycle times across all process steps.",
      page: "Page 20",
      section: "Process Analysis"
    },
    value_stream: {
      content: "A Value Stream is all the actions required to bring a product from concept to the customer. Value Stream Mapping (VSM) helps visualize and analyze these flows to identify waste and improvement opportunities.",
      page: "Page 5",
      section: "Introduction to VSM"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findAnswer = (question: string): { answer: string; sources: string[] } => {
    const lowerQuestion = question.toLowerCase();
    const sources: string[] = [];
    
    // Check for keywords in the question
    for (const [key, value] of Object.entries(knowledgeBase)) {
      const keywords = key.split('_');
      const hasKeyword = keywords.some(keyword => 
        lowerQuestion.includes(keyword) || 
        lowerQuestion.includes(keyword.replace('_', ' '))
      );
      
      if (hasKeyword) {
        sources.push(`${value.section} - ${value.page}`);
        return {
          answer: value.content,
          sources
        };
      }
    }

    // Check for general VSM questions
    if (lowerQuestion.includes('what is') || lowerQuestion.includes('define')) {
      return {
        answer: "Based on the Kaizen Academy VSM guides, this relates to Value Stream Mapping methodology. Please be more specific about which VSM concept you'd like to understand (e.g., takt time, lead time, value added ratio, etc.).",
        sources: ["VSM Fundamentals - Page 5"]
      };
    }

    // Check for calculation questions
    if (lowerQuestion.includes('calculate') || lowerQuestion.includes('formula')) {
      return {
        answer: "For VSM calculations, I can help with takt time, cycle time, lead time, value added ratio, inventory turns, OEE, kanban quantities, and process capacity. Please specify which calculation you need.",
        sources: ["Calculation Guide - Multiple Pages"]
      };
    }

    return {
      answer: "I can answer questions about Value Stream Mapping concepts including takt time, cycle time, lead time, value added ratio, inventory turns, OEE, kanban, process capacity, and bottlenecks. Please ask about any of these topics.",
      sources: ["VSM Complete Guide"]
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

    // Simulate AI processing time
    setTimeout(() => {
      const { answer, sources } = findAnswer(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
        sources
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          <Bot className="w-8 h-8" style={{ color: '#ffd559' }} />
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600' }}>Kaizen Academy AI Assistant</h1>
        </div>
        <p style={{ margin: 0, color: '#ccc', fontSize: '0.95rem' }}>
          Ask questions about Value Stream Mapping - I'll answer based on our comprehensive PDF guides
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px', 
          marginTop: '12px',
          fontSize: '0.85rem',
          color: '#ffd559'
        }}>
          <CheckCircle className="w-4 h-4" />
          <span>Knowledge based on Kaizen Academy PDF guides only</span>
        </div>
      </div>

      {/* Topics Guide */}
      <div style={{ 
        background: 'rgba(255, 213, 89, 0.1)',
        border: '2px solid #ffd559',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#1a1a1a', fontSize: '1.1rem' }}>
          📚 Topics I Can Help With:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {Object.entries(knowledgeBase).map(([key, value]) => (
            <div key={key} style={{ 
              background: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              border: '1px solid #e5e5e5'
            }}>
              <strong>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                {value.section}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{
        background: 'white',
        border: '2px solid #e5e5e5',
        borderRadius: '16px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <div
                style={{
                  background: message.sender === 'user' ? '#1a1a1a' : '#f5f5f5',
                  color: message.sender === 'user' ? 'white' : '#1a1a1a',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomLeftRadius: message.sender === 'user' ? '16px' : '4px',
                  borderBottomRightRadius: message.sender === 'user' ? '4px' : '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                    {message.sender === 'bot' ? 'Kaizen Assistant' : 'You'}
                  </span>
                </div>
                <div style={{ lineHeight: '1.5' }}>
                  {message.text}
                </div>
                {message.sources && (
                  <div style={{ 
                    marginTop: '8px', 
                    paddingTop: '8px', 
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '0.75rem',
                    opacity: 0.8
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen className="w-3 h-3" />
                      <span>Sources: {message.sources.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '80%' }}>
              <div style={{
                background: '#f5f5f5',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bot className="w-4 h-4" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Kaizen Assistant</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#666', borderRadius: '50%', animation: 'pulse 1.4s infinite' }} />
                  <div style={{ width: '8px', height: '8px', background: '#666', borderRadius: '50%', animation: 'pulse 1.4s infinite 0.2s' }} />
                  <div style={{ width: '8px', height: '8px', background: '#666', borderRadius: '50%', animation: 'pulse 1.4s infinite 0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        background: 'white',
        border: '2px solid #e5e5e5',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        <div style={{ flex: 1 }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about VSM concepts, calculations, or methodologies..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              resize: 'none',
              minHeight: '50px',
              maxHeight: '120px',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              outline: 'none'
            }}
            rows={1}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          style={{
            background: inputText.trim() && !isLoading ? '#1a1a1a' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(255, 213, 89, 0.1)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#666'
      }}>
        <AlertCircle className="w-4 h-4" style={{ color: '#ffd559' }} />
        <span>
          This AI assistant answers questions strictly based on Kaizen Academy PDF guides. For complex calculations, always verify with the official documentation.
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default KaizenBot;
