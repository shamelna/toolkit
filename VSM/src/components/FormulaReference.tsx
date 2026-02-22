import React, { useState } from 'react';
import { BookOpen, Search, Calculator, Clock, Users, Package, TrendingUp, Layers } from 'lucide-react';

interface Formula {
  id: number;
  name: string;
  formula: string;
  example: string;
  pageRef: string;
  category: 'takt-time' | 'inventory' | 'capacity' | 'kanban' | 'general';
  description: string;
}

const formulas: Formula[] = [
  {
    id: 1,
    name: 'Available Working Time',
    formula: 'Total Shift Time − Break Time',
    example: '28,800 sec − 1,200 sec = 27,600 sec',
    pageRef: 'VSM Guide',
    category: 'takt-time',
    description: 'Net production time available per shift after breaks'
  },
  {
    id: 2,
    name: 'Takt Time',
    formula: 'Available Working Time / Customer Demand per Shift',
    example: '27,600 sec ÷ 460 pcs = 60 sec/pc',
    pageRef: 'pp.44, 58',
    category: 'takt-time',
    description: 'Required production pace to meet customer demand'
  },
  {
    id: 3,
    name: 'Daily Customer Demand',
    formula: 'Monthly Demand / Working Days per Month',
    example: '18,400 pcs ÷ 20 days = 920 pcs/day',
    pageRef: 'VSM Guide',
    category: 'takt-time',
    description: 'Average daily demand from monthly requirements'
  },
  {
    id: 4,
    name: 'Demand per Shift',
    formula: 'Daily Demand / Shifts per Day',
    example: '920 pcs/day ÷ 2 shifts = 460 pcs/shift',
    pageRef: 'VSM Guide',
    category: 'takt-time',
    description: 'Customer demand allocated to each shift'
  },
  {
    id: 5,
    name: 'Inventory in Days',
    formula: 'Inventory Quantity / Daily Customer Demand',
    example: '7,000 pcs ÷ 920 pcs/day = 7.6 days',
    pageRef: 'VSM Guide',
    category: 'inventory',
    description: 'How many days of inventory you have on hand'
  },
  {
    id: 6,
    name: 'Production Lead Time',
    formula: 'Sum of all inventory wait times on timeline',
    example: '5 days + 7.6 days + 1.8 days + 2.7 days + 2 days + 4.5 days = 23.6 days',
    pageRef: 'VSM Guide',
    category: 'inventory',
    description: 'Total time from raw material to finished goods'
  },
  {
    id: 7,
    name: 'Total Processing (VA) Time',
    formula: 'Sum of all process cycle times',
    example: '1 sec + 39 sec + 46 sec + 62 sec + 40 sec = 188 sec',
    pageRef: 'VSM Guide',
    category: 'inventory',
    description: 'Total value-added processing time'
  },
  {
    id: 8,
    name: 'Process Capacity (no C/O)',
    formula: '(Available Time / Cycle Time) × Uptime',
    example: '(27,600 sec ÷ 1 sec) × 85% = 23,460 pcs/shift',
    pageRef: 'p.22',
    category: 'capacity',
    description: 'Maximum output per shift without changeovers'
  },
  {
    id: 9,
    name: 'Operators Needed',
    formula: 'Total Work Content / Takt Time',
    example: '187 sec ÷ 60 sec/pc = 3.12 → 4 operators',
    pageRef: 'pp.63-64',
    category: 'capacity',
    description: 'Number of operators required to meet takt time'
  },
  {
    id: 10,
    name: 'Max Work Content per Operator',
    formula: 'Takt Time − Buffer',
    example: '3 ops × 56 sec = 168 sec target per operator',
    pageRef: 'p.64',
    category: 'capacity',
    description: 'Target work allocation per operator'
  },
  {
    id: 11,
    name: 'Pitch',
    formula: 'Takt Time × Pack-Out Quantity',
    example: '60 sec/pc × 20 pcs = 1,200 sec = 20 min',
    pageRef: 'p.51',
    category: 'kanban',
    description: 'Time interval for paced withdrawal'
  },
  {
    id: 12,
    name: 'Kanban per Shift',
    formula: 'Demand per Shift / Container Quantity',
    example: '460 pcs ÷ 20 pcs/container = 23 kanban/shift',
    pageRef: 'p.76',
    category: 'kanban',
    description: 'Number of kanban cards needed per shift'
  },
  {
    id: 13,
    name: 'Columns in Leveling Box',
    formula: 'Available Time per Shift / Pitch',
    example: '27,600 sec ÷ 1,200 sec = 23 columns',
    pageRef: 'p.76',
    category: 'kanban',
    description: 'Number of time slots in production leveling box'
  },
  {
    id: 14,
    name: 'Time Left for Changeovers',
    formula: 'Available Time − Time to Run Daily Demand',
    example: '16 hrs − 14.5 hrs = 1.5 hrs',
    pageRef: 'p.54',
    category: 'kanban',
    description: 'Available time for equipment changeovers'
  },
  {
    id: 15,
    name: 'Max Changeovers per Day',
    formula: 'Time Left for C/O / Changeover Duration',
    example: '1.5 hrs ÷ 0.25 hrs = 6 changeovers/day',
    pageRef: 'p.54',
    category: 'kanban',
    description: 'Maximum number of changeovers possible per day'
  },
  {
    id: 16,
    name: 'Batch Size (EPE = 1 day)',
    formula: 'Changeover Time / (Batch Size x Cycle Time)',
    example: 'LH: 600 pcs/day, RH: 320 pcs/day',
    pageRef: 'pp.67-68',
    category: 'kanban',
    description: 'Optimal batch size for one-day production pattern'
  },
  {
    id: 17,
    name: 'Inventory Turns',
    formula: '≈ Working Days per Year ÷ Production Lead Time',
    example: '240 days ÷ 23.6 days ≈ 10 turns/year',
    pageRef: 'pp.69,81',
    category: 'inventory',
    description: 'How many times inventory turns over per year'
  },
  {
    id: 18,
    name: 'C/O-to-Run Ratio',
    formula: 'Changeover Time / (Batch Size × Cycle Time)',
    example: '3,600 sec ÷ 60 sec = 60:1 (impractical)',
    pageRef: 'p.68',
    category: 'kanban',
    description: 'Ratio of changeover time to production run time'
  },
  {
    id: 19,
    name: 'VA Ratio',
    formula: 'VA seconds ÷ (Lead Time days × 86,400 sec/day)',
    example: '188 sec ÷ (23.6 days × 86,400 sec/day) = 0.0092%',
    pageRef: 'VSM Guide',
    category: 'inventory',
    description: 'Percentage of value-added time in total lead time'
  },
  {
    id: 20,
    name: 'Mix Leveling Pattern',
    formula: 'Target Work Content / Number of Operators',
    example: 'RLLRLLRLL... (2:1 ratio of L to R)',
    pageRef: 'pp.73-74',
    category: 'kanban',
    description: 'Production sequence for mixed model leveling'
  },
  {
    id: 21,
    name: 'Daily Delivery Inventory Reduction',
    formula: 'Changeover Time / (Batch Size × Cycle Time)',
    example: 'Weekly→Daily = ~80% reduction',
    pageRef: 'p.69',
    category: 'kanban',
    description: 'Inventory reduction from increased delivery frequency'
  },
  {
    id: 22,
    name: 'Weld/Deflash Changeovers/Shift',
    formula: '1 − (New Delivery Freq / Old)',
    example: '3,600 sec ÷ 300 sec = 12 changeovers/shift',
    pageRef: 'p.108',
    category: 'kanban',
    description: 'Changeover requirements for TWI case study'
  }
];

