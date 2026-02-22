import React from 'react';
import { Calculator, Clock, Users, Package, TrendingUp, BookOpen, Play, HelpCircle, ArrowRight, Video, Download, CheckCircle, Award, Timer } from 'lucide-react';

interface CalculatorCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const calculators: CalculatorCard[] = [
  {
    id: 'takt-time',
    title: 'Takt Time',
    description: 'Calculate production pace needed to meet customer demand',
    icon: Clock,
    features: ['Available working time', 'Customer demand', 'Production pacing', 'Real-time examples'],
    difficulty: 'Beginner'
  },
  {
    id: 'inventory',
    title: 'Inventory & Lead Time',
    description: 'Analyze inventory levels and production lead times',
    icon: Package,
    features: ['Inventory days', 'Production lead time', 'VA ratio', 'Segment analysis'],
    difficulty: 'Intermediate'
  },
  {
    id: 'process-capacity',
    title: 'Process Capacity',
    description: 'Determine operator requirements and utilization',
    icon: Users,
    features: ['Process capacity', 'Operators needed', 'Utilization rate', 'Work balancing'],
    difficulty: 'Intermediate'
  },
  {
    id: 'kanban',
    title: 'Kanban & Leveling',
    description: 'Design pull systems and production leveling',
    icon: TrendingUp,
    features: ['Kanban calculation', 'Pitch analysis', 'Leveling box', 'Changeover capacity'],
    difficulty: 'Advanced'
  }
];

const difficultyColors = {
  'Beginner': '#4CAF50',
  'Intermediate': '#FF9800', 
  'Advanced': '#DC2626'
};

