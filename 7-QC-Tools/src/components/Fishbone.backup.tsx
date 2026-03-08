import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Download, RotateCcw, Upload, Edit2, Trash2 } from 'lucide-react';
import ExportButton from './ExportButton';

interface Cause {
  id: string;
  text: string;
  category: string;
}

interface FishboneData {
  effect: string;
  categories: string[];
  causes: Cause[];
}

const DEFAULT_CATEGORIES = {
  manufacturing: ['Man', 'Machine', 'Material', 'Method', 'Measurement', 'Environment'],
  service: ['Policy', 'Procedure', 'People', 'Plant'],
  general: ['Surroundings', 'Suppliers', 'Systems', 'Skills']
};

export default function Fishbone() {
  const [data, setData] = useState<FishboneData>({
    effect: 'Surface Defects on Finished Parts',
    categories: DEFAULT_CATEGORIES.manufacturing,
    causes: []
  });

  const [editingCause, setEditingCause] = useState<string | null>(null);
  const [editingEffect, setEditingEffect] = useState(false);
  const [newCauseText, setNewCauseText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load book example by default
  useEffect(() => {
    loadBookExample();
  }, []);

  const loadBookExample = () => {
    const bookData: FishboneData = {
      effect: 'Surface Defects on Finished Parts',
      categories: DEFAULT_CATEGORIES.manufacturing,
      causes: [
        { id: '1', text: 'Skill level', category: 'Man' },
        { id: '2', text: 'Fatigue', category: 'Man' },
        { id: '3', text: 'Training', category: 'Man' },
        { id: '4', text: 'Operator error', category: 'Man' },
        { id: '5', text: 'Tool wear', category: 'Machine' },
        { id: '6', text: 'Machine vibration', category: 'Machine' },
        { id: '7', text: 'Calibration', category: 'Machine' },
        { id: '8', text: 'Maintenance', category: 'Machine' },
        { id: '9', text: 'Raw material variation', category: 'Material' },
        { id: '10', text: 'Supplier quality', category: 'Material' },
        { id: '11', text: 'Moisture content', category: 'Material' },
        { id: '12', text: 'Process parameters', category: 'Method' },
        { id: '13', text: 'SOP not followed', category: 'Method' },
        { id: '14', text: 'Speed settings', category: 'Method' },
        { id: '15', text: 'Gauge accuracy', category: 'Measurement' },
        { id: '16', text: 'Measurement technique', category: 'Measurement' },
        { id: '17', text: 'Sampling method', category: 'Measurement' },
        { id: '18', text: 'Temperature', category: 'Environment' },
        { id: '19', text: 'Humidity', category: 'Environment' },
        { id: '20', text: 'Lighting', category: 'Environment' }
      ]
    };
    setData(bookData);
  };

  const clearData = () => {
    setData({
      effect: 'Surface Defects on Finished Parts',
      categories: DEFAULT_CATEGORIES.manufacturing,
      causes: []
    });
  };

  const addCause = () => {
    if (newCauseText.trim() && selectedCategory) {
      const newCause: Cause = {
        id: Date.now().toString(),
        text: newCauseText.trim(),
        category: selectedCategory
      };
      setData(prev => ({
        ...prev,
        causes: [...prev.causes, newCause]
      }));
      setNewCauseText('');
      setSelectedCategory('');
    }
  };

  const updateCause = (id: string, text: string) => {
    setData(prev => ({
      ...prev,
      causes: prev.causes.map(cause => 
        cause.id === id ? { ...cause, text } : cause
      )
    }));
    setEditingCause(null);
  };

  const deleteCause = (id: string) => {
    setData(prev => ({
      ...prev,
      causes: prev.causes.filter(cause => cause.id !== id)
    }));
  };

  const updateEffect = (effect: string) => {
    setData(prev => ({ ...prev, effect }));
    setEditingEffect(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Man': '#3b82f6',
      'Machine': '#ef4444',
      'Material': '#10b981',
      'Method': '#f59e0b',
      'Measurement': '#8b5cf6',
      'Environment': '#06b6d4',
      'Policy': '#ec4899',
      'Procedure': '#84cc16',
      'People': '#f97316',
      'Plant': '#6366f1',
      'Surroundings': '#14b8a6',
      'Suppliers': '#a855f7',
      'Systems': '#eab308',
      'Skills': '#0ea5e9'
    };
    return colors[category] || '#6b7280';
  };

  const getCausesByCategory = () => {
    const grouped: Record<string, Cause[]> = {};
    data.categories.forEach(category => {
      grouped[category] = data.causes.filter(cause => cause.category === category);
    });
    return grouped;
  };

  const groupedCauses = getCausesByCategory();

  return (
    <div className="section section-light">
      <div className="container">
        {/* Tool Header */}
        <div className="tool-header">
          <div className="tool-number">02</div>
          <h1>CAUSE & EFFECT DIAGRAM</h1>
          <p>Systematically identify and display all possible causes of a quality problem using Ishikawa fishbone analysis</p>
        </div>

        <div className="tool-body">
          {/* Instructions */}
          <div className="card mb-4" style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
            <h4 className="heading-small mb-2" style={{ color: '#1a1a1a' }}>🐟 How to Use Fishbone Diagram</h4>
            <ul className="text-small" style={{ color: '#666', paddingLeft: '20px' }}>
              <li>Define the problem/effect (the "head" of the fish)</li>
              <li>Select categories for causes (Man, Machine, Material, Method, Measurement, Environment)</li>
              <li>Add specific causes under each category</li>
              <li>Edit causes by clicking on them</li>
              <li>Remove causes with the trash button</li>
              <li>Use "Load Book Example" to see sample data</li>
            </ul>
          </div>

          {/* Input Panel */}
          <div className="input-panel">
            <div className="card">
              <h2 className="heading-medium mb-4">Diagram Configuration</h2>
              
              <div className="mb-6">
                <label className="block text-small font-bold mb-2">
                  Effect (Problem Statement)
                </label>
                {editingEffect ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={data.effect}
                      className="input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateEffect((e.target as HTMLInputElement).value);
                        }
                      }}
                      onBlur={(e) => updateEffect(e.target.value)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer"
                    onClick={() => setEditingEffect(true)}
                  >
                    <span className="text-body font-medium">{data.effect}</span>
                    <Edit2 className="w-4 h-4 text-yellow-600" />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="heading-small mb-3">Add New Cause</h3>
                <div className="space-y-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input"
                  >
                    <option value="">Select Category</option>
                    {data.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newCauseText}
                    onChange={(e) => setNewCauseText(e.target.value)}
                    placeholder="Enter cause description..."
                    className="input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCause();
                      }
                    }}
                  />
                  <button onClick={addCause} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Cause
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={loadBookExample} className="btn-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Load Book Example
                </button>
                <button onClick={clearData} className="btn-ghost">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Data
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="heading-small mb-4">Cause Analysis</h3>
              <div className="space-y-4">
                {Object.entries(groupedCauses).map(([category, causes]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getCategoryColor(category) }}
                      />
                      <span className="text-small font-bold">{category}</span>
                      <span className="text-small text-muted">({causes.length} causes)</span>
                    </div>
                    <div className="space-y-1 ml-6">
                      {causes.map(cause => (
                        <div key={cause.id} className="flex items-center justify-between py-1">
                          {editingCause === cause.id ? (
                            <input
                              type="text"
                              defaultValue={cause.text}
                              className="input text-small"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateCause(cause.id, (e.target as HTMLInputElement).value);
                                }
                              }}
                              onBlur={(e) => updateCause(cause.id, e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <span className="text-small">{cause.text}</span>
                          )}
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingCause(cause.id)}
                              className="p-1 hover:bg-yellow-50 rounded"
                            >
                              <Edit2 className="w-3 h-3 text-yellow-600" />
                            </button>
                            <button
                              onClick={() => deleteCause(cause.id)}
                              className="p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="chart-panel">
            <div className="card" id="fishbone-chart">
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-small">Fishbone Diagram</h3>
                <ExportButton
                  chartData={{
                    elementId: 'fishbone-chart',
                    title: 'Fishbone Diagram Analysis',
                    description: `Ishikawa diagram showing ${data.causes.length} potential causes of "${data.effect}" across ${data.categories.length} categories`
                  }}
                  dataExport={{
                    data: data.causes.map(cause => ({
                      cause: cause.text,
                      category: cause.category,
                      id: cause.id
                    })),
                    headers: ['id', 'cause', 'category'],
                    sheetName: 'Fishbone Causes'
                  }}
                  reportData={{
                    title: 'Fishbone (Ishikawa) Diagram Analysis Report',
                    toolName: 'Fishbone Diagram',
                    date: new Date().toLocaleDateString(),
                    data: {
                      effect: data.effect,
                      totalCauses: data.causes.length,
                      categories: data.categories,
                      causesByCategory: data.categories.map(cat => ({
                        category: cat,
                        causeCount: data.causes.filter(c => c.category === cat).length,
                        causes: data.causes.filter(c => c.category === cat).map(c => c.text)
                      })),
                      priorityCategory: data.categories.reduce((max, cat) => {
                        const count = data.causes.filter(c => c.category === cat).length;
                        return count > max.count ? { category: cat, count } : max;
                      }, { category: '', count: 0 })
                    },
                    charts: [{
                      elementId: 'fishbone-chart',
                      title: 'Fishbone Diagram',
                      description: `Ishikawa diagram for root cause analysis of "${data.effect}"`
                    }],
                    summary: `Fishbone diagram analysis identifies ${data.causes.length} potential root causes of "${data.effect}" across ${data.categories.length} main categories: ${data.categories.join(', ')}. The category with most causes should be prioritized for further investigation.`,
                    recommendations: [
                      `Prioritize the "${data.categories.reduce((max, cat) => data.causes.filter(c => c.category === cat).length > data.causes.filter(c => c.category === max).length ? cat : max, data.categories[0])}" category with the most potential causes for detailed analysis`,
                      'Use Check Sheets to collect data on the frequency of each potential cause',
                      'Create a Pareto chart to quantify which causes have the highest impact',
                      'Develop action plans to address the true root causes, not just symptoms'
                    ]
                  }}
                />
              </div>
              
              <div className="bg-white rounded-lg p-8" style={{ minHeight: '500px' }}>
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  {/* Main horizontal line (spine) */}
                  <line x1="100" y1="200" x2="600" y2="200" stroke="#1a1a1a" strokeWidth="3" />
                  
                  {/* Arrow head */}
                  <polygon points="600,200 590,195 590,205" fill="#1a1a1a" />
                  
                  {/* Effect box */}
                  <rect x="610" y="170" width="180" height="60" fill="#ffd559" stroke="#1a1a1a" strokeWidth="2" rx="4" />
                  <text x="700" y="195" textAnchor="middle" className="text-small font-bold" fill="#1a1a1a">
                    EFFECT
                  </text>
                  <text x="700" y="215" textAnchor="middle" className="text-xs" fill="#1a1a1a">
                    {data.effect}
                  </text>
                  
                  {/* Category bones and causes */}
                  {data.categories.map((category, index) => {
                    const causes = groupedCauses[category] || [];
                    const angle = (index - (data.categories.length - 1) / 2) * 15;
                    const boneLength = 150;
                    const startX = 150 + index * 60;
                    const startY = 200;
                    const endX = startX + Math.cos(angle * Math.PI / 180) * boneLength;
                    const endY = startY + Math.sin(angle * Math.PI / 180) * boneLength;
                    
                    return (
                      <g key={category}>
                        {/* Main bone */}
                        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={getCategoryColor(category)} strokeWidth="2" />
                        
                        {/* Small bone lines */}
                        <line x1={endX - 10} y1={endY - 5} x2={endX + 10} y2={endY - 5} stroke={getCategoryColor(category)} strokeWidth="2" />
                        <line x1={endX - 10} y1={endY + 5} x2={endX + 10} y2={endY + 5} stroke={getCategoryColor(category)} strokeWidth="2" />
                        
                        {/* Category label */}
                        <text x={endX + 20} y={endY} className="text-small font-bold" fill={getCategoryColor(category)}>
                          {category}
                        </text>
                        
                        {/* Cause labels */}
                        {causes.slice(0, 3).map((cause, causeIndex) => {
                          const causeX = endX + 20;
                          const causeY = endY + (causeIndex - 1) * 15;
                          return (
                            <text key={cause.id} x={causeX} y={causeY} className="text-xs" fill="#666">
                              {cause.text}
                            </text>
                          );
                        })}
                        
                        {causes.length > 3 && (
                          <text x={endX + 20} y={endY + 30} className="text-xs" fill="#666" fontStyle="italic">
                            +{causes.length - 3} more...
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation Panel */}
        <div className="interpretation-panel card-featured">
          <h3 className="heading-medium mb-4">Interpretation & Analysis</h3>
          <div className="text-body text-muted">
            <div className="grid-3 gap-4 mb-6">
              {Object.entries(groupedCauses).map(([category, causes]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-small font-bold mb-2" style={{ color: getCategoryColor(category) }}>
                    {category}
                  </div>
                  <div className="text-2xl font-bold mb-1">{causes.length}</div>
                  <div className="text-xs text-muted">potential causes</div>
                  {causes.length === Math.max(...Object.values(groupedCauses).map(c => c.length)) && (
                    <div className="mt-2">
                      <span className="badge-warn">Priority Area</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <h4 className="heading-small mb-2">Ishikawa's Methodology</h4>
              <p className="text-small mb-2">
                "The cause closest to the effect on the diagram is not necessarily the root cause. 
                Trace back through the bones to find the true root cause."
              </p>
              <p className="text-small">
                "After building the diagram, use the Pareto chart to quantify which cause category 
                contributes most to the effect."
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="heading-small">Analysis Steps:</h4>
              <ol className="space-y-2 ml-6">
                <li className="text-body">Review all identified causes for completeness</li>
                <li className="text-body">Prioritize categories with most potential causes</li>
                <li className="text-body">Use data to quantify actual impact of each cause</li>
                <li className="text-body">Focus on root causes, not symptoms</li>
                <li className="text-body">Develop action plans for high-impact causes</li>
              </ol>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="heading-small mb-2">Next Steps</h4>
              <p className="text-small">
                Transfer the most significant causes to a Pareto chart to quantify their impact. 
                Then develop specific action plans to address the root causes identified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
