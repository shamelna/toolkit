import React from 'react';
import { 
  BarChart3, 
  GitBranch, 
  CheckCircle, 
  TrendingUp, 
  LineChart, 
  Activity, 
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  toolNumber?: string;
}

interface SidebarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: BarChart3 },
  { id: 'histogram', label: 'Histogram', icon: BarChart3 },
  { id: 'fishbone', label: 'Cause & Effect', icon: GitBranch },
  { id: 'checksheet', label: 'Check Sheet', icon: CheckCircle },
  { id: 'pareto', label: 'Pareto', icon: TrendingUp },
  { id: 'graphs', label: 'Graphs', icon: LineChart },
  { id: 'control', label: 'Control Charts', icon: Activity },
  { id: 'scatter', label: 'Scatter', icon: Target },
];

export default function Sidebar({ activeTool, onToolSelect, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="heading-small text-yellow">7 QC TOOLS</h2>
              <p className="text-small text-muted">Quality Control Applications</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="sidebar-toggle-btn"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item-premium ${activeTool === item.id ? 'active' : ''} ${isCollapsed ? 'nav-item-collapsed' : ''}`}
            onClick={() => onToolSelect(item.id)}
            title={item.label}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
}
