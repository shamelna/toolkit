import React, { useState } from 'react';
import { BookOpen, Download, Search, Filter, Calculator, Clock, Users, Package, TrendingUp, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface Formula {
  id: string;
  category: string;
  title: string;
  formula: string;
  description: string;
  example: string;
  variables?: Variable[];
  application?: string;
  pageReference?: string;
}

interface Variable {
  symbol: string;
  description: string;
  unit: string;
}

const formulas: Formula[] = [
  // Part 1 - Foundation: Demand & Tempo
  {
    id: 'available-time',
    category: 'Foundation',
    title: 'Available Working Time',
    formula: 'Available Time = Total Shift Time − Breaks − Other Non-Working Time',
    description: 'Total productive time available for production during a shift, excluding breaks and planned downtime.',
    example: '8 hours (28,800 sec) − 1,200 sec breaks = 27,600 sec available',
    pageReference: 'p. 59',
    application: 'Foundation for all VSM calculations - determines your production capacity'
  },
  {
    id: 'daily-demand',
    category: 'Foundation',
    title: 'Customer Demand Rate',
    formula: 'Daily Demand = Monthly Demand ÷ Working Days per Month',
    description: 'Convert monthly customer requirements to daily demand for production planning.',
    example: '18,400 pcs ÷ 20 days = 920 pcs/day',
    pageReference: 'p. 58',
    application: 'Sets the production target that drives all other calculations'
  },
  {
    id: 'demand-per-shift',
    category: 'Foundation',
    title: 'Demand per Shift',
    formula: 'Demand per Shift = Daily Demand ÷ Number of Shifts',
    description: 'Daily demand distributed across production shifts.',
    example: '920 pcs ÷ 2 shifts = 460 pcs/shift',
    pageReference: 'p. 58',
    application: 'Used with available time to calculate takt time'
  },
  {
    id: 'takt-time',
    category: 'Foundation',
    title: 'Takt Time',
    formula: 'Takt Time = Available Working Time per Shift ÷ Customer Demand per Shift',
    description: 'The required production pace to meet customer demand. This is the heartbeat of your production system.',
    example: '27,600 sec ÷ 460 pcs = 60 seconds per unit',
    pageReference: 'p. 44',
    application: 'Sets the production rhythm and drives all capacity calculations'
  },

  // Part 2 - Current State Analysis
  {
    id: 'process-capacity',
    category: 'Process Analysis',
    title: 'Process Capacity',
    formula: 'Capacity = (Available Time ÷ Cycle Time) × Uptime %',
    description: 'Maximum output capability of a process given available time, cycle time, and uptime.',
    example: '(27,600 ÷ 1 sec) × 85% = 23,460 pcs per shift',
    pageReference: 'p. 22',
    application: 'Determines if a process can meet customer demand'
  },
  {
    id: 'inventory-days',
    category: 'Inventory Analysis',
    title: 'Inventory in Days',
    formula: 'Inventory (days) = Inventory Quantity ÷ Daily Customer Demand',
    description: 'How many days of inventory you currently have on hand at each stage.',
    example: '7,000 pcs ÷ 920 pcs/day = 7.6 days of inventory',
    pageReference: 'p. 35',
    application: 'Inventory management and reduction targets'
  },
  {
    id: 'production-lead-time',
    category: 'Inventory Analysis',
    title: 'Production Lead Time',
    formula: 'Production Lead Time = Sum of all inventory days across value stream',
    description: 'Total time from raw material receipt to finished goods delivery.',
    example: '5.0 + 7.6 + 1.8 + 2.7 + 2.0 = 23.6 days total lead time',
    pageReference: 'p. 35',
    application: 'Identifies bottlenecks and total cycle time'
  },
  {
    id: 'va-time',
    category: 'Inventory Analysis',
    title: 'Total Value-Added Time',
    formula: 'VA Time = Sum of all process cycle times',
    description: 'Total time where value is actually added to the product from customer perspective.',
    example: '1 + 39 + 46 + 62 + 40 = 188 seconds of processing time',
    pageReference: 'p. 35',
    application: 'Measures actual processing time vs. total lead time'
  },
  {
    id: 'va-percentage',
    category: 'Inventory Analysis',
    title: 'VA % and NVA %',
    formula: 'VA % = Total Processing Time ÷ (Production Lead Time × 86,400 sec/day)',
    description: 'Percentage of total lead time that adds value from customer perspective.',
    example: '188 sec ÷ (23.6 days × 86,400 sec/day) = 0.0092% (99.99% NVA)',
    pageReference: 'p. 35',
    application: 'Measures process efficiency and improvement potential'
  },

  // Part 3 - Future State Design
  {
    id: 'operators-needed',
    category: 'Process Design',
    title: 'Operators Needed for a Cell',
    formula: 'Operators Needed = Total Work Content ÷ Takt Time',
    description: 'Number of operators required to meet takt time based on total work content.',
    example: '187 sec ÷ 60 sec = 3.12 → 4 operators (round up)',
    pageReference: 'p. 63',
    application: 'Workforce planning and process balancing'
  },
  {
    id: 'max-work-operator',
    category: 'Process Design',
    title: 'Max Work per Operator',
    formula: 'Max Work per Operator = Takt Time − Buffer (e.g., 4 sec)',
    description: 'Target work content per operator to allow for variation and improvement.',
    example: '60 sec − 4 sec buffer = 56 sec max work per operator',
    pageReference: 'p. 64',
    application: 'Sets realistic operator workload targets'
  },
  {
    id: 'cycle-time-vs-takt',
    category: 'Process Design',
    title: 'Cycle Time vs. Takt',
    formula: 'Time Remaining = Available Time − (Demand × Actual C/T)',
    description: 'When processes require changeovers, they must cycle faster than takt to leave time for setups.',
    example: 'Available time for 12 changeovers at 300 sec each = 3,600 sec (1 hour)',
    pageReference: 'p. 107–108',
    application: 'Ensures changeover time is accommodated in production schedule'
  },

  // Part 4 - Pull Systems & Supermarkets
  {
    id: 'kanban-sizing',
    category: 'Pull Systems',
    title: 'Kanban Sizing',
    formula: 'Kanban per Shift = Demand per Shift ÷ Container Quantity',
    description: 'Number of kanban cards needed to control production and inventory flow.',
    example: '460 pcs ÷ 20 pcs/tray = 23 kanban per shift',
    pageReference: 'p. 61',
    application: 'Controls inventory levels and Production signaling'
  },
  {
    id: 'container-time',
    category: 'Pull Systems',
    title: 'Container Size as Time',
    formula: 'Time per Container = Container Quantity × Takt Time',
    description: 'Converts container capacity to time-based inventory management.',
    example: '60 pcs × 60 sec = 3,600 sec = 60 minutes per container',
    pageReference: 'p. 67',
    application: 'Sets material withdrawal frequency for pull systems'
  },
  {
    id: 'supermarket-sizing',
    category: 'Pull Systems',
    title: 'Supermarket Sizing',
    formula: 'Supermarket Size = EPE Demand + Safety Buffer',
    description: 'Size of controlled inventory supermarket to support production while minimizing inventory.',
    example: '1 day EPE + 0.5 day buffer = 1.5 days of supermarket inventory',
    pageReference: 'p. 67–68',
    application: 'Balances inventory availability with minimal stock levels'
  },
  {
    id: 'pitch',
    category: 'Pull Systems',
    title: 'Pitch',
    formula: 'Pitch = Takt Time × Pack-Out Quantity',
    description: 'The basic unit of your production schedule for a product family.',
    example: '60 sec × 20 pcs = 1,200 sec = 20 minutes pitch',
    pageReference: 'p. 51',
    application: 'Sets material withdrawal and production scheduling interval'
  },
  {
    id: 'leveling-box',
    category: 'Pull Systems',
    title: 'Load-Leveling Box',
    formula: 'Columns in Leveling Box = Available Time per Shift ÷ Pitch',
    description: 'Number of time slots in production leveling box for mixed-model scheduling.',
    example: '27,600 sec ÷ 1,200 sec = 23 columns',
    pageReference: 'p. 53',
    application: 'Visual scheduling tool for production leveling'
  },
  {
    id: 'mix-leveling',
    category: 'Pull Systems',
    title: 'Mix Leveling Pattern',
    formula: 'Mix Ratio = LH Quantity ÷ RH Quantity → Repeating Pattern',
    description: 'Creates repeating pattern for mixed-model production to match demand ratio.',
    example: '30 LH ÷ 16 RH = 1.875:1 → RLLRLLRLL pattern (every 3 trays: 2 LH + 1 RH)',
    pageReference: 'p. 73–74',
    application: 'Enables smooth mixed-model production with consistent pattern'
  },

  // Part 5 - Scheduling & Leveling
  {
    id: 'batch-size-epe',
    category: 'Scheduling',
    title: 'Current Batch Size from EPE',
    formula: 'Batch Size = EPE Interval (days) × Daily Demand',
    description: 'Current batch sizes based on how often each part number is produced.',
    example: '10 days × 600 pcs/day = 6,000 pcs batch size',
    pageReference: 'p. 77',
    application: 'Measures current production flexibility'
  },
  {
    id: 'target-batch-size',
    category: 'Scheduling',
    title: 'Target Batch Size (EPE = 1 day)',
    description: 'Target batch sizes for improved production flexibility.',
    example: '1 day × 600 pcs/day = 600 pcs per day (LH) and 320 pcs/day (RH)',
    pageReference: 'p. 68',
    application: 'Reduces inventory and improves response to demand changes'
  },
  {
    id: 'inventory-reduction',
    category: 'Scheduling',
    title: 'Inventory Reduction from Smaller Batches',
    formula: 'Reduction % = 1 − (New Batch ÷ Old Batch)',
    description: 'Percentage inventory reduction achieved through smaller batch sizes.',
    example: '1 − (300 ÷ 6,000) = 95% reduction (plus 85% from supermarket buffer)',
    pageReference: 'p. 77',
    application: 'Quantifies inventory improvement from batch size reduction'
  },
  {
    id: 'changeover-budget',
    category: 'Scheduling',
    title: 'Changeover Budget Method',
    formula: 'Time for C/O = Available Time − Time to Run Daily Demand',
    description: 'Allocates time for changeovers based on remaining capacity after meeting demand.',
    example: '1.5 hours available for 6 changeovers per day at 15 minutes each',
    pageReference: 'p. 54',
    application: 'Ensures adequate changeover capacity for mixed-model production'
  },

  // Part 6 - Performance Metrics
  {
    id: 'inventory-turns',
    category: 'Performance Metrics',
    title: 'Inventory Turns',
    formula: 'Inventory Turns ≈ Working Days per Year ÷ Production Lead Time (days)',
    description: 'Measures how efficiently inventory is being used and turned over.',
    example: '240 days ÷ 23.6 days = 10 turns per year (current state)',
    pageReference: 'p. 69',
    application: 'Higher turns indicate better inventory efficiency'
  },
  {
    id: 'lead-time-reduction',
    category: 'Performance Metrics',
    title: 'Lead Time Reduction',
    formula: 'Reduction % = (Current − Future) ÷ Current',
    description: 'Percentage improvement in total production lead time.',
    example: '(23.6 − 4.5) ÷ 23.6 = 80.9% reduction',
    pageReference: 'p. 81',
    application: 'Measures effectiveness of lean improvements'
  }
];

const categories = [
  'All',
  'Foundation',
  'Process Analysis', 
  'Inventory Analysis',
  'Process Design',
  'Pull Systems',
  'Scheduling',
  'Performance Metrics'
];

const FormulasGuideNew = () => {
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
      'Process Design': '#9C27B0',
      'Pull Systems': '#673AB7',
      'Scheduling': '#E91E63',
      'Performance Metrics': '#DC2626'
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
            Complete reference of every calculation and formula from Learning to See, organized logically with worked examples from Acme Stamping and TWI Industries case studies.
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
                Download the comprehensive Kaizen Academy PDF guide with detailed examples, case studies, and advanced calculations from Learning to See
              </p>
            </div>
            <a 
              href="/VSM/VSM_Calculation_Guide__KAIZEN_ACADEMY.pdf"
              download
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Download className="w-5 h-5" />
              Download PDF Guide
            </a>
            <a 
              href="/VSM/docs/VSM_Calculations_Learning_to_See.xlsx"
              download
              className="btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}
            >
              <Download className="w-5 h-5" />
              Download Excel Template
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
                  {formula.pageReference && (
                    <div className="text-small text-muted mt-2">
                      Reference: Learning to See, Page {formula.pageReference}
                    </div>
                  )}
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
                <li className="mb-2">Start with Available Time calculation</li>
                <li className="mb-2">Calculate Customer Demand rate</li>
                <li className="mb-2">Determine Takt Time</li>
                <li className="mb-2">Analyze current process capacity</li>
                <li className="mb-2">Calculate inventory and lead times</li>
                <li className="mb-2">Design future state with proper staffing</li>
              </ol>
            </div>
            
            <div className="card" style={{ background: 'rgba(33, 150, 243, 0.1)', border: '1px solid #2196F3', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#2196F3' }}>📈 Best Practices</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li className="mb-2">Use real production data</li>
                <li className="mb-2">Measure multiple cycles</li>
                <li className="mb-2">Include all wait times</li>
                <li className="mb-2">Validate with customer demand</li>
                <li className="mb-2">Document all assumptions</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid #DC2626', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#DC2626' }}>🎯 Key Insights</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li className="mb-2">VA% shows process efficiency</li>
                <li className="mb-2">99%+ of time is typically non-value-added</li>
                <li className="mb-2">Takt time drives all capacity planning</li>
                <li className="mb-2">Small batches = less inventory</li>
                <li className="mb-2">Changeover budget enables mixed-model production</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Case Studies Summary */}
        <div className="card mt-8">
          <h2 className="heading-medium mb-6" style={{ color: '#1a1a1a' }}>
            📊 Case Studies Summary
          </h2>
          <div className="grid-2" style={{ gap: '30px' }}>
            <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#2196F3' }}>🏭 Acme Stamping</h4>
              <div className="text-small" style={{ lineHeight: '1.6' }}>
                <p className="mb-2"><strong>Current State:</strong> 23.6 days lead time, 0.0092% VA</p>
                <p className="mb-2"><strong>Future State:</strong> 4.5 days lead time, 0.0435% VA</p>
                <p><strong>Improvement:</strong> 80.9% lead time reduction</p>
              </div>
            </div>
            
            <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#9C27B0' }}>🏭 TWI Industries</h4>
              <div className="text-small" style={{ lineHeight: '1.6' }}>
                <p className="mb-2"><strong>Current State:</strong> ~43 days lead time</p>
                <p className="mb-2"><strong>Future State:</strong> &lt;11 days lead time</p>
                <p><strong>Key Innovation:</strong> Advanced weld/deflash cell with 5 operators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulasGuideNew;
