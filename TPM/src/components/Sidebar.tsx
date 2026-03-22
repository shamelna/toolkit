import React from 'react';
import { Calculator, Activity, Clock, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Calculator },
  { id: 'oee', label: 'OEE Calculator', icon: Calculator },
  { id: 'reliability', label: 'Reliability Metrics', icon: Activity },
  { id: 'mtbf', label: 'MTBF Analysis', icon: Clock },
  { id: 'performance', label: 'Performance Analysis', icon: TrendingUp },
];

export default function Sidebar({ activeTool, onToolSelect, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="sidebar-logo-icon">
            TPM
          </div>
          {!isCollapsed && (
            <div className="sidebar-logo-text">
              <div className="sidebar-logo-title">TPM Toolkit</div>
              <div className="sidebar-logo-subtitle">Total Productive Maintenance</div>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="btn-ghost p-2"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTool === item.id ? 'active' : ''}`}
            onClick={() => onToolSelect(item.id)}
            title={item.label}
          >
            <item.icon className="nav-item-icon" />
            {!isCollapsed && <span className="nav-item-text">{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
}
