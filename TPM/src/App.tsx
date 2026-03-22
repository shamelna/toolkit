import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import OEECalculator from './components/OEECalculator';
import ReliabilityMetrics from './components/ReliabilityMetrics';
import MTBFCalculator from './components/MTBFCalculator';
import PerformanceAnalysis from './components/PerformanceAnalysis';
import KaizenHeader from './components/KaizenHeader';
import KaizenFooter from './components/KaizenFooter';

export default function App() {
  // Version verification - TPM Calculations Toolkit
  console.log('🚀 TPM CALCULATIONS TOOLKIT - VERSION 1.0.0');
  console.log('📅 Last Updated: ' + new Date().toLocaleString());
  console.log('🎨 Design System: Kaizen Academy Premium Wood Theme');
  console.log('📊 KPIs: 12 TPM Metrics from Nakajima Sources');
  console.log('🔧 Dependencies: React, TypeScript, Recharts - CONFIGURED');
  console.log('📤 Export Features: PNG/PDF/Excel/CSV - PLANNED');
  console.log('⚡ Enhanced Features: Micro-interactions, Animations');
  console.log('✅ Status: Infrastructure Setup Complete');
  console.log('🌐 Running on: http://localhost:3002');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const [activeTool, setActiveTool] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderTool = () => {
    switch (activeTool) {
      case 'home':
        return <Home onNavigate={setActiveTool} />;
      case 'oee':
        return <OEECalculator />;
      case 'reliability':
        return <ReliabilityMetrics />;
      case 'mtbf':
        return <MTBFCalculator />;
      case 'performance':
        return <PerformanceAnalysis />;
      default:
        return <Home onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="app-layout">
      <KaizenHeader />
      <div className="main-layout">
        <Sidebar 
          activeTool={activeTool} 
          onToolSelect={setActiveTool}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>
          {renderTool()}
        </main>
      </div>
      <KaizenFooter />
    </div>
  );
}
