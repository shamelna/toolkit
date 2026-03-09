import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, Download, RotateCcw, Upload } from 'lucide-react';
import ToolHeader from './ToolHeader';
import ExportButton from './ExportButton';
import KaizenPromo from './KaizenPromo';

interface GraphData {
  lineData: Array<{ day: number; groupA: number; groupB: number; groupC: number }>;
  barData: Array<{ month: string; groupA: number; groupB: number }>;
  pieData: Array<{ category: string; count: number }>;
}

export default function Graphs() {
  const [activeGraph, setActiveGraph] = useState<'line' | 'bar' | 'pie'>('line');
  const [data, setData] = useState<GraphData>({
    lineData: [
      { day: 1, groupA: 1235, groupB: 1456, groupC: 1456 },
      { day: 2, groupA: 1219, groupB: 1659, groupC: 1659 },
      { day: 3, groupA: 1345, groupB: 1567, groupC: 1567 },
      { day: 4, groupA: 1456, groupB: 1678, groupC: 1678 },
      { day: 5, groupA: 1567, groupB: 1789, groupC: 1789 },
      { day: 6, groupA: 1678, groupB: 1890, groupC: 1890 },
      { day: 7, groupA: 1789, groupB: 1901, groupC: 1901 },
      { day: 8, groupA: 1901, groupB: 2012, groupC: 2012 },
      { day: 9, groupA: 2012, groupB: 2123, groupC: 2123 },
      { day: 10, groupA: 2123, groupB: 2234, groupC: 2234 },
      { day: 11, groupA: 2234, groupB: 2345, groupC: 2345 },
      { day: 12, groupA: 2345, groupB: 2456, groupC: 2456 }
    ],
    barData: [
      { month: 'Jan', groupA: 1200, groupB: 1400 },
      { month: 'Feb', groupA: 1300, groupB: 1500 },
      { month: 'Mar', groupA: 1400, groupB: 1600 },
      { month: 'Apr', groupA: 1500, groupB: 1700 },
      { month: 'May', groupA: 1600, groupB: 1800 },
      { month: 'Jun', groupA: 1700, groupB: 1900 }
    ],
    pieData: [
      { category: 'Supervisors', count: 15 },
      { category: 'Staff', count: 2 },
      { category: 'Operators', count: 45 },
      { category: 'Other', count: 8 }
    ]
  });

  const [barChartType, setBarChartType] = useState<'grouped' | 'stacked'>('grouped');
  const [pieChartType, setPieChartType] = useState<'pie' | 'donut'>('pie');

  const loadBookExample = () => {
    const bookData: GraphData = {
      lineData: [
        { day: 1, groupA: 1235, groupB: 1456, groupC: 1456 },
        { day: 2, groupA: 1219, groupB: 1659, groupC: 1659 },
        { day: 3, groupA: 1345, groupB: 1567, groupC: 1567 },
        { day: 4, groupA: 1456, groupB: 1678, groupC: 1678 },
        { day: 5, groupA: 1567, groupB: 1789, groupC: 1789 },
        { day: 6, groupA: 1678, groupB: 1890, groupC: 1890 },
        { day: 7, groupA: 1789, groupB: 1901, groupC: 1901 },
        { day: 8, groupA: 1901, groupB: 2012, groupC: 2012 },
        { day: 9, groupA: 2012, groupB: 2123, groupC: 2123 },
        { day: 10, groupA: 2123, groupB: 2234, groupC: 2234 },
        { day: 11, groupA: 2234, groupB: 2345, groupC: 2345 },
        { day: 12, groupA: 2345, groupB: 2456, groupC: 2456 }
      ],
      barData: [
        { month: 'Jan', groupA: 1200, groupB: 1400 },
        { month: 'Feb', groupA: 1300, groupB: 1500 },
        { month: 'Mar', groupA: 1400, groupB: 1600 },
        { month: 'Apr', groupA: 1500, groupB: 1700 },
        { month: 'May', groupA: 1600, groupB: 1800 },
        { month: 'Jun', groupA: 1700, groupB: 1900 }
      ],
      pieData: [
        { category: 'Supervisors', count: 15 },
        { category: 'Staff', count: 2 },
        { category: 'Operators', count: 45 },
        { category: 'Other', count: 8 }
      ]
    };
    setData(bookData);
  };

  const clearData = () => {
    setData({
      lineData: [],
      barData: [],
      pieData: []
    });
  };

  const updateLineData = (index: number, field: 'groupA' | 'groupB' | 'groupC', value: string) => {
    setData(prev => ({
      ...prev,
      lineData: prev.lineData.map((item, i) => 
        i === index ? { ...item, [field]: parseInt(value) || 0 } : item
      )
    }));
  };

  const updateBarData = (index: number, field: 'groupA' | 'groupB', value: string) => {
    setData(prev => ({
      ...prev,
      barData: prev.barData.map((item, i) => 
        i === index ? { ...item, [field]: parseInt(value) || 0 } : item
      )
    }));
  };

  const updatePieData = (index: number, field: 'category' | 'count', value: string) => {
    setData(prev => ({
      ...prev,
      pieData: prev.pieData.map((item, i) => 
        i === index ? { 
          ...item, 
          [field]: field === 'count' ? parseInt(value) || 0 : value 
        } : item
      )
    }));
  };

  const addLineDataPoint = () => {
    const newDay = data.lineData.length + 1;
    setData(prev => ({
      ...prev,
      lineData: [...prev.lineData, { day: newDay, groupA: 0, groupB: 0, groupC: 0 }]
    }));
  };

  const addBarDataPoint = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const nextMonth = months[data.barData.length % months.length];
    setData(prev => ({
      ...prev,
      barData: [...prev.barData, { month: nextMonth, groupA: 0, groupB: 0 }]
    }));
  };

  const addPieDataPoint = () => {
    setData(prev => ({
      ...prev,
      pieData: [...prev.pieData, { category: 'New Category', count: 0 }]
    }));
  };

  const COLORS = ['#ffd559', '#1a1a1a', '#ff6b35', '#dc2626', '#2a2a2a', '#06b6d4'];

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data.lineData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="groupA" stroke="#ffd559" strokeWidth={2} name="Group A" />
        <Line type="monotone" dataKey="groupB" stroke="#1a1a1a" strokeWidth={2} name="Group B" />
        <Line type="monotone" dataKey="groupC" stroke="#ff6b35" strokeWidth={2} name="Group C" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data.barData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="groupA" fill="#ffd559" name="Group A" />
        <Bar dataKey="groupB" fill="#1a1a1a" name="Group B" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data.pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={pieChartType === 'donut' ? 120 : 150}
          innerRadius={pieChartType === 'donut' ? 60 : 0}
          fill="#8884d8"
          dataKey="count"
        >
          {data.pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderLineDataInput = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-small">Line Graph Data</h3>
        <button onClick={addLineDataPoint} className="btn-ghost">
          Add Point
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-center">Group A</th>
              <th className="p-2 text-center">Group B</th>
              <th className="p-2 text-center">Group C</th>
            </tr>
          </thead>
          <tbody>
            {data.lineData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.day}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.groupA}
                    onChange={(e) => updateLineData(index, 'groupA', e.target.value)}
                    className="w-20 p-1 text-center border rounded"
                    min="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.groupB}
                    onChange={(e) => updateLineData(index, 'groupB', e.target.value)}
                    className="w-20 p-1 text-center border rounded"
                    min="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.groupC}
                    onChange={(e) => updateLineData(index, 'groupC', e.target.value)}
                    className="w-20 p-1 text-center border rounded"
                    min="0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBarDataInput = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-small">Bar Graph Data</h3>
        <div className="flex gap-2">
          <select
            value={barChartType}
            onChange={(e) => setBarChartType(e.target.value as 'grouped' | 'stacked')}
            className="input text-small"
          >
            <option value="grouped">Grouped</option>
            <option value="stacked">Stacked</option>
          </select>
          <button onClick={addBarDataPoint} className="btn-ghost">
            Add Point
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Month</th>
              <th className="p-2 text-center">Group A</th>
              <th className="p-2 text-center">Group B</th>
            </tr>
          </thead>
          <tbody>
            {data.barData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.month}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.groupA}
                    onChange={(e) => updateBarData(index, 'groupA', e.target.value)}
                    className="w-20 p-1 text-center border rounded"
                    min="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.groupB}
                    onChange={(e) => updateBarData(index, 'groupB', e.target.value)}
                    className="w-20 p-1 text-center border rounded"
                    min="0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPieDataInput = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-small">Pie Chart Data</h3>
        <div className="flex gap-2">
          <select
            value={pieChartType}
            onChange={(e) => setPieChartType(e.target.value as 'pie' | 'donut')}
            className="input text-small"
          >
            <option value="pie">Pie</option>
            <option value="donut">Donut</option>
          </select>
          <button onClick={addPieDataPoint} className="btn-ghost">
            Add Category
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-center">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.pieData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updatePieData(index, 'category', e.target.value)}
                    className="w-32 p-1 border rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.count}
                    onChange={(e) => updatePieData(index, 'count', e.target.value)}
                    className="w-20 p-1 text-center border rounded"
                    min="0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const graphTypes = [
    { id: 'line', name: 'Line Graph', icon: LineChartIcon, description: 'Show trends over time' },
    { id: 'bar', name: 'Bar Graph', icon: BarChartIcon, description: 'Compare categories' },
    { id: 'pie', name: 'Pie Chart', icon: PieChartIcon, description: 'Show proportions' }
  ];

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="05"
          title="GRAPHS"
          subtitle="Visualize data trends and comparisons clearly with line graphs, bar charts, and pie charts"
        />

        {/* Graph Type Selection */}
        <div className="mb-8">
          <div className="grid-3">
            {graphTypes.map(type => (
              <div
                key={type.id}
                className={`card cursor-pointer transition-all ${
                  activeGraph === type.id ? 'ring-2 ring-yellow-500' : ''
                }`}
                onClick={() => setActiveGraph(type.id as 'line' | 'bar' | 'pie')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <type.icon className="w-6 h-6 text-yellow-600" />
                  <h3 className="heading-small">{type.name}</h3>
                </div>
                <p className="text-small text-muted">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-body">
          {/* Input Panel */}
          <div className="input-panel">
            <div className="card">
              <h2 className="heading-medium mb-4">Data Input</h2>
              
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

              {activeGraph === 'line' && renderLineDataInput()}
              {activeGraph === 'bar' && renderBarDataInput()}
              {activeGraph === 'pie' && renderPieDataInput()}
            </div>
          </div>

          {/* Chart Panel */}
          <div className="chart-panel">
            <div className="card" id="graphs-chart">
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-small mb-0">
                  {graphTypes.find(t => t.id === activeGraph)?.name}
                </h3>
                <ExportButton
                  chartData={{
                    elementId: 'graphs-chart',
                    title: `${graphTypes.find(t => t.id === activeGraph)?.name} Analysis`,
                    description: `${graphTypes.find(t => t.id === activeGraph)?.description}`
                  }}
                  dataExport={{
                    data: activeGraph === 'line'
                      ? data.lineData.map(d => ({ Day: d.day, 'Group A': d.groupA, 'Group B': d.groupB, 'Group C': d.groupC }))
                      : activeGraph === 'bar'
                      ? data.barData.map(d => ({ Month: d.month, 'Group A': d.groupA, 'Group B': d.groupB }))
                      : data.pieData.map(d => {
                          const total = data.pieData.reduce((s, p) => s + p.count, 0);
                          return { Category: d.category, Count: d.count, '%': ((d.count / total) * 100).toFixed(1) + '%' };
                        }),
                    sheetName: `${activeGraph}-graph`
                  }}
                  reportData={{
                    title: `Graph Analysis Report — ${graphTypes.find(t => t.id === activeGraph)?.name}`,
                    toolName: 'Graphs — Tool 05 of the 7 QC Tools',
                    date: new Date().toLocaleDateString(),
                    data: {
                      sections: [
                        {
                          heading: 'Graph Summary',
                          stats: {
                            'Graph Type': graphTypes.find(t => t.id === activeGraph)?.name || '',
                            'Purpose': graphTypes.find(t => t.id === activeGraph)?.description || '',
                            'Data Points': activeGraph === 'line' ? data.lineData.length : activeGraph === 'bar' ? data.barData.length : data.pieData.length,
                          }
                        },
                        ...(activeGraph === 'line' && data.lineData.length > 0 ? [{
                          heading: 'Trend Analysis',
                          stats: Object.fromEntries(['groupA', 'groupB', 'groupC'].map(g => {
                            const vals = data.lineData.map(d => d[g as keyof typeof d] as number);
                            const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
                            const trend = vals[vals.length - 1] > vals[0] ? '↑ Increasing' : '↓ Decreasing';
                            return [`${g} trend`, `Avg: ${avg.toFixed(0)} — ${trend}`];
                          }))
                        }, {
                          heading: 'Line Graph Data',
                          table: {
                            headers: ['Day', 'Group A', 'Group B', 'Group C'],
                            rows: data.lineData.map(d => [d.day, d.groupA, d.groupB, d.groupC])
                          }
                        }] : []),
                        ...(activeGraph === 'bar' && data.barData.length > 0 ? [{
                          heading: 'Comparison Analysis',
                          table: {
                            headers: ['Month', 'Group A', 'Group B', 'Difference', 'Higher'],
                            rows: data.barData.map(d => [
                              d.month, d.groupA, d.groupB,
                              Math.abs(d.groupA - d.groupB),
                              d.groupA > d.groupB ? 'Group A' : 'Group B'
                            ])
                          }
                        }] : []),
                        ...(activeGraph === 'pie' && data.pieData.length > 0 ? [{
                          heading: 'Proportion Analysis',
                          table: {
                            headers: ['Category', 'Count', '% Share', 'Note'],
                            rows: data.pieData.map(d => {
                              const total = data.pieData.reduce((s, p) => s + p.count, 0);
                              const pct = (d.count / total) * 100;
                              return [d.category, d.count, pct.toFixed(1) + '%', pct > 50 ? 'Dominant' : pct > 30 ? 'Significant' : 'Minor'];
                            })
                          }
                        }] : []),
                        {
                          heading: "Ishikawa's Guidance on Graphs",
                          text: "Graphs provide visual representation of data that makes patterns and trends immediately apparent. Choose the right graph type for your data and purpose. Keep graphs simple and clear. Use appropriate scales, label axes clearly, and avoid 3D effects that can distort perception."
                        }
                      ]
                    },
                    charts: [{ elementId: 'graphs-chart', title: `${graphTypes.find(t => t.id === activeGraph)?.name}`, description: '' }],
                    summary: `${graphTypes.find(t => t.id === activeGraph)?.name} with ${activeGraph === 'line' ? data.lineData.length : activeGraph === 'bar' ? data.barData.length : data.pieData.length} data points.`,
                    recommendations: [
                      'Verify data accuracy and check for outliers before drawing conclusions',
                      'Look for trends, cycles, or abnormal patterns that require investigation',
                      'Use additional QC tools (Control Charts, Check Sheets) to investigate unusual patterns',
                      'Document and share insights with the team for continuous improvement action'
                    ]
                  }}
                />
              </div>

              {activeGraph === 'line' && renderLineChart()}
              {activeGraph === 'bar' && renderBarChart()}
              {activeGraph === 'pie' && renderPieChart()}
            </div>

            <div className="card">
              <h3 className="heading-small mb-4">Graph Analysis</h3>
              
              {activeGraph === 'line' && data.lineData.length > 0 && (
                <div className="space-y-4">
                  <h4 className="heading-small">Trend Analysis</h4>
                  {['groupA', 'groupB', 'groupC'].map(group => {
                    const values = data.lineData.map(d => d[group as keyof typeof d] as number);
                    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
                    const trend = values[values.length - 1] > values[0] ? 'increasing' : 'decreasing';
                    
                    return (
                      <div key={group} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-body">{group}</span>
                        <div className="text-right">
                          <div className="text-small font-bold">Avg: {avg.toFixed(0)}</div>
                          <div className={`text-xs ${trend === 'increasing' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeGraph === 'bar' && data.barData.length > 0 && (
                <div className="space-y-4">
                  <h4 className="heading-small">Comparison Analysis</h4>
                  {data.barData.map(item => {
                    const higher = item.groupA > item.groupB ? 'Group A' : 'Group B';
                    return (
                      <div key={item.month} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-body">{item.month}</span>
                        <div className="text-right">
                          <div className="text-small">Higher: {higher}</div>
                          <div className="text-xs text-muted">
                            Difference: {Math.abs(item.groupA - item.groupB)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeGraph === 'pie' && data.pieData.length > 0 && (
                <div className="space-y-4">
                  <h4 className="heading-small">Proportion Analysis</h4>
                  {data.pieData.map(item => {
                    const total = data.pieData.reduce((sum, d) => sum + d.count, 0);
                    const percentage = (item.count / total) * 100;
                    const isDominant = percentage > 50;
                    
                    return (
                      <div key={item.category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-body">{item.category}</span>
                        <div className="text-right">
                          <div className="text-small font-bold">{percentage.toFixed(1)}%</div>
                          {isDominant && (
                            <div className="text-xs text-yellow-600">Dominant</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interpretation Panel */}
        <div className="interpretation-panel card-featured">
          <h3 className="heading-medium mb-4">Graph Interpretation Guidelines</h3>
          <div className="text-body text-muted">
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <h4 className="heading-small mb-2">Ishikawa's Guidance</h4>
              <p className="text-small">
                "Graphs provide visual representation of data that makes patterns and trends immediately apparent. 
                Choose the right graph type for your data and purpose."
              </p>
            </div>

            <div className="grid-3 gap-4">
              <div>
                <h4 className="heading-small mb-2">Line Graphs</h4>
                <ul className="space-y-1 ml-6">
                  <li className="text-body">Show trends over time</li>
                  <li className="text-body">Compare multiple series</li>
                  <li className="text-body">Identify patterns and cycles</li>
                  <li className="text-body">Detect anomalies</li>
                </ul>
              </div>
              <div>
                <h4 className="heading-small mb-2">Bar Graphs</h4>
                <ul className="space-y-1 ml-6">
                  <li className="text-body">Compare categories</li>
                  <li className="text-body">Show rankings</li>
                  <li className="text-body">Display discrete data</li>
                  <li className="text-body">Group or stack values</li>
                </ul>
              </div>
              <div>
                <h4 className="heading-small mb-2">Pie Charts</h4>
                <ul className="space-y-1 ml-6">
                  <li className="text-body">Show proportions</li>
                  <li className="text-body">Display composition</li>
                  <li className="text-body">Highlight dominant parts</li>
                  <li className="text-body">Simple percentages</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="heading-small mb-2">Best Practices</h4>
              <p className="text-small">
                Keep graphs simple and clear. Use appropriate scales, label axes clearly, 
                and avoid 3D effects that can distort perception. Use color consistently 
                and ensure data is accurately represented.
              </p>
            </div>
          </div>
        </div>

        <KaizenPromo />
      </div>
    </div>
  );
}