const categoryIcons = {
  'takt-time': Clock,
  'inventory': Package,
  'capacity': Users,
  'kanban': Layers,
  'general': Calculator,
};

const categoryColors = {
  'takt-time': '#2196F3',
  'inventory': '#4CAF50',
  'capacity': '#FF9800',
  'kanban': '#DC2626',
  'general': '#666666',
};

export default function FormulaReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFormula, setExpandedFormula] = useState<number | null>(null);

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'takt-time', 'inventory', 'capacity', 'kanban'];

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <BookOpen className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">Formula Reference</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Complete guide to all VSM calculations from "Learning to See"
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card-elevated mb-8">
          <div className="grid-2" style={{ gap: '20px' }}>
            <div>
              <label className="block text-small font-bold mb-2">Search Formulas</label>
              <div style={{ position: 'relative' }}>
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#666' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  placeholder="Search formulas, descriptions..."
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-small font-bold mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                <option value="takt-time">Takt Time</option>
                <option value="inventory">Inventory & Lead Time</option>
                <option value="capacity">Process Capacity</option>
                <option value="kanban">Kanban & Leveling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-small text-muted">
            Found {filteredFormulas.length} formula{filteredFormulas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Formula Cards */}
        <div className="grid-3">
          {filteredFormulas.map((formula) => {
            const Icon = categoryIcons[formula.category];
            const isExpanded = expandedFormula === formula.id;
            
            return (
              <div 
                key={formula.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpandedFormula(isExpanded ? null : formula.id)}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div 
                    style={{ 
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: `${categoryColors[formula.category]}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: categoryColors[formula.category] }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="heading-small">{formula.name}</h3>
                    <span 
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: `${categoryColors[formula.category]}20`,
                        color: categoryColors[formula.category]
                      }}
                    >
                      {formula.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Formula */}
                <div style={{ 
                  background: '#f8f9fa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  {formula.formula}
                </div>

                {/* Description */}
                <p className="text-small text-muted mb-3">
                  {formula.description}
                </p>

                {/* Example (always visible) */}
                <div style={{ 
                  background: 'rgba(255, 213, 89, 0.1)',
                  border: '1px solid #ffd559',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div className="text-small font-bold mb-1" style={{ color: '#1a1a1a' }}>Example:</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#1a1a1a' }}>
                    {formula.example}
                  </div>
                </div>

                {/* Book Reference */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#666',
                  borderTop: '1px solid #e5e5e5',
                  paddingTop: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BookOpen className="w-3 h-3 mr-2" />
                    <span>{formula.pageRef}</span>
                  </div>
                  <div style={{ color: categoryColors[formula.category] }}>
                    {isExpanded ? 'Click to collapse' : 'Click to expand'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFormulas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#666' }} />
            <p className="text-body text-muted">
              No formulas found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
