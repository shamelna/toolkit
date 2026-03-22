import React, { useState, useEffect, useMemo } from 'react';
import { GitBranch, Plus, Download, RotateCcw, Upload, Edit2, Trash2, X } from 'lucide-react';
import ExportButton from './ExportButton';
import ToolHeader from './ToolHeader';
import KaizenPromo from './KaizenPromo';

// New data model with subcauses
interface Subcause {
  id: string;
  text: string;
}

interface Cause {
  id: string;
  text: string;
  subcauses: Subcause[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  causes: Cause[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'man', name: 'Man', color: '#3b82f6', causes: [] },
  { id: 'machine', name: 'Machine', color: '#ef4444', causes: [] },
  { id: 'material', name: 'Material', color: '#10b981', causes: [] },
  { id: 'method', name: 'Method', color: '#f59e0b', causes: [] },
  { id: 'measurement', name: 'Measurement', color: '#8b5cf6', causes: [] },
  { id: 'environment', name: 'Environment', color: '#06b6d4', causes: [] }
];

// SVG constants
const MIN_CATEGORIES = 4;
const MAX_CATEGORIES = 8;
const MAX_SUBCAUSES = 4;
const SPINE_START_X = 200;
const SPINE_Y = 300;
const BASE_SVG_HEIGHT = 600;
const BASE_SVG_WIDTH = 1200;
const BONE_LENGTH = 230;

export default function Fishbone() {
  const [effect, setEffect] = useState('Surface Defects on Finished Parts');
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isAnimating, setIsAnimating] = useState<Record<string, boolean>>({});
  
  // Input states
  const [editingEffect, setEditingEffect] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [subcauseInputs, setSubcauseInputs] = useState<Record<string, string>>({});
  const [causeInputs, setCauseInputs] = useState<Record<string, string>>({});
  const [addingCauseTo, setAddingCauseTo] = useState<string | null>(null);
  const [addingSubcauseTo, setAddingSubcauseTo] = useState<string | null>(null);
  const [editingCauseId, setEditingCauseId] = useState<string | null>(null);
  const [editCauseText, setEditCauseText] = useState('');

  // Load example data on mount
  useEffect(() => {
    loadBookExample();
  }, []);

  const loadBookExample = () => {
    setEffect('Surface Defects on Finished Parts');
    setCategories([
      { id: 'man', name: 'Man', color: '#3b82f6', causes: [
        { id: 'c1', text: 'Skill level', subcauses: [{ id: 's1', text: 'Lack training' }, { id: 's2', text: 'New hires' }] },
        { id: 'c2', text: 'Fatigue', subcauses: [{ id: 's3', text: 'Long shifts' }] },
        { id: 'c3', text: 'Training', subcauses: [] },
        { id: 'c4', text: 'Operator error', subcauses: [{ id: 's4', text: 'Distraction' }, { id: 's5', text: 'Rushing' }] }
      ]},
      { id: 'machine', name: 'Machine', color: '#ef4444', causes: [
        { id: 'c5', text: 'Tool wear', subcauses: [{ id: 's6', text: 'Old blades' }] },
        { id: 'c6', text: 'Machine vibration', subcauses: [] },
        { id: 'c7', text: 'Calibration', subcauses: [{ id: 's7', text: 'Not checked' }] },
        { id: 'c8', text: 'Maintenance', subcauses: [{ id: 's8', text: 'Delayed' }] }
      ]},
      { id: 'material', name: 'Material', color: '#10b981', causes: [
        { id: 'c9', text: 'Raw material variation', subcauses: [] },
        { id: 'c10', text: 'Supplier quality', subcauses: [{ id: 's9', text: 'Different batch' }] },
        { id: 'c11', text: 'Moisture content', subcauses: [] }
      ]},
      { id: 'method', name: 'Method', color: '#f59e0b', causes: [
        { id: 'c12', text: 'Process parameters', subcauses: [{ id: 's10', text: 'Speed too high' }] },
        { id: 'c13', text: 'SOP not followed', subcauses: [] },
        { id: 'c14', text: 'Speed settings', subcauses: [] }
      ]},
      { id: 'measurement', name: 'Measurement', color: '#8b5cf6', causes: [
        { id: 'c15', text: 'Gauge accuracy', subcauses: [{ id: 's11', text: 'Need calibration' }] },
        { id: 'c16', text: 'Measurement technique', subcauses: [] },
        { id: 'c17', text: 'Sampling method', subcauses: [] }
      ]},
      { id: 'environment', name: 'Environment', color: '#06b6d4', causes: [
        { id: 'c18', text: 'Temperature', subcauses: [{ id: 's12', text: 'Too hot' }] },
        { id: 'c19', text: 'Humidity', subcauses: [] },
        { id: 'c20', text: 'Lighting', subcauses: [{ id: 's13', text: 'Poor visibility' }] }
      ]}
    ]);
  };

