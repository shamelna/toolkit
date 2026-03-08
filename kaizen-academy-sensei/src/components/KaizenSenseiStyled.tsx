import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, BookOpen, TrendingUp, Users, Target, Lightbulb, AlertCircle, Brain, Clock, Package, Zap, Sparkles, Layers } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sensei';
  timestamp: Date;
  sources?: string[];
  principle?: string;
}

// Comprehensive knowledge base based on Toyota Production System and Lean literature
const knowledgeBase = {
  // The 14 Toyota Way Principles
  "toyota_way_1_philosophy": {
    content: "Principle 1: Base your management decisions on a long-term philosophy, even at the expense of short-term financial goals. This means thinking about the long-term impact on customers, employees, and society, rather than focusing solely on quarterly profits. Toyota's philosophy includes contributing to society, quality first, and going to the source of problems.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Long-Term Thinking",
    keywords: ["philosophy", "long", "term", "management", "decisions", "toyota", "way"]
  },
  "toyota_way_2_process": {
    content: "Principle 2: Create a continuous process flow to bring problems to the surface. This means eliminating waste, creating one-piece flow, and making problems visible so they can be solved immediately. The goal is to create a smooth, uninterrupted flow that reveals issues as they occur.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Continuous Flow",
    keywords: ["process", "flow", "continuous", "problems", "surface", "waste", "elimination"]
  },
  "toyota_way_3_pull": {
    content: "Principle 3: Use pull systems to avoid overproduction. Pull means only producing what customers need when they need it, rather than pushing products based on forecasts. This is implemented through Just-In-Time production, kanban systems, and leveling production to match actual demand.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Pull System",
    keywords: ["pull", "system", "overproduction", "just", "in", "time", "kanban", "demand"]
  },
  "toyota_way_4_level": {
    content: "Principle 4: Level out the workload (heijunka). This means creating a consistent, predictable production schedule that smooths out volume and variety variations. Leveling prevents overburden (muri) and unevenness (mura), enabling stable operations and continuous improvement.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Production Leveling",
    keywords: ["heijunka", "level", "workload", "muri", "mura", "smoothing", "consistency"]
  },
  "toyota_way_5_stop": {
    content: "Principle 5: Build a culture of stopping to fix problems (jidoka). This means empowering any worker to stop production when they detect a problem. Jidoka combines automation with human intelligence - machines stop automatically when abnormalities occur, preventing defect propagation.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Built-in Quality",
    keywords: ["stop", "fix", "problems", "jidoka", "culture", "quality", "automation", "abnormalities"]
  },
  "toyota_way_6_standardized": {
    content: "Principle 6: Standardized tasks are the foundation for continuous improvement. Standard work documents the current best practice, ensuring quality, safety, and efficiency. However, standards are not static - they're created by workers and meant to be continuously challenged and improved.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Standardized Work",
    keywords: ["standardized", "tasks", "foundation", "improvement", "best", "practice", "quality", "safety"]
  },
  "toyota_way_7_visual": {
    content: "Principle 7: Use visual control so no problems are hidden. This means making abnormalities immediately visible through visual management tools, andon lights, status boards, and clear indicators. Visual controls help everyone see the current condition at a glance.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Visual Management",
    keywords: ["visual", "control", "problems", "hidden", "andons", "lights", "status", "boards", "indicators"]
  },
  "toyota_way_8_reliable": {
    content: "Principle 8: Use only reliable, thoroughly tested technology that serves your people and processes. Technology should support people, not replace them. Toyota carefully tests new technology to ensure it actually improves quality, safety, or productivity before implementation.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Appropriate Technology",
    keywords: ["reliable", "tested", "technology", "serves", "people", "processes", "implementation"]
  },
  "toyota_way_9_leaders": {
    content: "Principle 9: Grow leaders who thoroughly understand the work, live the philosophy, and teach it to others. Toyota leaders are mentors who have deep process knowledge and can develop others. They lead by example and are responsible for developing their people.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Leader Development",
    keywords: ["grow", "leaders", "understand", "work", "philosophy", "teach", "mentors", "development"]
  },
  "toyota_way_10_develop": {
    content: "Principle 10: Develop exceptional people and teams who follow your company's philosophy. This means investing in continuous training, creating cross-functional teams, and developing problem-solving capabilities. People are Toyota's most valuable asset.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "People Development",
    keywords: ["develop", "exceptional", "people", "teams", "philosophy", "training", "cross", "functional"]
  },
  "toyota_way_11_respect": {
    content: "Principle 11: Respect your extended network of partners and suppliers by challenging them and helping them improve. Toyota views suppliers as long-term partners who are part of the value stream. They work together to improve quality, reduce costs, and eliminate waste.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Supplier Partnership",
    keywords: ["respect", "partners", "suppliers", "challenge", "help", "improve", "network", "value", "stream"]
  },
  "toyota_way_12_go_see": {
    content: "Principle 12: Go and see for yourself to thoroughly understand the situation (genchi genbutsu). This means leaders must go to the gemba (the actual place where work happens) to observe reality firsthand. Don't rely on reports or data - go see the actual process.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Gemba Observation",
    keywords: ["go", "see", "understand", "situation", "genchi", "genbutsu", "gemba", "observe", "reality"]
  },
  "toyota_way_13_think": {
    content: "Principle 13: Make decisions slowly by consensus, considering all options; implement decisions rapidly. This means thorough discussion and agreement before action, but once decided, implement quickly. It ensures commitment and rapid execution while preventing rushed decisions.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Consensus Decision",
    keywords: ["decisions", "slowly", "consensus", "options", "implement", "rapidly", "thorough", "discussion"]
  },
  "toyota_way_14_learn": {
    content: "Principle 14: Become a learning organization through relentless reflection and continuous improvement (hansei). This means constantly reflecting on results, identifying successes and failures, and using this learning to improve. Every activity is an opportunity to learn and get better.",
    source: "The Toyota Way - Jeffrey Liker",
    principle: "Continuous Learning",
    keywords: ["learning", "organization", "reflection", "hansei", "continuous", "improvement", "results", "better"]
  },

  // Core Lean Concepts
  "respect_for_people": {
    content: "Respect for People is fundamental to Toyota - it means treating employees as long-term assets, investing in their development, and creating a safe, supportive environment. Firing people to improve productivity contradicts this core principle. True lean improvement comes from developing people, not reducing headcount. When problems occur, focus on the process, not blaming people.",
    source: "Toyota Culture - Jeffrey Liker",
    principle: "Respect for Humanity",
    keywords: ["respect", "people", "employees", "culture", "development", "safe", "supportive", "firing", "productivity"]
  },
  "productivity_improvement": {
    content: "Productivity improvement in lean comes from eliminating waste, improving processes, and developing people - NOT from reducing headcount. Short-term gains from layoffs are offset by long-term losses in morale, knowledge, and capability. True productivity is sustainable: better methods, better tools, better skills, and better processes.",
    source: "Lean Thinking - Womack & Jones",
    principle: "Sustainable Improvement",
    keywords: ["productivity", "improvement", "sustainable", "headcount", "layoffs", "morale", "knowledge", "capability"]
  },
  "waste_elimination": {
    content: "The 8 wastes (DOWNTIME): Defects, Overproduction, Waiting, Non-utilized Talent, Transportation, Inventory, Motion, Extra-processing. TIMWOODS helps remember: Transportation, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects, Skills. Waste elimination requires identifying value vs. non-value activities and systematically removing waste.",
    source: "Lean Thinking - Womack & Jones",
    principle: "Waste Identification",
    keywords: ["waste", "downtime", "defects", "overproduction", "waiting", "skills", "transportation", "inventory", "motion", "processing"]
  },
  "just_in_time": {
    content: "Just-In-Time means making only what's needed, when needed, in the amount needed. It requires: 1) Continuous one-piece flow, 2) Pull production based on customer demand, 3) Takt time pacing, 4) Quick changeover. JIT eliminates waste from overproduction, excess inventory, and waiting while improving cash flow and responsiveness.",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Flow & Pull",
    keywords: ["jit", "just", "in", "time", "production", "inventory", "pull", "flow", "takt", "changeover"]
  },
  "heijunka": {
    content: "Heijunka (production leveling) creates consistent flow by smoothing volume and variety. It prevents the bullwhip effect and reduces muri (overburden) and mura (unevenness). Methods include: 1) Mix model production (different products in sequence), 2) Level volume forecasting, 3) Pitch time calculations, 4) Load balancing across lines.",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Production Leveling",
    keywords: ["heijunka", "leveling", "smoothing", "bullwhip", "muri", "mura", "volume", "variety", "pitch", "balancing"]
  },
  "kaizen": {
    content: "Kaizen means continuous improvement involving everyone. It's not about big breakthroughs but small, incremental changes that add up. Types: 1) Daily kaizen (small improvements), 2) Kaizen events (3-5 day focused improvements), 3) Quality circles (team-based improvements). The philosophy: 'Good enough never is - there's always a better way.'",
    source: "Gemba Kaizen - Masaaki Imai",
    principle: "Continuous Improvement",
    keywords: ["kaizen", "continuous", "improvement", "incremental", "events", "quality", "circles", "better", "way"]
  },
  "jidoka": {
    content: "Jidoka means 'automation with human touch' - machines stop automatically when problems occur. This prevents defect propagation and enables immediate problem-solving. Components: 1) Automatic stop mechanisms, 2) Andon (visual alarms), 3) Poka-yoke (mistake-proofing), 4) Human intervention for abnormalities. Quality is built in, not inspected in.",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Built-in Quality",
    keywords: ["jidoka", "automation", "human", "touch", "stop", "andon", "poka", "yoke", "quality", "defects"]
  },
  "problem_solving": {
    content: "Lean problem-solving uses scientific thinking: 1) Go to gemba (observe reality), 2) Grasp the situation (collect data), 3) Analyze root cause (5 Whys), 4) Implement countermeasures, 5) Verify results, 6) Standardize success. PDCA (Plan-Do-Check-Act) cycles ensure systematic improvement. Focus on process problems, not people problems.",
    source: "Toyota Kata - Mike Rother",
    principle: "Scientific Thinking",
    keywords: ["problem", "solving", "gemba", "data", "5", "whys", "pdca", "countermeasures", "scientific", "systematic"]
  },
  "standardized_work": {
    content: "Standardized Work documents the current best known method. Elements: 1) Takt time (customer demand rate), 2) Work sequence (optimal steps), 3) Standard inventory, 4) Key points (quality/safety). Created by team members doing the work. Standards are the foundation for kaizen - you can't improve what isn't standardized.",
    source: "Toyota Production System - Taiichi Ohno",
    principle: "Process Stability",
    keywords: ["standardized", "work", "takt", "sequence", "inventory", "quality", "safety", "kaizen", "foundation"]
  },
  "value_stream_mapping": {
    content: "Value Stream Mapping analyzes current state and designs future state. Steps: 1) Identify product family, 2) Draw current state map (all steps), 3) Calculate takt time, 4) Identify waste, 5) Design future state (ideal flow), 6) Implementation plan. VSM reveals the total lead time and helps prioritize improvements.",
    source: "Learning to See - Mike Rother & John Shook",
    principle: "Process Analysis",
    keywords: ["vsm", "value", "stream", "mapping", "current", "future", "takt", "lead", "time", "implementation"]
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

  // Enhanced semantic search function for comprehensive knowledge base
  const searchKnowledge = (query: string) => {
    const queryLower = query.toLowerCase();
    const results: any[] = [];

    Object.entries(knowledgeBase).forEach(([key, data]) => {
      const { content, source, principle, keywords } = data;
      
      // Calculate relevance score
      let relevanceScore = 0;
      const queryWords = queryLower.split(' ').filter(word => word.length > 2);
      
      // Exact keyword matches
      keywords.forEach(keyword => {
        if (queryLower.includes(keyword)) {
          relevanceScore += 3;
        }
      });
      
      // Partial word matches
      queryWords.forEach(word => {
        if (content.toLowerCase().includes(word)) {
          relevanceScore += 1;
        }
        keywords.forEach(keyword => {
          if (keyword.includes(word)) {
            relevanceScore += 2;
          }
        });
      });

      // Enhanced semantic matches for complex questions
      if (queryLower.includes('fire') || queryLower.includes('firing') || queryLower.includes('layoff')) {
        if (key === 'respect_for_people') relevanceScore += 5;
        if (key === 'productivity_improvement') relevanceScore += 4;
        if (key === 'toyota_way_1_philosophy') relevanceScore += 3;
      }
      
      if (queryLower.includes('what if') || queryLower.includes('situation')) {
        if (key === 'respect_for_people') relevanceScore += 3;
        if (key === 'productivity_improvement') relevanceScore += 3;
        if (key === 'problem_solving') relevanceScore += 2;
        if (key.startsWith('toyota_way_')) relevanceScore += 2;
      }

      // Toyota Way principles matching
      if (queryLower.includes('toyota way') || queryLower.includes('14 principles')) {
        if (key.startsWith('toyota_way_')) relevanceScore += 5;
      }

      // Specific principle matches
      if (queryLower.includes('philosophy') && key === 'toyota_way_1_philosophy') relevanceScore += 5;
      if (queryLower.includes('process') && key === 'toyota_way_2_process') relevanceScore += 4;
      if (queryLower.includes('pull') && key === 'toyota_way_3_pull') relevanceScore += 4;
      if (queryLower.includes('level') && key === 'toyota_way_4_level') relevanceScore += 4;
      if (queryLower.includes('stop') && key === 'toyota_way_5_stop') relevanceScore += 4;
      if (queryLower.includes('standard') && key === 'toyota_way_6_standardized') relevanceScore += 4;
      if (queryLower.includes('visual') && key === 'toyota_way_7_visual') relevanceScore += 4;
      if (queryLower.includes('technology') && key === 'toyota_way_8_reliable') relevanceScore += 4;
      if (queryLower.includes('leader') && key === 'toyota_way_9_leaders') relevanceScore += 4;
      if (queryLower.includes('develop') && key === 'toyota_way_10_develop') relevanceScore += 4;
      if (queryLower.includes('supplier') && key === 'toyota_way_11_respect') relevanceScore += 4;
      if (queryLower.includes('gemba') && key === 'toyota_way_12_go_see') relevanceScore += 5;
      if (queryLower.includes('decision') && key === 'toyota_way_13_think') relevanceScore += 4;
      if (queryLower.includes('learn') && key === 'toyota_way_14_learn') relevanceScore += 4;

      // Core lean concepts
      if (queryLower.includes('jit') && key === 'just_in_time') relevanceScore += 4;
      if (queryLower.includes('just in time') && key === 'just_in_time') relevanceScore += 4;
      if (queryLower.includes('heijunka') && key === 'heijunka') relevanceScore += 4;
      if (queryLower.includes('leveling') && key === 'heijunka') relevanceScore += 3;
      if (queryLower.includes('lean') && key === 'waste_elimination') relevanceScore += 3;
      if (queryLower.includes('kaizen') && key === 'kaizen') relevanceScore += 4;
      if (queryLower.includes('waste') && key === 'waste_elimination') relevanceScore += 3;
      if (queryLower.includes('vsm') && key === 'value_stream_mapping') relevanceScore += 4;
      if (queryLower.includes('respect') && key === 'respect_for_people') relevanceScore += 4;
      if (queryLower.includes('people') && key === 'respect_for_people') relevanceScore += 3;
      if (queryLower.includes('productivity') && key === 'productivity_improvement') relevanceScore += 4;
      if (queryLower.includes('jidoka') && key === 'jidoka') relevanceScore += 4;
      if (queryLower.includes('problem') && key === 'problem_solving') relevanceScore += 3;
      if (queryLower.includes('standardized') && key === 'standardized_work') relevanceScore += 3;

      if (relevanceScore > 0) {
        results.push({
          key,
          text: content,
          source,
          principle,
          relevance: relevanceScore
        });
      }
    });

    // Sort by relevance and return top result
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 1);
  };

  const generateAnswer = (query: string, searchResults: any[]) => {
    if (searchResults.length === 0) {
      return "I cannot find specific information about that topic in my knowledge base. My knowledge covers the 14 Toyota Way principles, core lean concepts like JIT, Heijunka, Kaizen, Jidoka, and Respect for People. Try asking about a specific principle or concept.";
    }

    const result = searchResults[0];
    let answer = result.text;
    
    // Enhanced contextual responses for complex questions
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('fire') || queryLower.includes('firing') || queryLower.includes('layoff')) {
      answer += `\n\n**Critical Lean Perspective:** This directly contradicts Toyota's Principle 1 (Long-term philosophy) and Principle 10 (Develop exceptional people). Firing people destroys institutional knowledge and morale. True lean improvement focuses on developing people and improving processes, not reducing headcount.`;
    }
    
    if (queryLower.includes('what if') || queryLower.includes('situation')) {
      answer += `\n\n**Toyota Way Approach:** Use Principle 12 (Go and see) - go to gemba to understand the actual situation. Apply Principle 13 (Think slowly) - make decisions by consensus considering all options. Use scientific thinking (PDCA) rather than reactive decisions.`;
    }
    
    if (queryLower.includes('how to')) {
      answer += `\n\n**Implementation Steps:** 1) Go to gemba and observe reality, 2) Grasp the current situation with data, 3) Analyze root cause using 5 Whys, 4) Implement countermeasures, 5) Verify results and standardize success.`;
    }

    if (queryLower.includes('toyota way') || queryLower.includes('14 principles')) {
      answer += `\n\n**The 14 Principles:** These are the foundation of Toyota's management philosophy, covering everything from long-term thinking to continuous learning. They work together as a system, not isolated rules.`;
    }

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

    setTimeout(() => {
      try {
        const searchResults = searchKnowledge(inputText);
        const answer = generateAnswer(inputText, searchResults);

        const senseiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: answer,
          sender: 'sensei',
          timestamp: new Date(),
          sources: searchResults.map(r => r.source),
          principle: searchResults[0]?.principle || 'Wisdom from Experience',
        };

        setMessages(prev => [...prev, senseiMessage]);
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
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - VSM Style */}
      <section className="hero">
        <div className="hero-content">
          <div className="logo-container">
            <Bot className="logo" style={{ color: '#ffd559' }} />
          </div>
          
          <h1 className="heading-large text-yellow">
            Kaizen Academy Sensei
          </h1>
          
          <p className="text-body" style={{ maxWidth: '800px', margin: '0 auto 40px', opacity: 0.95 }}>
            Traditional Lean Manufacturing Wisdom with Modern AI Intelligence
          </p>

          <div className="flex justify-center gap-8 flex-wrap">
            <div className="nav-link active">
              <Target className="w-5 h-5" />
              Toyota Principles
            </div>
            <div className="nav-link">
              <Lightbulb className="w-5 h-5" />
              Lean Tools
            </div>
            <div className="nav-link">
              <TrendingUp className="w-5 h-5" />
              Kaizen Methods
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-grey">
        <div className="container">
          <div className="grid-4 mb-12">
            {/* Feature Cards - VSM Style */}
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="heading-small">Smart Search</h3>
              </div>
              <p className="text-body mb-6">
                Advanced semantic understanding that finds relevant content even when you use different words or phrases.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-small">Vector embeddings for semantic matching</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-small">Query expansion for better results</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="heading-small">Real-time</h3>
              </div>
              <p className="text-body mb-6">
                Instant responses with loading states and smooth animations for a professional conversational experience.
              </p>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-small">Fast processing</span>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="heading-small">Knowledge Base</h3>
              </div>
              <p className="text-body mb-6">
                Built on Toyota Production System principles and established lean manufacturing literature.
              </p>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-small">5 core concepts</span>
              </div>
            </div>
          </div>

          {/* Chat Interface - VSM Style */}
          <div className="card-elevated">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Bot className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="heading-medium flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  Ask Your Sensei
                </h3>
                <p className="text-small text-muted">Get instant answers from traditional lean wisdom</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-white border border-border rounded-xl" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" style={{ minHeight: 0 }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex fade-in-up"
                    style={{ 
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%'
                    }}
                  >
                    <div
                      className={message.sender === 'sensei' 
                        ? 'bg-dark text-white p-4 rounded-xl shadow-lg' 
                        : 'bg-light-grey text-dark p-4 rounded-xl shadow-lg border border-border'}
                      style={{ maxWidth: '100%' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {message.sender === 'sensei' ? 
                          <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div> : 
                          <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-yellow-700" />
                          </div>
                        }
                        <span className="text-small font-bold">
                          {message.sender === 'sensei' ? 'Sensei' : 'Student'}
                        </span>
                      </div>
                      <div className="text-small leading-relaxed">
                        {message.text}
                      </div>
                      {message.principle && (
                        <div className="mt-3 pt-3 border-t border-border text-small italic text-yellow-600 font-medium">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3 h-3" />
                            Principle: {message.principle}
                          </div>
                        </div>
                      )}
                      {message.sources && (
                        <div className="mt-2 pt-2 border-t border-border text-small text-muted">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            <span>Sources: {message.sources.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex fade-in-up" style={{ maxWidth: '85%' }}>
                    <div className="bg-dark text-white p-4 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-small font-bold">Sensei</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-light-grey rounded-2xl p-8 border border-border">
              <div className="flex gap-6">
                <div className="flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your sensei about Toyota Production System, lean tools, or kaizen methods..."
                    className="input"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="btn-primary"
                >
                  <Send className="w-6 h-6 mr-3" />
                  Ask Sensei
                </button>
              </div>
            </div>
          </div>

          {/* Philosophy Section - VSM Style */}
          <div className="card-featured mt-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="heading-medium mb-4 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                  The Sensei Philosophy
                </h4>
                <p className="text-body mb-6">
                  This AI assistant embodies the traditional Japanese sensei approach - wise, patient, and deeply knowledgeable about lean manufacturing.
                </p>
                <div className="grid-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-small">Semantic understanding</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-small">Context-aware responses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-small">Traditional wisdom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default KaizenSensei;
