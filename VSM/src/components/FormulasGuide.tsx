import React, { useState } from 'react';
import { BookOpen, Download, Search, Filter, Calculator, Clock, Users, Package, TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface Formula {
  id: string;
  category: string;
  title: string;
  formula: string;
  description: string;
  example: string;
  variables: Variable[];
  application: string;
}

interface Variable {
  symbol: string;
  description: string;
  unit: string;
}

const formulas: Formula[] = [
  {
    id: 'available-time',
    category: 'Foundation',
    title: 'Available Working Time',
    formula: 'Available Time = Shift Length - Breaks - Planned Downtime',
    description: 'Total productive time available for production during a shift, excluding breaks and planned downtime.',
    example: '480 minutes (8 hours) - 60 minutes breaks = 420 minutes available',
    variables: [
      { symbol: 'Available Time', description: 'Total productive time per shift', unit: 'minutes/seconds' },
      { symbol: 'Shift Length', description: 'Total scheduled shift duration', unit: 'minutes/seconds' },
      { symbol: 'Breaks', description: 'Scheduled break times', unit: 'minutes/seconds' },
      { symbol: 'Planned Downtime', description: 'Scheduled maintenance, meetings, etc.', unit: 'minutes/seconds' }
    ],
    application: 'Foundation for all VSM calculations - determines your production capacity'
  },
  {
    id: 'takt-time',
    category: 'Foundation',
    title: 'Takt Time',
    formula: 'Takt Time = Available Working Time ÷ Customer Demand',
    description: 'The required production pace to meet customer demand. This is the heartbeat of your production system.',
    example: '25,200 seconds ÷ 420 units = 60 seconds per unit',
    variables: [
      { symbol: 'Takt Time', description: 'Time available per unit produced', unit: 'seconds/unit' },
      { symbol: 'Available Working Time', description: 'Total productive time per period', unit: 'seconds/minutes' },
      { symbol: 'Customer Demand', description: 'Customer requirement per period', unit: 'units' }
    ],
    application: 'Sets the production rhythm and drives all capacity calculations'
  },
  {
    id: 'cycle-time',
    category: 'Process Analysis',
    title: 'Cycle Time',
    formula: 'Cycle Time = Manual Work Time + Machine Work Time + Walking Time',
    description: 'Total time required to complete one operation cycle, including all manual and machine work.',
    example: '25 seconds manual + 15 seconds machine + 5 seconds walking = 45 seconds cycle time',
    variables: [
      { symbol: 'Cycle Time', description: 'Time to complete one full cycle', unit: 'seconds' },
      { symbol: 'Manual Work Time', description: 'Operator manual operation time', unit: 'seconds' },
      { symbol: 'Machine Work Time', description: 'Machine automatic operation time', unit: 'seconds' },
      { symbol: 'Walking Time', description: 'Operator movement between stations', unit: 'seconds' }
    ],
    application: 'Used to balance work and determine operator requirements'
  },
  {
    id: 'process-capacity',
    category: 'Process Analysis',
    title: 'Process Capacity',
    formula: 'Process Capacity = (Available Time × Operators) ÷ Cycle Time',
    description: 'Maximum output capability of a process given available time, operators, and cycle time.',
    example: '(25,200 seconds × 3 operators) ÷ 45 seconds = 1,680 units per shift',
    variables: [
      { symbol: 'Process Capacity', description: 'Maximum possible output', unit: 'units/shift' },
      { symbol: 'Available Time', description: 'Production time available', unit: 'seconds' },
      { symbol: 'Operators', description: 'Number of operators assigned', unit: 'people' },
      { symbol: 'Cycle Time', description: 'Time to complete one unit', unit: 'seconds' }
    ],
    application: 'Determines if a process can meet customer demand'
  },
  {
    id: 'operators-needed',
    category: 'Process Analysis',
    title: 'Operators Needed',
    formula: 'Operators Needed = (Work Content ÷ Takt Time)',
    description: 'Number of operators required to meet takt time based on total work content.',
    example: '(180 seconds ÷ 60 seconds) = 3 operators needed',
    variables: [
      { symbol: 'Operators Needed', description: 'Required workforce', unit: 'people' },
      { symbol: 'Work Content', description: 'Total manual work per unit', unit: 'seconds' },
      { symbol: 'Takt Time', description: 'Required production pace', unit: 'seconds/unit' }
    ],
    application: 'Workforce planning and process balancing'
  },
  {
    id: 'utilization-rate',
    category: 'Process Analysis',
    title: 'Operator Utilization Rate',
    formula: 'Utilization % = (Work Content ÷ (Takt Time × Operators)) × 100',
    description: 'Percentage of operator capacity actually utilized in productive work.',
    example: '(180 ÷ (60 × 3)) × 100 = 100% utilization',
    variables: [
      { symbol: 'Utilization %', description: 'Operator efficiency percentage', unit: '%' },
      { symbol: 'Work Content', description: 'Actual work time per unit', unit: 'seconds' },
      { symbol: 'Takt Time', description: 'Available time per unit', unit: 'seconds' },
      { symbol: 'Operators', description: 'Number of operators', unit: 'people' }
    ],
    application: 'Measures efficiency and identifies over/under-staffing'
  },
  {
    id: 'inventory-days',
    category: 'Inventory Analysis',
    title: 'Inventory in Days',
    formula: 'Inventory Days = Current Inventory ÷ Daily Demand',
    description: 'How many days of inventory you currently have on hand.',
    example: '1,200 units ÷ 200 units/day = 6 days of inventory',
    variables: [
      { symbol: 'Inventory Days', description: 'Days of inventory on hand', unit: 'days' },
      { symbol: 'Current Inventory', description: 'Total inventory quantity', unit: 'units' },
      { symbol: 'Daily Demand', description: 'Daily customer requirement', unit: 'units/day' }
    ],
    application: 'Inventory management and reduction targets'
  },
  {
    id: 'lead-time',
    category: 'Inventory Analysis',
    title: 'Production Lead Time',
    formula: 'Lead Time = Σ(Process Times + Wait Times)',
    description: 'Total time from raw material receipt to finished goods delivery.',
    example: '2 days raw + 1 day process + 3 days finish = 6 days total lead time',
    variables: [
      { symbol: 'Lead Time', description: 'Total production cycle time', unit: 'days' },
      { symbol: 'Process Times', description: 'Value-added processing time', unit: 'days/hours' },
      { symbol: 'Wait Times', description: 'Non-value-added waiting time', unit: 'days/hours' }
    ],
    application: 'Identifies bottlenecks and total cycle time'
  },
  {
    id: 'va-ratio',
    category: 'Inventory Analysis',
    title: 'Value-Added Ratio',
    formula: 'VA Ratio % = (Value-Added Time ÷ Total Lead Time) × 100',
    description: 'Percentage of total lead time that adds value from customer perspective.',
    example: '(2 hours ÷ 144 hours) × 100 = 1.4% value-added ratio',
    variables: [
      { symbol: 'VA Ratio %', description: 'Value-added efficiency', unit: '%' },
      { symbol: 'Value-Added Time', description: 'Customer-valued processing time', unit: 'hours/seconds' },
      { symbol: 'Total Lead Time', description: 'Complete production cycle time', unit: 'hours/seconds' }
    ],
    application: 'Measures process efficiency and improvement potential'
  },
  {
    id: 'pitch',
    category: 'Pull Systems',
    title: 'Pitch',
    formula: 'Pitch = Takt Time × Pack-Out Quantity',
    description: 'Time interval at which materials should be withdrawn from upstream processes.',
    example: '60 seconds × 4 units = 240 seconds (4 minutes) pitch',
    variables: [
      { symbol: 'Pitch', description: 'Material withdrawal interval', unit: 'seconds' },
      { symbol: 'Takt Time', description: 'Production pace per unit', unit: 'seconds' },
      { symbol: 'Pack-Out Quantity', description: 'Units per container/pallet', unit: 'units' }
    ],
    application: 'Sets material withdrawal frequency for pull systems'
  },
  {
    id: 'kanban-quantity',
    category: 'Pull Systems',
    title: 'Kanban Quantity',
    formula: 'Kanban = (Daily Demand × (Lead Time + Safety)) ÷ Pack-Out Quantity',
    description: 'Number of kanban cards needed to control production and inventory.',
    example: '(200 units × (2 days + 0.5 days)) ÷ 4 units = 125 kanban cards',
    variables: [
      { symbol: 'Kanban', description: 'Number of kanban cards', unit: 'cards' },
      { symbol: 'Daily Demand', description: 'Customer requirement per day', unit: 'units/day' },
      { symbol: 'Lead Time', description: 'Replenishment time', unit: 'days' },
      { symbol: 'Safety', description: 'Safety stock time', unit: 'days' },
      { symbol: 'Pack-Out Quantity', description: 'Units per container', unit: 'units' }
    ],
    application: 'Controls inventory levels and production signaling'
  },
  {
    id: 'epe',
    category: 'Pull Systems',
    title: 'Every Part Every (EPE)',
    formula: 'EPE = (Available Time ÷ Changeover Time) × Batch Size',
    description: 'Frequency at which every part number can be produced. Lower EPE = more flexible production.',
    example: '(25,200 seconds ÷ 1,800 seconds) × 50 units = 700 units between changeovers',
    variables: [
      { symbol: 'EPE', description: 'Production flexibility measure', unit: 'days' },
      { symbol: 'Available Time', description: 'Total production time available', unit: 'seconds' },
      { symbol: 'Changeover Time', description: 'Time to switch between products', unit: 'seconds' },
      { symbol: 'Batch Size', description: 'Units produced per run', unit: 'units' }
    ],
    application: 'Measures production flexibility and setup efficiency'
  },
  {
    id: 'oee',
    category: 'Advanced Metrics',
    title: 'Overall Equipment Effectiveness (OEE)',
    formula: 'OEE % = Availability × Performance × Quality',
    description: 'Comprehensive measure of equipment productivity combining availability, performance, and quality.',
    example: '85% × 95% × 99% = 80% OEE',
    variables: [
      { symbol: 'OEE %', description: 'Overall equipment effectiveness', unit: '%' },
      { symbol: 'Availability', description: 'Equipment uptime percentage', unit: '%' },
      { symbol: 'Performance', description: 'Speed efficiency vs. ideal', unit: '%' },
      { symbol: 'Quality', description: 'Good units percentage', unit: '%' }
    ],
    application: 'Comprehensive equipment performance measurement'
  }
];

const categories = ['All', 'Foundation', 'Process Analysis', 'Inventory Analysis', 'Pull Systems', 'Advanced Metrics'];

const FormulasGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFormula = (id: string) => {
    setExpandedFormula(expandedFormula === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Foundation': '#4CAF50',
      'Process Analysis': '#2196F3',
      'Inventory Analysis': '#FF9800',
      'Pull Systems': '#9C27B0',
      'Advanced Metrics': '#DC2626'
    };
    return colors[category] || '#666';
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <BookOpen className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">Formulas Guide & Reference</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Comprehensive guide to Value Stream Mapping formulas, calculations, and practical applications
          </p>
        </div>

        {/* Download Section */}
        <div className="card mb-8" style={{ background: 'rgba(255, 213, 89, 0.1)', border: '2px solid #ffd559' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading-medium mb-2" style={{ color: '#1a1a1a' }}>
                📚 Complete VSM Calculation Guide
              </h3>
              <p className="text-body text-muted">
                Download the comprehensive Kaizen Academy PDF guide with detailed examples, case studies, and advanced calculations
              </p>
            </div>
            <a 
              href="/VSM_Calculation_Guide__KAIZEN_ACADEMY.pdf"
              download
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Download className="w-5 h-5" />
              Download PDF Guide
            </a>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-8">
          <div className="grid-2" style={{ gap: '20px' }}>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3" style={{ color: '#666' }} />
              <input
                type="text"
                placeholder="Search formulas, descriptions, or applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-3" style={{ color: '#666' }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
                style={{ paddingLeft: '40px', appearance: 'none' }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formulas Grid */}
        <div className="grid-2" style={{ gap: '30px' }}>
          {filteredFormulas.map(formula => (
            <div key={formula.id} className="card">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: getCategoryColor(formula.category) }}
                  />
                  <h3 className="heading-medium" style={{ color: '#1a1a1a' }}>
                    {formula.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleFormula(formula.id)}
                  className="btn-ghost"
                  style={{ padding: '8px' }}
                >
                  {expandedFormula === formula.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span 
                  className="text-small font-bold px-3 py-1 rounded"
                  style={{ 
                    backgroundColor: getCategoryColor(formula.category),
                    color: 'white',
                    fontSize: '11px'
                  }}
                >
                  {formula.category}
                </span>
              </div>

              {/* Formula */}
              <div className="card mb-4" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                <div className="text-center">
                  <h4 className="heading-small mb-2" style={{ color: '#ffd559' }}>Formula</h4>
                  <div className="text-body font-bold" style={{ fontSize: '16px', fontFamily: 'monospace' }}>
                    {formula.formula}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-body text-muted mb-4" style={{ lineHeight: '1.6' }}>
                {formula.description}
              </p>

              {/* Example */}
              <div className="card mb-4" style={{ background: 'rgba(33, 150, 243, 0.1)', border: '1px solid #2196F3' }}>
                <h4 className="text-small font-bold mb-2" style={{ color: '#2196F3' }}>
                  💡 Practical Example
                </h4>
                <p className="text-small" style={{ lineHeight: '1.5' }}>
                  {formula.example}
                </p>
              </div>

              {/* Expanded Content */}
              {expandedFormula === formula.id && (
                <div className="mt-4">
                  {/* Variables */}
                  <div className="card mb-4" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                    <h4 className="text-small font-bold mb-3">📊 Variables</h4>
                    <div className="grid-2" style={{ gap: '15px' }}>
                      {formula.variables.map(variable => (
                        <div key={variable.symbol} className="flex items-start">
                          <div className="text-small font-bold mr-2" style={{ minWidth: '20px' }}>
                            {variable.symbol}:
                          </div>
                          <div className="text-small text-muted">
                            <div>{variable.description}</div>
                            <div className="text-xs" style={{ color: '#999', marginTop: '2px' }}>
                              Unit: {variable.unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application */}
                  <div className="card" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50' }}>
                    <h4 className="text-small font-bold mb-2" style={{ color: '#4CAF50' }}>
                      🎯 Application
                    </h4>
                    <p className="text-small" style={{ lineHeight: '1.5' }}>
                      {formula.application}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Reference */}
        <div className="card mt-8">
          <h2 className="heading-medium mb-6" style={{ color: '#1a1a1a' }}>
            🚀 Quick Reference Guide
          </h2>
          <div className="grid-3" style={{ gap: '30px' }}>
            <div className="card" style={{ background: 'rgba(255, 213, 89, 0.1)', border: '1px solid #ffd559', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#ffd559' }}>⚡ Quick Start</h4>
              <ol style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li className="mb-2">Start with Takt Time calculation</li>
                <li className="mb-2">Measure current process times</li>
                <li className="mb-2">Calculate inventory and lead times</li>
                <li className="mb-2">Design kanban and pull systems</li>
                <li className="mb-2">Monitor and improve continuously</li>
              </ol>
            </div>
            
            <div className="card" style={{ background: 'rgba(33, 150, 243, 0.1)', border: '1px solid #2196F3', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#2196F3' }}>📈 Best Practices</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li className="mb-2">Use real production data</li>
                <li className="mb-2">Measure multiple cycles</li>
                <li className="mb-2">Include all wait times</li>
                <li className="mb-2">Validate with customer demand</li>
                <li className="mb-2">Document assumptions</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid #DC2626', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#DC2626' }}>🎯 Common Pitfalls</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li className="mb-2">Ignoring planned downtime</li>
                <li className="mb-2">Using estimates vs. actual data</li>
                <li className="mb-2">Forgetting changeover times</li>
                <li className="mb-2">Not including safety factors</li>
                <li className="mb-2">Single measurements only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulasGuide;