  const clearData = () => {
    setEffect('Surface Defects on Finished Parts');
    setCategories(DEFAULT_CATEGORIES.map(c => ({ ...c, causes: [] })));
  };

  // Add/remove categories
  const addCategory = () => {
    if (categories.length >= MAX_CATEGORIES || !newCategoryName.trim()) return;
    
    const colors = ['#ec4899', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#a855f7', '#eab308', '#0ea5e9'];
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      color: colors[categories.length % colors.length],
      causes: []
    };
    
    setIsAnimating(prev => ({ ...prev, [newCategory.id]: true }));
    setTimeout(() => {
      setIsAnimating(prev => ({ ...prev, [newCategory.id]: false }));
    }, 250);
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const removeCategory = (categoryId: string) => {
    if (categories.length <= MIN_CATEGORIES) return;
    
    setIsAnimating(prev => ({ ...prev, [categoryId]: true }));
    setTimeout(() => {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    }, 200);
  };

  // Add/remove causes
  const addCause = (categoryId: string) => {
    const text = causeInputs[categoryId]?.trim();
    if (!text) return;

    const newCause: Cause = {
      id: `c-${Date.now()}`,
      text,
      subcauses: []
    };

    setIsAnimating(prev => ({ ...prev, [newCause.id]: true }));
    setTimeout(() => {
      setIsAnimating(prev => ({ ...prev, [newCause.id]: false }));
    }, 250);

    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, causes: [...cat.causes, newCause] }
        : cat
    ));
    
    setCauseInputs(prev => ({ ...prev, [categoryId]: '' }));
    setAddingCauseTo(null);
  };

  const removeCause = (categoryId: string, causeId: string) => {
    setIsAnimating(prev => ({ ...prev, [causeId]: true }));
    setTimeout(() => {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, causes: cat.causes.filter(c => c.id !== causeId) }
          : cat
      ));
    }, 200);
  };

  const updateCause = (categoryId: string, causeId: string, newText: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, causes: cat.causes.map(c => c.id === causeId ? { ...c, text: newText } : c) }
        : cat
    ));
    setEditingCauseId(null);
  };

  const startEditCause = (cause: Cause) => {
    setEditingCauseId(cause.id);
    setEditCauseText(cause.text);
  };

  // Add/remove subcauses
  const addSubcause = (categoryId: string, causeId: string) => {
    const text = subcauseInputs[causeId]?.trim();
    if (!text) return;

    const cause = categories.find(c => c.id === categoryId)?.causes.find(c => c.id === causeId);
    if (cause && cause.subcauses.length >= MAX_SUBCAUSES) return;

    const newSubcause: Subcause = {
      id: `s-${Date.now()}`,
      text
    };

    setIsAnimating(prev => ({ ...prev, [newSubcause.id]: true }));
    setTimeout(() => {
      setIsAnimating(prev => ({ ...prev, [newSubcause.id]: false }));
    }, 250);

    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, causes: cat.causes.map(c => 
            c.id === causeId ? { ...c, subcauses: [...c.subcauses, newSubcause] } : c
          )}
        : cat
    ));
    
    setSubcauseInputs(prev => ({ ...prev, [causeId]: '' }));
    setAddingSubcauseTo(null);
  };

  const removeSubcause = (categoryId: string, causeId: string, subcauseId: string) => {
    setIsAnimating(prev => ({ ...prev, [subcauseId]: true }));
    setTimeout(() => {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, causes: cat.causes.map(c => 
              c.id === causeId ? { ...c, subcauses: c.subcauses.filter(s => s.id !== subcauseId) } : c
            )}
          : cat
      ));
    }, 200);
  };

  // Dynamic SVG layout calculation
  const svgLayout = useMemo(() => {
    const effectWidth = Math.max(180, Math.min(effect.length * 7 + 40, 260));
    const spineEndX = BASE_SVG_WIDTH - effectWidth - 30;
    const spineLength = spineEndX - SPINE_START_X;
    const categorySpacing = spineLength / (categories.length + 1);

    const ribs = categories.map((category, index) => {
      const spineX = SPINE_START_X + categorySpacing * (index + 1);
      const isTop = index % 2 === 0;
      const angle = isTop ? -130 : 130;
      const boneLength = BONE_LENGTH;

      const endX = spineX + Math.cos(angle * Math.PI / 180) * boneLength;
      const endY = SPINE_Y + Math.sin(angle * Math.PI / 180) * boneLength;

      const causeCount = category.causes.length;
      const availableSpace = boneLength - 65;
      const causeSpacing = causeCount > 0
        ? Math.max(28, availableSpace / Math.max(causeCount, 1))
        : 28;

      const fontSize = causeCount > 6
        ? Math.max(10, 13 - (causeCount - 6) * 0.4)
        : 12;

      return { category, spineX, endX, endY, angle, isTop, causeSpacing, fontSize, boneLength };
    });

    return { effectWidth, spineEndX, ribs };
  }, [categories, effect]);

  const totalCauses = categories.reduce((sum, cat) => sum + cat.causes.length, 0);
  const totalSubcauses = categories.reduce((sum, cat) => 
    sum + cat.causes.reduce((s, c) => s + c.subcauses.length, 0), 0);

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="02"
          title="CAUSE & EFFECT DIAGRAM"
          subtitle="Systematically identify and display all possible causes using dynamic Ishikawa fishbone analysis"
        />

        {/* Top section: config + categories side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', padding: '24px 48px 0' }}>
          {/* Left: Effect + controls */}
          <div>
              {/* Effect + Controls */}
              <div className="card">
                <h3 className="heading-small mb-4">Diagram Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-small font-bold mb-2">
                  Effect (Problem Statement)
                </label>
                {editingEffect ? (
                  <input
                    type="text"
                    value={effect}
                    onChange={(e) => setEffect(e.target.value)}
                    onBlur={() => setEditingEffect(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingEffect(false)}
                    className="input"
                    autoFocus
                  />
                ) : (
                  <div 
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer"
                    onClick={() => setEditingEffect(true)}
                  >
                    <span className="text-body font-medium">{effect}</span>
                    <Edit2 className="w-4 h-4 text-yellow-600" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={loadBookExample} className="btn-primary" style={{ fontSize: '13px', padding: '8px 14px' }}>
                  <Upload className="w-3 h-3 mr-2" />
                  Load Example
                </button>
                <button onClick={clearData} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}>
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right: Categories + causes list */}
          <div className="card" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="heading-small mb-0">Categories ({categories.length}/{MAX_CATEGORIES})</h3>
              {categories.length < MAX_CATEGORIES && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category..."
                    className="input text-small"
                    style={{ width: '130px', padding: '6px 10px' }}
                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <button onClick={addCategory} className="btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-2" style={{ borderLeft: `3px solid ${category.color}` }}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-small font-bold">{category.name}</span>
                      <span className="text-xs text-muted">({category.causes.length} causes)</span>
                    </div>
                    {categories.length > MIN_CATEGORIES && (
                      <button onClick={() => removeCategory(category.id)} className="p-0.5 hover:bg-red-50 rounded">
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 ml-4">
                    {category.causes.map((cause) => (
                      <span key={cause.id} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-50 rounded border group">
                        {editingCauseId === cause.id ? (
                          <input
                            type="text"
                            value={editCauseText}
                            onChange={(e) => setEditCauseText(e.target.value)}
                            onBlur={() => updateCause(category.id, cause.id, editCauseText)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') updateCause(category.id, cause.id, editCauseText);
                              if (e.key === 'Escape') setEditingCauseId(null);
                            }}
                            className="input text-xs" style={{ padding: '2px 4px', width: '100px' }}
                            autoFocus
                          />
                        ) : (
                          <span onClick={() => startEditCause(cause)} style={{ cursor: 'pointer' }}>{cause.text}</span>
                        )}
                        <button onClick={() => removeCause(category.id, cause.id)} className="opacity-0 group-hover:opacity-100">
                          <X className="w-2.5 h-2.5 text-red-400" />
                        </button>
                      </span>
                    ))}
                    {addingCauseTo === category.id ? (
                      <span className="flex items-center gap-1">
                        <input
                          type="text"
                          value={causeInputs[category.id] || ''}
                          onChange={(e) => setCauseInputs(prev => ({ ...prev, [category.id]: e.target.value }))}
                          placeholder="Add cause..."
                          className="input text-xs" style={{ padding: '2px 6px', width: '110px' }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addCause(category.id);
                            if (e.key === 'Escape') setAddingCauseTo(null);
                          }}
                        />
                        <button onClick={() => addCause(category.id)} className="btn-primary" style={{ padding: '2px 6px', fontSize: '11px' }}>+</button>
                        <button onClick={() => setAddingCauseTo(null)} className="btn-ghost" style={{ padding: '2px 6px', fontSize: '11px' }}>✕</button>
                      </span>
                    ) : (
                      <button onClick={() => setAddingCauseTo(category.id)} className="text-xs px-2 py-0.5 bg-yellow-50 rounded border border-yellow-200 hover:bg-yellow-100">
                        + Add cause
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width Fishbone Diagram */}
        <div style={{ padding: '0 48px 24px' }}>
            <div className="card" id="fishbone-chart" style={{ overflow: 'hidden' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-small">Fishbone Diagram</h3>
                <ExportButton
                  chartData={{
                    elementId: 'fishbone-chart',
                    title: 'Fishbone Diagram Analysis',
                    description: `Ishikawa diagram showing ${totalCauses} causes with ${totalSubcauses} subcauses`
                  }}
                  dataExport={{
                    data: categories.flatMap(cat => 
                      cat.causes.map(cause => ({
                        category: cat.name,
                        cause: cause.text,
                        subcauses: cause.subcauses.map(s => s.text).join('; ')
                      }))
                    ),
                    headers: ['category', 'cause', 'subcauses'],
                    sheetName: 'Fishbone Data'
                  }}
                  reportData={{
                    title: 'Cause & Effect (Fishbone) Diagram Report',
                    toolName: 'Cause & Effect Diagram — Tool 02 of the 7 QC Tools',
                    date: new Date().toLocaleDateString(),
                    data: {
                      sections: [
                        {
                          heading: 'Problem Statement (Effect)',
                          text: effect
                        },
                        {
                          heading: 'Analysis Overview',
                          stats: {
                            'Effect / Problem': effect.substring(0, 30),
                            'Categories Analysed': categories.length,
                            'Total Causes': totalCauses,
                            'Total Subcauses': totalSubcauses,
                            'Most Causes In': (() => {
                              const max = categories.reduce((m, c) => c.causes.length > m.causes.length ? c : m, categories[0]);
                              return `${max?.name} (${max?.causes.length})`;
                            })()
                          }
                        },
                        {
                          heading: 'Category Summary',
                          table: {
                            headers: ['Category', 'Causes', 'Subcauses', 'Total Factors'],
                            rows: categories.map(c => [
                              c.name,
                              c.causes.length,
                              c.causes.reduce((s, cause) => s + cause.subcauses.length, 0),
                              c.causes.length + c.causes.reduce((s, cause) => s + cause.subcauses.length, 0)
                            ])
                          }
                        },
                        ...categories.filter(c => c.causes.length > 0).map(c => ({
                          heading: `${c.name} — Causes & Subcauses`,
                          list: c.causes.map(cause =>
                            cause.subcauses.length > 0
                              ? `${cause.text} > ${cause.subcauses.map(s => s.text).join(', ')}`
                              : cause.text
                          )
                        })),
                        {
                          heading: "Ishikawa's Methodology",
                          text: "The cause closest to the effect on the diagram is not necessarily the root cause. Trace back through the bones to find the true root cause. Subcauses help drill down into specific contributing factors. Use data (Check Sheets, Pareto) to determine which subcauses have the highest impact."
                        }
                      ]
                    },
                    charts: [{
                      elementId: 'fishbone-chart',
                      title: 'Cause & Effect Diagram',
                      description: `Ishikawa fishbone diagram — ${categories.length} categories, ${totalCauses} causes, ${totalSubcauses} subcauses for: "${effect}"`
                    }],
                    summary: `Fishbone analysis for "${effect}" identifies ${totalCauses} potential root causes with ${totalSubcauses} subcauses across ${categories.length} categories (${categories.map(c => `${c.name}: ${c.causes.length}`).join(', ')}).`,
                    recommendations: [
                      `Investigate the highest-density categories first (${categories.slice().sort((a,b) => b.causes.length - a.causes.length)[0]?.name} has the most causes)`,
                      'Use Check Sheets to quantify the frequency of each identified cause',
                      'Create a Pareto Chart to rank causes by their actual impact / cost',
                      'Drill down into the top 3 causes using the "5 Whys" technique',
                      'Develop targeted corrective action plans for confirmed root causes'
                    ]
                  }}
                />
              </div>

              <div className="w-full">
                <svg
                  viewBox={`0 0 ${BASE_SVG_WIDTH} ${BASE_SVG_HEIGHT}`}
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                >
                  <line 
                    x1={SPINE_START_X} 
                    y1={SPINE_Y} 
                    x2={svgLayout.spineEndX} 
                    y2={SPINE_Y} 
                    stroke="#1a1a1a" 
                    strokeWidth="3" 
                  />
                  
                  {/* Arrow tip pointing right into the effect box */}
                  <polygon
                    points={`${svgLayout.spineEndX},${SPINE_Y - 6} ${svgLayout.spineEndX},${SPINE_Y + 6} ${svgLayout.spineEndX + 12},${SPINE_Y}`}
                    fill="#1a1a1a"
                  />

                  {/* Effect box on the RIGHT side */}
                  <rect
                    x={svgLayout.spineEndX + 10}
                    y={SPINE_Y - 35}
                    width={svgLayout.effectWidth}
                    height={70}
                    fill="#ffd559"
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    rx="4"
                  />
                  <text
                    x={svgLayout.spineEndX + 10 + svgLayout.effectWidth / 2}
                    y={SPINE_Y - 12}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="bold"
                    fill="#1a1a1a"
                  >
                    EFFECT
                  </text>
                  <text
                    x={svgLayout.spineEndX + 10 + svgLayout.effectWidth / 2}
                    y={SPINE_Y + 15}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#1a1a1a"
                  >
                    {effect.length > 30 ? effect.substring(0, 30) + '...' : effect}
                  </text>
                  
                  {svgLayout.ribs.map((rib) => {
                    const boxWidth = Math.max(100, rib.category.name.length * 9 + 20);
                    const boxHeight = 32;
                    
                    return (
                    <g key={rib.category.id}>
                      {/* Main angled rib line */}
                      <line 
                        x1={rib.spineX} 
                        y1={SPINE_Y} 
                        x2={rib.endX} 
                        y2={rib.endY} 
                        stroke={rib.category.color} 
                        strokeWidth="3" 
                        className="transition-all duration-300"
                      />
                      
                      {/* Small cross lines at rib end (fishbone detail) */}
                      <line 
                        x1={rib.endX - 10} 
                        y1={rib.endY - 6} 
                        x2={rib.endX + 10} 
                        y2={rib.endY - 6} 
                        stroke={rib.category.color} 
                        strokeWidth="2.5" 
                      />
                      <line 
                        x1={rib.endX - 10} 
                        y1={rib.endY + 6} 
                        x2={rib.endX + 10} 
                        y2={rib.endY + 6} 
                        stroke={rib.category.color} 
                        strokeWidth="2.5" 
                      />
                      
                      {/* Category box at end of rib */}
                      <rect
                        x={rib.isTop ? rib.endX - boxWidth/2 : rib.endX - boxWidth/2}
                        y={rib.isTop ? rib.endY - boxHeight - 15 : rib.endY + 15}
                        width={boxWidth}
                        height={boxHeight}
                        fill={rib.category.color}
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                        rx="4"
                      />
                      <text
                        x={rib.isTop ? rib.endX : rib.endX}
                        y={rib.isTop ? rib.endY - boxHeight/2 - 15 : rib.endY + boxHeight/2 + 15}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="13"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        {rib.category.name}
                      </text>
                      
                                      {/* Causes — small perpendicular branch, text to the LEFT */}
                      {rib.category.causes.map((cause, causeIndex) => {
                        const distanceFromSpine = 55 + causeIndex * rib.causeSpacing;
                        const t = distanceFromSpine / rib.boneLength;
                        const jx = rib.spineX + (rib.endX - rib.spineX) * t;
                        const jy = SPINE_Y + (rib.endY - SPINE_Y) * t;

                        // Perpendicular direction away from rib (for branch)
                        const ribNormX = (rib.endX - rib.spineX) / rib.boneLength;
                        const ribNormY = (rib.endY - SPINE_Y) / rib.boneLength;
                        // Rotate 90° outward: for top → points away from spine upward
                        const perpX = rib.isTop ? -ribNormY : ribNormY;
                        const perpY = rib.isTop ? ribNormX : -ribNormX;

                        const branchLen = 28;
                        const bx = jx + perpX * branchLen;
                        const by = jy + perpY * branchLen;

                        // Text: at branch tip extended LEFT in rib direction so it reads left-of-branch
                        const textOffsetLen = 6;
                        const tx = bx + ribNormX * textOffsetLen;
                        const ty = by + perpY * 3;

                        return (
                          <g key={cause.id} className={`transition-all duration-300 ${isAnimating[cause.id] ? 'opacity-0' : 'opacity-100'}`}>
                            {/* Perpendicular branch line */}
                            <line x1={jx} y1={jy} x2={bx} y2={by}
                              stroke={rib.category.color} strokeWidth="1.5" />
                            {/* Small dot at junction */}
                            <circle cx={jx} cy={jy} r="2.2" fill={rib.category.color} />
                            {/* Cause text to the LEFT of branch tip */}
                            <text
                              x={tx} y={ty}
                              textAnchor="end"
                              dominantBaseline={rib.isTop ? 'auto' : 'hanging'}
                              fontSize={rib.fontSize}
                              fill="#1a1a1a"
                              fontWeight="500"
                            >
                              {cause.text.length > 20 ? cause.text.substring(0, 20) + '…' : cause.text}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                    );
                  })}
                </svg>
              </div>
            </div>
        </div>

        {/* Interpretation */}
        <div className="interpretation-panel card-featured">
          <h3 className="heading-medium mb-4">Interpretation & Analysis</h3>
          <div className="text-body text-muted">
            <div className="grid-3 gap-4 mb-6">
              {categories.map((category) => (
                <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-small font-bold mb-2" style={{ color: category.color }}>{category.name}</div>
                  <div className="text-2xl font-bold mb-1">{category.causes.length}</div>
                  <div className="text-xs text-muted">causes · {category.causes.reduce((s, c) => s + c.subcauses.length, 0)} subcauses</div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="heading-small mb-2">Ishikawa's Methodology</h4>
              <p className="text-small mb-2">
                "The cause closest to the effect on the diagram is not necessarily the root cause.
                Trace back through the bones to find the true root cause."
              </p>
              <p className="text-small">
                "Subcauses help drill down into specific contributing factors.
                Use data (Check Sheets, Pareto) to determine which subcauses have the highest impact."
              </p>
            </div>
          </div>
        </div>

        {/* Course Promotion */}
        <KaizenPromo />
      </div>
    </div>
  );
}
