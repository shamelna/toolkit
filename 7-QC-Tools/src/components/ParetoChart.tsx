import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Download, RotateCcw, Upload, DollarSign } from 'lucide-react';
import ToolHeader from './ToolHeader';
import ExportButton from './ExportButton';
import KaizenPromo from './KaizenPromo';

interface ParetoData {
  defects: Array<{
    type: string;
    count: number;
    cost?: number;
  }>;
}

interface ParetoResult {
  sortedData: Array<{
    type: string;
    count: number;
    cost?: number;
    percentage: number;
    cumulativeCount: number;
    cumulativePercentage: number;
  }>;
  total: number;
  totalCost?: number;
  vitalFew: string[];
  trivialMany: string[];
}

export default function ParetoChart() {
  const [data, setData] = useState<ParetoData>({
    defects: [
      { type: 'Misaligned Parts', count: 400 },
      { type: 'Surface Scratches', count: 290 },
      { type: 'Dimensional Errors', count: 130 },
      { type: 'Voids', count: 90 },
      { type: 'Cracks', count: 50 },
      { type: 'Other', count: 40 }
    ]
  });

  const [result, setResult] = useState<ParetoResult | null>(null);
  const [useCost, setUseCost] = useState(false);
  const [newDefectType, setNewDefectType] = useState('');
  const [newDefectCount, setNewDefectCount] = useState('');
  const [newDefectCost, setNewDefectCost] = useState('');

  const loadBookExample = () => {
    const bookData: ParetoData = {
      defects: [
        { type: 'Misaligned Parts', count: 400, cost: 12.50 },
        { type: 'Surface Scratches', count: 290, cost: 8.75 },
        { type: 'Dimensional Errors', count: 130, cost: 25.00 },
        { type: 'Voids', count: 90, cost: 15.00 },
        { type: 'Cracks', count: 50, cost: 45.00 },
        { type: 'Other', count: 40, cost: 5.00 }
      ]
    };
    setData(bookData);
    setUseCost(true);
  };

  const clearData = () => {
    setData({ defects: [] });
    setResult(null);
    setNewDefectType('');
    setNewDefectCount('');
    setNewDefectCost('');
  };

  const addDefect = () => {
    if (newDefectType.trim() && newDefectCount) {
      const count = parseInt(newDefectCount) || 0;
      const cost = newDefectCost ? parseFloat(newDefectCost) : undefined;
      
      setData(prev => ({
        defects: [...prev.defects, {
          type: newDefectType.trim(),
          count,
          cost
        }]
      }));
      
      setNewDefectType('');
      setNewDefectCount('');
      setNewDefectCost('');
    }
  };

  const updateDefect = (index: number, field: 'type' | 'count' | 'cost', value: string) => {
    setData(prev => ({
      defects: prev.defects.map((defect, i) => {
        if (i === index) {
          if (field === 'type') return { ...defect, type: value };
          if (field === 'count') return { ...defect, count: parseInt(value) || 0 };
          if (field === 'cost') return { ...defect, cost: value ? parseFloat(value) : undefined };
        }
        return defect;
      })
    }));
  };

  const deleteDefect = (index: number) => {
    setData(prev => ({
      defects: prev.defects.filter((_, i) => i !== index)
    }));
  };

  const calculatePareto = () => {
    if (data.defects.length === 0) return;

    // Sort defects by count (or cost if useCost is true)
    const sorted = [...data.defects].sort((a, b) => {
      const aValue = useCost && a.cost ? a.count * a.cost : a.count;
      const bValue = useCost && b.cost ? b.count * b.cost : b.count;
      return bValue - aValue;
    });

    // Calculate cumulative values
    const total = sorted.reduce((sum, defect) => {
      return sum + (useCost && defect.cost ? defect.count * defect.cost : defect.count);
    }, 0);

    let cumulativeCount = 0;
    const sortedData = sorted.map(defect => {
      const value = useCost && defect.cost ? defect.count * defect.cost : defect.count;
      cumulativeCount += value;
      const percentage = (value / total) * 100;
      const cumulativePercentage = (cumulativeCount / total) * 100;
      
      return {
        ...defect,
        percentage,
        cumulativeCount,
        cumulativePercentage
      };
    });

    // Identify vital few (approximately 80%)
    const vitalFew = sortedData
      .filter(item => item.cumulativePercentage <= 80)
      .map(item => item.type);

    const trivialMany = sortedData
      .filter(item => item.cumulativePercentage > 80)
      .map(item => item.type);

    setResult({
      sortedData,
      total,
      totalCost: useCost ? total : undefined,
      vitalFew,
      trivialMany
    });
  };

  useEffect(() => {
    calculatePareto();
  }, [data, useCost]);

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="04"
          title="PARETO DIAGRAM"
          subtitle='Identify the "vital few" causes responsible for the majority of problems based on the 80/20 principle'
        />

        <div className="tool-body">
          {/* Input Panel */}
          <div className="input-panel">
            <div className="card">
              <h2 className="heading-medium mb-4">Defect Data</h2>
              
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCost}
                    onChange={(e) => setUseCost(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-small font-medium">Use Cost Analysis</span>
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </label>
              </div>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={newDefectType}
                  onChange={(e) => setNewDefectType(e.target.value)}
                  placeholder="Defect type..."
                  className="input"
                />
                <input
                  type="number"
                  value={newDefectCount}
                  onChange={(e) => setNewDefectCount(e.target.value)}
                  placeholder="Count..."
                  className="input"
                  min="0"
                />
                {useCost && (
                  <input
                    type="number"
                    value={newDefectCost}
                    onChange={(e) => setNewDefectCost(e.target.value)}
                    placeholder="Cost per unit..."
                    className="input"
                    min="0"
                    step="0.01"
                  />
                )}
                <button onClick={addDefect} className="btn-primary">
                  Add Defect
                </button>
              </div>

              <div className="flex gap-3 mb-6">
                <button onClick={loadBookExample} className="btn-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Load Book Example
                </button>
                <button onClick={clearData} className="btn-ghost">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Data
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="heading-small">Current Defects</h3>
                {data.defects.map((defect, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <input
                      type="text"
                      value={defect.type}
                      onChange={(e) => updateDefect(index, 'type', e.target.value)}
                      className="flex-1 input text-small"
                    />
                    <input
                      type="number"
                      value={defect.count}
                      onChange={(e) => updateDefect(index, 'count', e.target.value)}
                      className="w-20 input text-small"
                      min="0"
                    />
                    {useCost && (
                      <input
                        type="number"
                        value={defect.cost || ''}
                        onChange={(e) => updateDefect(index, 'cost', e.target.value)}
                        className="w-20 input text-small"
                        min="0"
                        step="0.01"
                        placeholder="Cost"
                      />
                    )}
                    <button
                      onClick={() => deleteDefect(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="chart-panel">
            {result ? (
              <>
                <div className="card" id="pareto-chart">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="heading-small mb-0">
                      Pareto Analysis {useCost ? '(by Cost)' : '(by Count)'}
                    </h3>
                    <ExportButton
                      chartData={{
                        elementId: 'pareto-chart',
                        title: 'Pareto Chart',
                        description: `Pareto analysis — ${result.vitalFew.length} vital few defects account for ~80% of ${useCost ? 'cost' : 'count'}`
                      }}
                      dataExport={{
                        data: result.sortedData.map((item, i) => ({
                          Rank: i + 1,
                          'Defect Type': item.type,
                          Count: item.count,
                          ...(useCost ? { 'Cost/Unit': item.cost, 'Total Cost': item.cost ? (item.count * item.cost).toFixed(2) : 0 } : {}),
                          '%': item.percentage.toFixed(1) + '%',
                          'Cumulative %': item.cumulativePercentage.toFixed(1) + '%',
                          Category: item.cumulativePercentage <= 80 ? 'Vital Few' : 'Trivial Many'
                        })),
                        sheetName: 'Pareto Data'
                      }}
                      reportData={{
                        title: 'Pareto Diagram Analysis Report',
                        toolName: 'Pareto Diagram — Tool 04 of the 7 QC Tools',
                        date: new Date().toLocaleDateString(),
                        data: {
                          sections: [
                            {
                              heading: 'Analysis Overview',
                              stats: {
                                'Analysis Mode': useCost ? 'Cost-Based Analysis' : 'Count-Based Analysis',
                                'Total Defect Types': data.defects.length,
                                'Total Count': result.total,
                                ...(useCost && result.totalCost ? { 'Total Cost ($)': '$' + result.totalCost.toFixed(2) } : {}),
                                'Vital Few Count': result.vitalFew.length,
                                'Trivial Many Count': result.trivialMany.length,
                              }
                            },
                            {
                              heading: 'Vital Few (≈80% of Problems)',
                              list: result.vitalFew.map(name => {
                                const item = result.sortedData.find(d => d.type === name);
                                return item ? `${name} — ${item.count} occurrences (${item.percentage.toFixed(1)}%)${useCost && item.cost ? `, $${(item.count * item.cost).toFixed(2)} cost` : ''}` : name;
                              })
                            },
                            {
                              heading: 'Pareto Data Table',
                              table: {
                                headers: ['Rank', 'Defect', 'Count', '% Share', 'Cum. %', 'Category'],
                                rows: result.sortedData.map((item, i) => [
                                  i + 1,
                                  item.type.substring(0, 18),
                                  item.count,
                                  item.percentage.toFixed(1) + '%',
                                  item.cumulativePercentage.toFixed(1) + '%',
                                  item.cumulativePercentage <= 80 ? 'Vital Few' : 'Trivial Many'
                                ])
                              }
                            },
                            {
                              heading: "Ishikawa's 80/20 Principle",
                              text: "The Pareto principle states that roughly 80% of effects come from 20% of causes. In quality control, this means a few defect types cause most of the problems. 'Try to have the vertical axis represent amounts of money (cost of defects), not just count — this better prioritises economic impact.' — Dr. Kaoru Ishikawa"
                            },
                            ...(result.trivialMany.length > 0 ? [{
                              heading: 'Trivial Many (Remaining ~20%)',
                              list: result.trivialMany
                            }] : [])
                          ]
                        },
                        charts: [{
                          elementId: 'pareto-chart',
                          title: 'Pareto Chart',
                          description: `Pareto diagram — ${result.vitalFew.join(', ')} are the vital few`
                        }],
                        summary: `Pareto analysis of ${data.defects.length} defect types. Vital few: ${result.vitalFew.join(', ')} account for ~80% of ${useCost ? 'cost' : 'defects'}. Total: ${result.total}${useCost && result.totalCost ? ` ($${result.totalCost.toFixed(2)})` : ''}.`,
                        recommendations: [
                          `Focus improvement efforts on vital few: ${result.vitalFew.join(', ')}`,
                          'Use Fishbone (Cause & Effect) diagram to identify root causes of each vital defect',
                          'Calculate cost-benefit of targeted corrective actions',
                          'Implement and verify corrective actions, then re-draw Pareto to confirm improvement',
                          'Monitor trivial many for emerging patterns that may become significant'
                        ]
                      }}
                    />
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={result.sortedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="type" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        yAxisId="left" 
                        tick={{ fontSize: 12 }}
                        label={{ value: useCost ? 'Cost ($)' : 'Count', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        domain={[0, 100]}
                        label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey={useCost ? "cost" : "count"} 
                        fill="#ffd559" 
                        name={useCost ? "Cost ($)" : "Count"}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="cumulativePercentage"
                        stroke="#dc2626"
                        strokeWidth={2}
                        name="Cumulative %"
                        dot={{ fill: '#dc2626' }}
                      />
                      <ReferenceLine
                        yAxisId="right"
                        y={80}
                        stroke="#dc2626"
                        strokeDasharray="5 5"
                        label="80%"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="heading-small mb-4">Analysis Results</h3>
                  <div className="space-y-4">
                    <div className="grid-2 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-700">
                          {result.vitalFew.length}
                        </div>
                        <div className="text-small text-yellow-600">Vital Few</div>
                        <div className="text-xs text-muted mt-1">
                          {result.vitalFew.join(', ')}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700">
                          {result.trivialMany.length}
                        </div>
                        <div className="text-small text-gray-600">Trivial Many</div>
                        <div className="text-xs text-muted mt-1">
                          {result.trivialMany.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left">Defect</th>
                            <th className="p-2 text-center">Count</th>
                            {useCost && <th className="p-2 text-center">Cost</th>}
                            <th className="p-2 text-center">%</th>
                            <th className="p-2 text-center">Cumulative %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.sortedData.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{item.type}</td>
                              <td className="p-2 text-center">{item.count}</td>
                              {useCost && (
                                <td className="p-2 text-center">
                                  ${item.cost ? (item.count * item.cost).toFixed(2) : '0.00'}
                                </td>
                              )}
                              <td className="p-2 text-center">{item.percentage.toFixed(1)}%</td>
                              <td className="p-2 text-center font-bold">
                                {item.cumulativePercentage.toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <p className="text-muted">Enter defect data to see Pareto analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Interpretation Panel */}
        {result && (
          <div className="interpretation-panel card-featured">
            <h3 className="heading-medium mb-4">Pareto Analysis Interpretation</h3>
            <div className="text-body text-muted">
              <div className="mb-6">
                <h4 className="heading-small mb-2">Vital Few Analysis</h4>
                <p className="mb-3">
                  <strong>Focus on these {result.vitalFew.length} defect types:</strong> {result.vitalFew.join(', ')}
                </p>
                <p>
                  These account for approximately 80% of all {useCost ? 'costs' : 'defects'}, 
                  representing the most significant opportunities for improvement.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <h4 className="heading-small mb-2">Ishikawa's 80/20 Principle</h4>
                <p className="text-small mb-2">
                  "The Pareto principle states that roughly 80% of effects come from 20% of causes. 
                  In quality control, this means a few defect types cause most of the problems."
                </p>
                <p className="text-small">
                  "Try to have the vertical axis represent amounts of money (cost of defects), 
                  not just count — this better prioritizes economic impact."
                </p>
              </div>

              <div className="grid-2 gap-4">
                <div>
                  <h4 className="heading-small mb-2">Recommendations</h4>
                  <ul className="space-y-1 ml-6">
                    <li className="text-body">Prioritize improvement efforts on vital few defects</li>
                    <li className="text-body">Use cause-effect analysis to identify root causes</li>
                    <li className="text-body">Implement corrective actions with highest ROI</li>
                    <li className="text-body">Monitor trivial many for emerging patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="heading-small mb-2">Next Steps</h4>
                  <ul className="space-y-1 ml-6">
                    <li className="text-body">Analyze vital few defects with fishbone diagrams</li>
                    <li className="text-body">Calculate cost-benefit of improvements</li>
                    <li className="text-body">Develop action plans for top issues</li>
                    <li className="text-body">Track progress with updated Pareto charts</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="heading-small mb-2">Economic Impact</h4>
                <p className="text-small">
                  {useCost && result.totalCost && (
                    <>Total economic impact: ${result.totalCost.toFixed(2)}. </>
                  )}
                  Addressing the vital few defects could eliminate approximately 80% of the {useCost ? 'cost' : 'problems'} 
                  with focused improvement efforts.
                </p>
              </div>
            </div>
          </div>
        )}

        <KaizenPromo />
      </div>
    </div>
  );
}
