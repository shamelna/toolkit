import React, { useState, useEffect, useMemo } from 'react';
import { GitBranch, Plus, Download, RotateCcw, Upload, Edit2, Trash2, X } from 'lucide-react';
import ExportButton from './ExportButton';
import ToolHeader from './ToolHeader';

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
const SPINE_START_X = 820; // Start from right side
const SPINE_Y = 250;
const BASE_SVG_HEIGHT = 500;
const BASE_SVG_WIDTH = 900;

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

  // Dynamic SVG layout calculation - FISHBONE EXTENDING TO LEFT
  const svgLayout = useMemo(() => {
    const maxCausesInCategory = Math.max(...categories.map(c => c.causes.length), 1);
    const requiredHeight = Math.max(BASE_SVG_HEIGHT, 300 + maxCausesInCategory * 35);
    
    const effectWidth = Math.max(200, effect.length * 6 + 60);
    const spineEndX = effectWidth + 40; // End on left side
    
    const spineLength = SPINE_START_X - spineEndX; // Spine extends left
    const categorySpacing = spineLength / (categories.length + 1);
    
    const ribs = categories.map((category, index) => {
      const spineX = SPINE_START_X - categorySpacing * (index + 1); // Categories go left
      const isTop = index % 2 === 0;
      // Angles adjusted for leftward extension
      const angle = isTop ? -130 : 130; // Angles pointing left
      const boneLength = 180;
      
      const endX = spineX + Math.cos(angle * Math.PI / 180) * boneLength;
      const endY = SPINE_Y + Math.sin(angle * Math.PI / 180) * boneLength;
      
      const causeCount = category.causes.length;
      // Calculate spacing along the rib for causes
      const availableSpace = boneLength - 60; // Leave room for category box
      const causeSpacing = causeCount > 0 
        ? Math.max(25, availableSpace / Math.max(causeCount, 1))
        : 25;
      
      // Font size scales down if too many causes
      const fontSize = causeCount > 6 
        ? Math.max(10, 13 - (causeCount - 6) * 0.5)
        : 13;
      
      return {
        category,
        spineX,
        endX,
        endY,
        angle,
        isTop,
        causeSpacing,
        fontSize,
        boneLength
      };
    });
    
    return { requiredHeight, effectWidth, spineEndX, ribs };
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
          subtitle="Systematically identify and display all possible causes with subcauses using dynamic Ishikawa fishbone analysis"
        />

        <div className="tool-body">
          <div className="grid-2" style={{ gap: '30px' }}>
            {/* Left Column - Instructions and Input */}
            <div>
              {/* Instructions */}
              <div className="card mb-6">
                <h4 className="heading-small mb-3" style={{ color: '#1a1a1a' }}>🐟 How to Use Fishbone Diagram</h4>
                <div className="space-y-3">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>1</span>
                    <span className="text-small" style={{ color: '#666' }}>Define the effect (problem) and add 4-8 category bones</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>2</span>
                    <span className="text-small" style={{ color: '#666' }}>Add potential causes; click [+] to add subcauses</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>3</span>
                    <span className="text-small" style={{ color: '#666' }}>Identify vital few causes using Pareto principle</span>
                  </div>
                </div>
                <div className="mt-4">
                  <button onClick={loadBookExample} className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                    <Upload className="w-3 h-3 mr-2" />
                    Try Example
                  </button>
                </div>
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

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="heading-small">Categories ({categories.length}/{MAX_CATEGORIES})</h3>
                  {categories.length < MAX_CATEGORIES && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category..."
                        className="input text-small"
                        style={{ width: '140px' }}
                        onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                      />
                      <button 
                        onClick={addCategory}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`border rounded-lg p-3 transition-all duration-200 ${
                        isAnimating[category.id] ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                      style={{ borderLeft: `4px solid ${category.color}` }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: category.color }} />
                          <span className="text-small font-bold">{category.name}</span>
                          <span className="text-xs text-muted">
                            ({category.causes.length} causes, {category.causes.reduce((s, c) => s + c.subcauses.length, 0)} subcauses)
                          </span>
                        </div>
                        {categories.length > MIN_CATEGORIES && (
                          <button
                            onClick={() => removeCategory(category.id)}
                            className="p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1 ml-4">
                        {category.causes.map((cause) => (
                          <div 
                            key={cause.id}
                            className={`transition-all duration-200 ${
                              isAnimating[cause.id] ? 'opacity-0 translate-x-[-10px]' : 'opacity-100 translate-x-0'
                            }`}
                          >
                            <div className="flex items-center justify-between py-1 group">
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
                                  className="input text-small"
                                  autoFocus
                                />
                              ) : (
                                <span className="text-small">{cause.text}</span>
                              )}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditCause(cause)}
                                  className="p-1 hover:bg-yellow-50 rounded"
                                >
                                  <Edit2 className="w-3 h-3 text-yellow-600" />
                                </button>
                                {cause.subcauses.length < MAX_SUBCAUSES && (
                                  <button
                                    onClick={() => setAddingSubcauseTo(cause.id)}
                                    className="p-1 hover:bg-blue-50 rounded"
                                    title="Add subcause"
                                  >
                                    <Plus className="w-3 h-3 text-blue-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() => removeCause(category.id, cause.id)}
                                  className="p-1 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </button>
                              </div>
                            </div>

                            {cause.subcauses.length > 0 && (
                              <div className="ml-4 pl-2 border-l-2 border-gray-200 space-y-1">
                                {cause.subcauses.map((subcause) => (
                                  <div 
                                    key={subcause.id}
                                    className={`flex items-center justify-between py-0.5 transition-all duration-200 ${
                                      isAnimating[subcause.id] ? 'opacity-0 translate-x-[-10px]' : 'opacity-100 translate-x-0'
                                    }`}
                                  >
                                    <span className="text-xs text-muted">↳ {subcause.text}</span>
                                    <button
                                      onClick={() => removeSubcause(category.id, cause.id, subcause.id)}
                                      className="p-0.5 hover:bg-red-50 rounded opacity-0 hover:opacity-100"
                                    >
                                      <X className="w-3 h-3 text-red-400" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {addingSubcauseTo === cause.id && (
                              <div className="ml-4 mt-1 flex gap-1 animate-fade-in">
                                <input
                                  type="text"
                                  value={subcauseInputs[cause.id] || ''}
                                  onChange={(e) => setSubcauseInputs(prev => ({ ...prev, [cause.id]: e.target.value }))}
                                  placeholder="Subcause..."
                                  className="input text-xs"
                                  style={{ padding: '4px 8px' }}
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') addSubcause(category.id, cause.id);
                                    if (e.key === 'Escape') setAddingSubcauseTo(null);
                                  }}
                                />
                                <button
                                  onClick={() => addSubcause(category.id, cause.id)}
                                  className="btn-primary"
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => setAddingSubcauseTo(null)}
                                  className="btn-ghost"
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {addingCauseTo === category.id ? (
                        <div className="mt-3 flex gap-2 animate-fade-in">
                          <input
                            type="text"
                            value={causeInputs[category.id] || ''}
                            onChange={(e) => setCauseInputs(prev => ({ ...prev, [category.id]: e.target.value }))}
                            placeholder="Enter cause..."
                            className="input text-small"
                            style={{ flex: 1 }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') addCause(category.id);
                              if (e.key === 'Escape') setAddingCauseTo(null);
                            }}
                          />
                          <button
                            onClick={() => addCause(category.id)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setAddingCauseTo(null)}
                            className="btn-ghost"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingCauseTo(category.id)}
                          className="mt-3 w-full text-center py-2 text-small text-muted hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add Cause
                        </button>
                      )}
                    </div>
                  ))}
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
          </div>

          <div className="chart-panel">
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
                    title: 'Fishbone (Ishikawa) Diagram Analysis Report',
                    toolName: 'Fishbone Diagram',
                    date: new Date().toLocaleDateString(),
                    data: {
                      effect,
                      totalCauses,
                      totalSubcauses,
                      categories: categories.map(c => ({
                        name: c.name,
                        causeCount: c.causes.length,
                        subcauseCount: c.causes.reduce((s, cause) => s + cause.subcauses.length, 0),
                        causes: c.causes.map(cause => ({
                          text: cause.text,
                          subcauses: cause.subcauses.map(s => s.text)
                        }))
                      }))
                    },
                    charts: [{
                      elementId: 'fishbone-chart',
                      title: 'Fishbone Diagram',
                      description: `Dynamic Ishikawa diagram with ${categories.length} categories`
                    }],
                    summary: `Fishbone analysis identifies ${totalCauses} potential root causes with ${totalSubcauses} detailed subcauses for "${effect}" across ${categories.length} main categories.`,
                    recommendations: [
                      'Investigate high-density cause categories first',
                      'Use Check Sheets to quantify subcause frequency',
                      'Create Pareto charts for priority subcauses',
                      'Develop targeted action plans for top 3 root causes'
                    ]
                  }}
                />
              </div>
              
              <div 
                className="bg-white rounded-lg transition-all duration-300"
                style={{ 
                  minHeight: `${svgLayout.requiredHeight}px`,
                  aspectRatio: `${BASE_SVG_WIDTH} / ${svgLayout.requiredHeight}`
                }}
              >
                <svg 
                  viewBox={`0 0 ${BASE_SVG_WIDTH} ${svgLayout.requiredHeight}`}
                  className="w-full h-full"
                  style={{ display: 'block' }}
                >
                  <line 
                    x1={SPINE_START_X} 
                    y1={SPINE_Y} 
                    x2={svgLayout.spineEndX} 
                    y2={SPINE_Y} 
                    stroke="#1a1a1a" 
                    strokeWidth="3" 
                  />
                  
                  <polygon 
                    points={`${svgLayout.spineEndX},${SPINE_Y} ${svgLayout.spineEndX + 10},${SPINE_Y - 5} ${svgLayout.spineEndX + 10},${SPINE_Y + 5}`} 
                    fill="#1a1a1a" 
                  />
                  
                  <rect 
                    x={svgLayout.spineEndX - svgLayout.effectWidth - 10} 
                    y={SPINE_Y - 35} 
                    width={svgLayout.effectWidth} 
                    height={70} 
                    fill="#ffd559" 
                    stroke="#1a1a1a" 
                    strokeWidth="2" 
                    rx="4" 
                  />
                  <text 
                    x={svgLayout.spineEndX - svgLayout.effectWidth / 2 - 10} 
                    y={SPINE_Y - 12} 
                    textAnchor="middle" 
                    fontSize="13" 
                    fontWeight="bold" 
                    fill="#1a1a1a"
                  >
                    EFFECT
                  </text>
                  <text 
                    x={svgLayout.spineEndX - svgLayout.effectWidth / 2 - 10} 
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
                      
                      {/* Causes written along the rib */}
                      {rib.category.causes.map((cause, causeIndex) => {
                        // Position causes along the rib from spine toward the end
                        const distanceFromSpine = 50 + causeIndex * rib.causeSpacing;
                        const t = distanceFromSpine / rib.boneLength;
                        const causeX = rib.spineX + (rib.endX - rib.spineX) * t;
                        const causeY = SPINE_Y + (rib.endY - SPINE_Y) * t;
                        
                        // Offset text slightly perpendicular to rib for readability
                        const perpAngle = rib.angle + 90;
                        const textOffset = 12;
                        const textX = causeX + Math.cos(perpAngle * Math.PI / 180) * textOffset;
                        const textY = causeY + Math.sin(perpAngle * Math.PI / 180) * textOffset;
                        
                        return (
                          <g 
                            key={cause.id}
                            className={`transition-all duration-300 ${
                              isAnimating[cause.id] ? 'opacity-0' : 'opacity-100'
                            }`}
                          >
                            {/* Small tick mark on rib for each cause */}
                            <line
                              x1={causeX - 5}
                              y1={causeY - 3}
                              x2={causeX + 5}
                              y2={causeY + 3}
                              stroke={rib.category.color}
                              strokeWidth="1.5"
                            />
                            
                            {/* Cause text - horizontal and readable */}
                            <text 
                              x={textX} 
                              y={textY} 
                              textAnchor={rib.isTop ? "start" : "start"}
                              fontSize={rib.fontSize} 
                              fill="#333"
                              fontWeight="500"
                            >
                              {cause.text.length > 25 ? cause.text.substring(0, 25) + '...' : cause.text}
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
        </div>

        <div className="interpretation-panel card-featured">
          <h3 className="heading-medium mb-4">Interpretation & Analysis</h3>
          <div className="text-body text-muted">
            <div className="grid-3 gap-4 mb-6">
              {categories.map((category) => (
                <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-small font-bold mb-2" style={{ color: category.color }}>
                    {category.name}
                  </div>
                  <div className="text-2xl font-bold mb-1">{category.causes.length}</div>
                  <div className="text-xs text-muted">causes</div>
                  <div className="text-sm text-muted mt-1">
                    {category.causes.reduce((s, c) => s + c.subcauses.length, 0)} subcauses
                  </div>
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
                "Subcauses help drill down into specific contributing factors. 
                Use data to determine which subcauses have the highest impact."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
