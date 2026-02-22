import React, { useState } from 'react';
import { Calculator, Clock, Users, Package, TrendingUp, BookOpen, Menu, X, Home, HelpCircle } from 'lucide-react';
import TaktTimeCalculator from './components/TaktTimeCalculator';
import InventoryCalculator from './components/InventoryCalculator';
import ProcessCapacityCalculator from './components/ProcessCapacityCalculator';
import KanbanCalculator from './components/KanbanCalculator';
import FormulasGuideNew from './components/FormulasGuideNew';
import HomeScreen from './components/HomeScreen';
import KaizenHeader from './components/KaizenHeader';
import KaizenFooter from './components/KaizenFooter';
import HowToUse from './components/HowToUse';

type TabType = 'home' | 'how-to-use' | 'takt-time' | 'inventory' | 'process-capacity' | 'kanban' | 'reference';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component?: React.ComponentType<{ onNavigate?: (tab: string) => void }>;
  isHome?: boolean;
}

const tabs: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    isHome: true,
  },
  {
    id: 'how-to-use',
    label: 'How to Use',
    icon: HelpCircle,
    component: HowToUse,
  },
  {
    id: 'takt-time',
    label: 'Takt Time',
    icon: Clock,
    component: TaktTimeCalculator,
  },
  {
    id: 'inventory',
    label: 'Inventory & Lead Time',
    icon: Package,
    component: InventoryCalculator,
  },
  {
    id: 'process-capacity',
    label: 'Process Capacity',
    icon: Users,
    component: ProcessCapacityCalculator,
  },
  {
    id: 'kanban',
    label: 'Kanban & Leveling',
    icon: TrendingUp,
    component: KanbanCalculator,
  },
  {
    id: 'reference',
    label: 'Formulas Guide',
    icon: BookOpen,
    component: FormulasGuideNew,
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    if (activeTab === 'home') {
      return <HomeScreen onNavigate={handleNavigate} />;
    }
    
    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
    return ActiveComponent ? <ActiveComponent /> : <HomeScreen onNavigate={handleNavigate} />;
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Kaizen Academy Header */}
      <KaizenHeader />
      
      {/* Professional Header */}
      <header className="nav-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="heading-display" style={{ color: '#1a1a1a', margin: 0 }}>
                VSM Calculator
              </h1>
              <p className="text-small text-muted" style={{ margin: '4px 0 0 0' }}>
                Value Stream Mapping Calculator
              </p>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'transparent',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '8px',
                display: 'none'
              }}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div className="container">
          {/* Desktop Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px 0' }} className="hidden md:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div style={{ padding: '16px 0' }} className="md:hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.id)}
                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                    style={{ 
                      width: '100%', 
                      justifyContent: 'flex-start',
                      marginBottom: '8px'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {renderContent()}
      </main>

      {/* Kaizen Academy Footer */}
      <KaizenFooter />
    </div>
  );
}

export default App;
