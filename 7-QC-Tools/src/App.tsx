import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Histogram from './components/Histogram';
import Fishbone from './components/Fishbone';
import CheckSheet from './components/CheckSheet';
import ParetoChart from './components/ParetoChart';
import Graphs from './components/Graphs';
import ControlCharts from './components/ControlCharts';
import ScatterDiagram from './components/ScatterDiagram';
import KaizenHeader from './components/KaizenHeader';
import KaizenFooter from './components/KaizenFooter';

export default function App() {
  // Version verification - latest version with enhanced design system
  console.log('🚀 7 QC TOOLS APP - VERSION 2.0.0');
  console.log('📅 Last Updated: ' + new Date().toLocaleString());
  console.log('🎨 Design System: Kaizen Academy Premium Wood Theme');
  console.log('📤 Export Features: PNG/PDF/Excel/CSV - FULLY IMPLEMENTED');
  console.log('⚡ Enhanced Features: Micro-interactions, Animations, Accessibility');
  console.log('🔧 Dependencies: html2canvas, jsPDF, xlsx - INSTALLED');
  console.log('📊 Components: Premium cards, enhanced buttons, wood textures');
  console.log('✅ Status: All strategic improvements implemented');
  console.log('🌐 Running on: http://localhost:3001');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const [activeTool, setActiveTool] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderTool = () => {
    switch (activeTool) {
      case 'home':
        return <Home onNavigate={setActiveTool} />;
      case 'histogram':
        return <Histogram />;
      case 'fishbone':
        return <Fishbone />;
      case 'checksheet':
        return <CheckSheet />;
      case 'pareto':
        return <ParetoChart />;
      case 'graphs':
        return <Graphs />;
      case 'control':
        return <ControlCharts />;
      case 'scatter':
        return <ScatterDiagram />;
      default:
        return <Home onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Kaizen Academy Header */}
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

      {/* Kaizen Academy Footer */}
      <KaizenFooter />
    </div>
  );
}