export default function HomeScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="logo-container">
            <Calculator className="logo" style={{ color: '#ffd559' }} />
          </div>
          
          <h1 className="heading-large text-yellow">
            VSM Calculator
          </h1>
          
          <p className="text-body" style={{ maxWidth: '800px', margin: '0 auto 40px', opacity: 0.95 }}>
            Professional Value Stream Mapping Calculator based on "Learning to See" by Mike Rother & John Shook
          </p>

          <button 
            onClick={() => onNavigate('takt-time')}
            className="btn-primary fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <Play className="w-6 h-6 mr-3" />
            Get Started
          </button>
        </div>
      </section>

      {/* Calculators Section */}
      <section className="section-grey">
        <div className="container">
          <h2 className="section-title">Choose Your Calculator</h2>
          
          <div className="grid-4">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <div 
                  key={calc.id}
                  className="card"
                  onClick={() => onNavigate(calc.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <div 
                      style={{ 
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(255, 213, 89, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px'
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: '#ffd559' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="heading-small">{calc.title}</h3>
                      <span 
                        style={{
                          fontSize: '12px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          background: `${difficultyColors[calc.difficulty]}20`,
                          color: difficultyColors[calc.difficulty]
                        }}
                      >
                        {calc.difficulty}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5" style={{ color: '#666' }} />
                  </div>

                  {/* Description */}
                  <p className="text-body text-muted" style={{ marginBottom: '24px' }}>
                    {calc.description}
                  </p>

                  {/* Features */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 className="text-small" style={{ fontWeight: '600', marginBottom: '12px' }}>Features:</h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {calc.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                          <div style={{ 
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#ffd559',
                            marginRight: '8px'
                          }}></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e5e5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                      <Calculator className="w-3 h-3 mr-2" />
                      <span>Ready to Calculate</span>
                    </div>
                    <button 
                      className="btn-ghost"
                      style={{ fontSize: '12px', padding: '8px 16px' }}
                    >
                      Open Calculator
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced VSM Course Section */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card-elevated" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <h2 className="heading-large mb-6" style={{ color: '#1a1a1a' }}>
                Ready to Build Your Value Stream Map?
              </h2>
              
              <p className="text-body mb-6" style={{ fontSize: '18px', lineHeight: 1.7 }}>
                This calculator gives you the data. The Advanced Value Stream Mapping Course shows you exactly how to use it — from drawing your current state map to designing a lean future state that eliminates waste systematically.
              </p>

              <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                <h3 className="heading-medium mb-4" style={{ color: '#ffd559' }}>What You'll Learn:</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ArrowRight className="w-5 h-5 mr-3 mt-1" style={{ color: '#ffd559', flexShrink: 0 }} />
                    <span className="text-body">How to select the right product family and scope your VSM exercise</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ArrowRight className="w-5 h-5 mr-3 mt-1" style={{ color: '#ffd559', flexShrink: 0 }} />
                    <span className="text-body">Step-by-step process for drawing both Current State and Future State maps (by hand, in Excel, Visio, or iGrafx — templates included)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ArrowRight className="w-5 h-5 mr-3 mt-1" style={{ color: '#ffd559', flexShrink: 0 }} />
                    <span className="text-body">The 8 lean guidelines for designing a future state: Takt Time, Continuous Flow, Supermarkets, Pull Systems, Pacemaker Scheduling, Production Leveling, and more</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ArrowRight className="w-5 h-5 mr-3 mt-1" style={{ color: '#ffd559', flexShrink: 0 }} />
                    <span className="text-body">How to build a realistic implementation workplan and turn your map into results</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ArrowRight className="w-5 h-5 mr-3 mt-1" style={{ color: '#ffd559', flexShrink: 0 }} />
                    <span className="text-body">Taught using Acme Stamping end-to-end case study — industry-standard VSM learning framework</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255, 213, 89, 0.1)',
                border: '2px solid #ffd559',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '40px'
              }}>
                <h3 className="heading-medium mb-4" style={{ color: '#1a1a1a' }}>
                  🎓 Enroll in Advanced Value Stream Mapping — Save 20%
                </h3>
                <p className="text-body mb-4">
                  Use code <strong style={{ color: '#ffd559' }}>KAIZEN20</strong> at checkout · 7-Day Money-Back Guarantee
                </p>
                <a 
                  href="https://academy.continuousimprovement.education/p/advanced-value-stream-mapping?coupon_code=kaizen20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  Enroll Now
                  <ArrowRight className="w-5 h-5 ml-3" />
                </a>
              </div>

              <div style={{ textAlign: 'left' }}>
                <h3 className="heading-medium mb-4" style={{ color: '#1a1a1a' }}>
                  What You'll Get:
                </h3>
                <div className="grid-3" style={{ gap: '24px' }}>
                  <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <Video className="w-12 h-12 mb-4" style={{ color: '#ffd559' }} />
                    <h4 className="heading-small mb-3">Step-by-step video tutorials</h4>
                    <p className="text-small text-muted">Covering every stage of VSM process</p>
                  </div>
                  
                  <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <Download className="w-12 h-12 mb-4" style={{ color: '#ffd559' }} />
                    <h4 className="heading-small mb-3">Downloadable PDF presentations</h4>
                    <p className="text-small text-muted">For each section</p>
                  </div>
                  
                  <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <Package className="w-12 h-12 mb-4" style={{ color: '#ffd559' }} />
                    <h4 className="heading-small mb-3">Ready-to-use templates</h4>
                    <p className="text-small text-muted">Excel, Visio & iGrafx VSM templates</p>
                  </div>
                  
                  <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <CheckCircle className="w-12 h-12 mb-4" style={{ color: '#ffd559' }} />
                    <h4 className="heading-small mb-3">Quizzes to reinforce learning</h4>
                    <p className="text-small text-muted">Test your understanding</p>
                  </div>
                  
                  <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <Award className="w-12 h-12 mb-4" style={{ color: '#ffd559' }} />
                    <h4 className="heading-small mb-3">Certificate of Achievement</h4>
                    <p className="text-small text-muted">Upon completion</p>
                  </div>
                  
                  <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <Timer className="w-12 h-12 mb-4" style={{ color: '#ffd559' }} />
                    <h4 className="heading-small mb-3">Lifetime access</h4>
                    <p className="text-small text-muted">Learn at your own pace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
