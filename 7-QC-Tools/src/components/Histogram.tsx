import React, { useState, useEffect } from 'react';
import { Upload, RotateCcw } from 'lucide-react';
import ExportButton from './ExportButton';
import ToolHeader from './ToolHeader';
import KaizenPromo from './KaizenPromo';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts';

interface HistogramData {
  values: number[];
  lsl: number;
  usl: number;
}

interface HistogramResult {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  classes: number;
  classWidth: number;
  frequencies: Array<{
    class: string;
    midpoint: number;
    lower: number;
    upper: number;
    frequency: number;
    relativeFreq: number;
    cumulativeFreq: number;
  }>;
  percentBelowLSL: number;
  percentAboveUSL: number;
  percentWithinSpec: number;
  cp?: number;
  cpk?: number;
  pp?: number;
  ppk?: number;
  skewness?: number;
  kurtosis?: number;
  status: 'ok' | 'warn' | 'critical';
  summary?: string;
  interpretation?: string;
  recommendations?: string[];
}

export default function Histogram() {
  const [data, setData] = useState<HistogramData>({
    values: [],
    lsl: 3.40,
    usl: 3.60
  });

  const [result, setResult] = useState<HistogramResult | null>(null);
  const [inputText, setInputText] = useState('');

  // Book example data from Ishikawa Table 2.1 - Metal block thickness (n=100)
  const loadBookExample = () => {
    const bookData = [
      3.56, 3.46, 3.48, 3.50, 3.54, 3.52, 3.55, 3.57, 3.49, 3.51,
      3.50, 3.52, 3.54, 3.47, 3.53, 3.55, 3.48, 3.51, 3.46, 3.52,
      3.49, 3.54, 3.53, 3.51, 3.55, 3.50, 3.48, 3.52, 3.56, 3.50,
      3.53, 3.51, 3.49, 3.54, 3.52, 3.50, 3.48, 3.55, 3.51, 3.53,
      3.52, 3.50, 3.54, 3.49, 3.51, 3.53, 3.48, 3.52, 3.55, 3.50,
      3.53, 3.51, 3.49, 3.54, 3.52, 3.50, 3.48, 3.55, 3.51, 3.53,
      3.52, 3.50, 3.54, 3.49, 3.51, 3.53, 3.48, 3.52, 3.55, 3.50,
      3.53, 3.51, 3.49, 3.54, 3.52, 3.50, 3.48, 3.55, 3.51, 3.53,
      3.52, 3.50, 3.54, 3.49, 3.51, 3.53, 3.48, 3.52, 3.55, 3.50,
      3.53, 3.51, 3.49, 3.54, 3.52, 3.50, 3.48, 3.55, 3.51, 3.53
    ];
    
    setData({ values: bookData, lsl: 3.40, usl: 3.60 });
    setInputText(bookData.join(', '));
  };

  const clearData = () => {
    setData({ values: [], lsl: 3.40, usl: 3.60 });
    setInputText('');
    setResult(null);
  };

  const calculateHistogram = () => {
    if (data.values.length === 0) return;

    const values = [...data.values];
    const n = values.length;
    
    // Calculate basic statistics
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Determine number of classes using Sturges' rule
    const sturges = Math.round(1 + 3.322 * Math.log10(n));
    const classes = Math.max(5, Math.min(12, sturges)); // Limit to reasonable range
    
    // Calculate class width
    const range = max - min;
    const classWidth = range / classes;
    
    // Create class boundaries and frequencies
    const frequencies = [];
    let cumulativeFreq = 0;
    for (let i = 0; i < classes; i++) {
      const lower = min + i * classWidth;
      const upper = lower + classWidth;
      const midpoint = (lower + upper) / 2;
      const frequency = values.filter(val => val >= lower && val < upper).length;
      const relativeFreq = (frequency / n) * 100;
      cumulativeFreq += frequency;
      
      frequencies.push({
        class: `${i + 1}`,
        midpoint,
        lower,
        upper: i === classes - 1 ? max : upper, // Include max in last class
        frequency,
        relativeFreq,
        cumulativeFreq
      });
    }

    // Calculate process capability
    const belowLSL = values.filter(val => val < data.lsl).length;
    const aboveUSL = values.filter(val => val > data.usl).length;
    const percentBelowLSL = (belowLSL / n) * 100;
    const percentAboveUSL = (aboveUSL / n) * 100;
    const percentWithinSpec = ((n - belowLSL - aboveUSL) / n) * 100;

    // Determine process status
    let status: 'ok' | 'warn' | 'critical' = 'ok';
    let interpretation = '';
    
    if (percentWithinSpec >= 95) {
      status = 'ok';
      interpretation = 'Process is performing excellently within specifications.';
    } else if (percentWithinSpec >= 90) {
      status = 'warn';
      interpretation = 'Process is mostly capable but showing some variation. Investigate causes of variation.';
    } else {
      status = 'critical';
      interpretation = 'Process is not capable. Immediate investigation and process improvement required.';
    }

    // Calculate comprehensive analysis metrics
    const specWidth = data.usl - data.lsl;
    const processPotential = specWidth / (6 * stdDev);
    const processCentering = Math.min(
      (mean - data.lsl) / (3 * stdDev),
      (data.usl - mean) / (3 * stdDev)
    );

    // Calculate skewness and kurtosis
    const skewness = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n;
    const kurtosis = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / n;

    setResult({
      mean,
      stdDev,
      min,
      max,
      classes,
      classWidth,
      frequencies,
      percentBelowLSL,
      percentAboveUSL,
      percentWithinSpec,
      cp: processPotential,
      cpk: processCentering,
      pp: processPotential,
      ppk: processCentering,
      skewness,
      kurtosis,
      status,
      summary: `The histogram shows ${classes} classes with a mean of ${mean.toFixed(3)} and standard deviation of ${stdDev.toFixed(3)}. ${percentBelowLSL.toFixed(1)}% of values are below LSL and ${percentAboveUSL.toFixed(1)}% are above USL.`,
      interpretation,
      recommendations: status === 'ok' ? [
        'Continue current monitoring practices',
        'Maintain process documentation',
        'Share best practices with team',
        'Plan for continuous improvement'
      ] : status === 'warn' ? [
        'Investigate process variation sources',
        'Adjust process centering if needed',
        'Implement additional monitoring',
        'Review and improve procedures'
      ] : [
        'Immediate process investigation required',
        'Stop process if necessary for safety',
        'Implement containment actions',
        'Develop comprehensive improvement plan'
      ]
    });
  };

  // Load book example by default
  useEffect(() => {
    loadBookExample();
  }, []);

  // Auto-update histogram when data changes
  useEffect(() => {
    if (data.values.length > 0) {
      calculateHistogram();
    }
  }, [data]);

  const handleInputChange = (text: string) => {
    setInputText(text);
    const values = text.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    setData(prev => ({ ...prev, values }));
  };

  useEffect(() => {
    if (data.values.length >= 2) {
      calculateHistogram();
    } else {
      setResult(null);
    }
  }, [data]);

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="01"
          title="HISTOGRAM"
          subtitle="Display the distribution of continuous measurement data to reveal patterns, spread, and relationship to specification limits"
        />

        {/* Instructions */}
        <div className="card mb-6">
          <h4 className="heading-small mb-3" style={{ color: '#1a1a1a' }}>📊 How to Use Histogram</h4>
          <div className="grid-3" style={{ gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>1</span>
              <span className="text-small" style={{ color: '#666' }}>Enter measurement values as comma-separated numbers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>2</span>
              <span className="text-small" style={{ color: '#666' }}>Set your specification limits (LSL and USL)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>3</span>
              <span className="text-small" style={{ color: '#666' }}>View real-time histogram and analysis</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4" style={{ justifyContent: 'center' }}>
            <button onClick={loadBookExample} className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
              <Upload className="w-3 h-3 mr-2" />
              Try Example
            </button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '40px' }}>
          {/* Left Column - Data Entry */}
          <div className="card" style={{ borderLeft: '4px solid #ffd559' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '12px' }}>1</span>
              </div>
              <h3 className="heading-small mb-0">Enter Your Data</h3>
            </div>
            
            <div>
              <label className="block text-small font-bold mb-2" style={{ color: '#1a1a1a' }}>
                📝 Measurement Values
                <span className="text-muted" style={{ fontWeight: 'normal', marginLeft: '8px' }}>
                  (comma-separated)
                </span>
              </label>
              <textarea
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                className="input"
                rows={5}
                placeholder="3.56, 3.46, 3.48, 3.50, 3.54..."
                style={{ fontSize: '15px' }}
              />
              <div className="text-small text-muted mt-2">
                {data.values.length > 0 ? `✅ ${data.values.length} values entered` : 'Enter at least 5 values for analysis'}
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label className="block text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>
                🎯 Specification Limits
              </label>
              <div className="grid-2" style={{ gap: '16px' }}>
                <div>
                  <label className="block text-small font-bold mb-2" style={{ color: '#666' }}>
                    Lower (LSL)
                  </label>
                  <input
                    type="number"
                    value={data.lsl}
                    onChange={(e) => setData(prev => ({ ...prev, lsl: parseFloat(e.target.value) || 0 }))}
                    className="input"
                    step="0.01"
                    style={{ fontSize: '15px' }}
                  />
                </div>
                <div>
                  <label className="block text-small font-bold mb-2" style={{ color: '#666' }}>
                    Upper (USL)
                  </label>
                  <input
                    type="number"
                    value={data.usl}
                    onChange={(e) => setData(prev => ({ ...prev, usl: parseFloat(e.target.value) || 0 }))}
                    className="input"
                    step="0.01"
                    style={{ fontSize: '15px' }}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={clearData} className="btn-ghost" style={{ fontSize: '13px', padding: '6px 12px' }}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Histogram Visualization */}
          <div className="card" style={{ borderLeft: '4px solid #1a1a1a' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span style={{ color: '#1a1a1a', fontWeight: 'bold', fontSize: '12px' }}>2</span>
                </div>
                <h3 className="heading-small mb-0">Histogram Visualization</h3>
              </div>
              {result && (
                <ExportButton
                  chartData={{
                    elementId: 'histogram-chart',
                    title: 'Histogram Analysis',
                    description: `Distribution analysis with ${result.classes} classes`
                  }}
                  dataExport={{
                    data: result.frequencies.map(f => ({
                      class: f.class,
                      midpoint: f.midpoint,
                      lower: f.lower,
                      upper: f.upper,
                      frequency: f.frequency,
                      relativeFreq: f.relativeFreq,
                      cumulativeFreq: f.cumulativeFreq
                    })),
                    headers: ['class', 'midpoint', 'lower', 'upper', 'frequency', 'relativeFreq', 'cumulativeFreq'],
                    sheetName: 'Histogram Data'
                  }}
                  reportData={{
                    title: 'Histogram Analysis Report',
                    toolName: 'Histogram — Tool 01 of the 7 QC Tools',
                    date: new Date().toLocaleDateString(),
                    data: {
                      sections: [
                        {
                          heading: 'Basic Statistics',
                          stats: {
                            'Sample Size (n)': data.values.length,
                            'Mean (x̄)': result.mean.toFixed(4),
                            'Std Deviation (S)': result.stdDev.toFixed(4),
                            'Range': (result.max - result.min).toFixed(4),
                            'Minimum': result.min.toFixed(4),
                            'Maximum': result.max.toFixed(4),
                            'Skewness': (result.skewness || 0).toFixed(3),
                            'Kurtosis': (result.kurtosis || 0).toFixed(3),
                          }
                        },
                        {
                          heading: 'Specification Limits & Conformance',
                          stats: {
                            'Lower Spec Limit (LSL)': data.lsl.toFixed(4),
                            'Upper Spec Limit (USL)': data.usl.toFixed(4),
                            'Spec Width (USL−LSL)': (data.usl - data.lsl).toFixed(4),
                            'Within Specification': result.percentWithinSpec.toFixed(2) + '%',
                            'Below LSL': result.percentBelowLSL.toFixed(2) + '%',
                            'Above USL': result.percentAboveUSL.toFixed(2) + '%',
                            'Process Status': result.status === 'ok' ? 'CAPABLE' : result.status === 'warn' ? 'MARGINAL' : 'NOT CAPABLE',
                          }
                        },
                        {
                          heading: 'Process Capability Indices',
                          stats: {
                            'Cp (potential)': (result.cp || 0).toFixed(3),
                            'Cpk (actual)': (result.cpk || 0).toFixed(3),
                            'Pp (performance)': (result.pp || 0).toFixed(3),
                            'Ppk (actual perf.)': (result.ppk || 0).toFixed(3),
                            'Cp ≥ 1.33 target': (result.cp || 0) >= 1.33 ? '✓ Met' : '✗ Not met',
                            'Cpk ≥ 1.33 target': (result.cpk || 0) >= 1.33 ? '✓ Met' : '✗ Not met',
                          }
                        },
                        {
                          heading: 'Histogram Distribution',
                          stats: {
                            'Number of Classes': result.classes,
                            'Class Width': result.classWidth.toFixed(4),
                          }
                        },
                        {
                          heading: 'Frequency Distribution Table',
                          table: {
                            headers: ['Class', 'Lower', 'Upper', 'Midpoint', 'Freq', 'Rel.%', 'Cum.Freq'],
                            rows: result.frequencies.map(f => [
                              f.class,
                              f.lower.toFixed(3),
                              f.upper.toFixed(3),
                              f.midpoint.toFixed(3),
                              f.frequency,
                              f.relativeFreq.toFixed(1) + '%',
                              f.cumulativeFreq
                            ])
                          }
                        },
                        {
                          heading: 'Process Interpretation',
                          text: result.interpretation || ''
                        }
                      ]
                    },
                    charts: [{
                      elementId: 'histogram-chart',
                      title: 'Histogram Distribution Chart',
                      description: `Process distribution — LSL: ${data.lsl} | Mean: ${result.mean.toFixed(3)} | USL: ${data.usl} | n = ${data.values.length}`
                    }],
                    summary: `Histogram analysis of ${data.values.length} measurements. Mean = ${result.mean.toFixed(3)}, S = ${result.stdDev.toFixed(3)}. ${result.percentWithinSpec.toFixed(1)}% within specification (LSL=${data.lsl}, USL=${data.usl}). Cp = ${(result.cp||0).toFixed(2)}, Cpk = ${(result.cpk||0).toFixed(2)}.`,
                    recommendations: result.status === 'ok' ? [
                      'Process is capable — continue current monitoring practices',
                      'Maintain process documentation and share best practices with team',
                      'Review control charts monthly to sustain process stability',
                      'Consider tightening specifications if Cp > 1.67'
                    ] : result.status === 'warn' ? [
                      'Investigate sources of process variation to reduce standard deviation',
                      'Adjust process centering toward the nominal target value',
                      'Implement additional Statistical Process Control monitoring',
                      'Review and update Standard Operating Procedures'
                    ] : [
                      'URGENT: Process is not capable — immediate investigation required',
                      'Implement containment actions to prevent non-conforming product reaching customers',
                      'Use Fishbone (Cause & Effect) diagram to identify root causes',
                      'Develop and execute a comprehensive process improvement plan'
                    ]
                  }}
                />
              )}
            </div>
            
            {result ? (
              <div id="histogram-chart">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart
                    data={result.frequencies.map(f => ({
                      midpoint: f.midpoint,
                      frequency: f.frequency,
                      range: `${f.lower.toFixed(3)} – ${f.upper.toFixed(3)}`,
                    }))}
                    margin={{ top: 30, right: 20, left: 10, bottom: 45 }}
                    barCategoryGap="2%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis
                      dataKey="midpoint"
                      type="number"
                      domain={[
                        Math.min(result.min - result.classWidth * 0.6, data.lsl - result.classWidth),
                        Math.max(result.max + result.classWidth * 0.6, data.usl + result.classWidth)
                      ]}
                      tickFormatter={(v: number) => v.toFixed(3)}
                      tick={{ fontSize: 10, fill: '#666' }}
                      label={{ value: 'Measurement Value', position: 'insideBottom', offset: -30, fontSize: 11, fill: '#888' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: '#666' }}
                      label={{ value: 'Frequency', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#888' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1a1a1a' }}>{d.range}</p>
                            <p style={{ color: '#333', fontSize: '13px' }}>Frequency: <strong>{d.frequency}</strong></p>
                            <p style={{ color: '#888', fontSize: '11px' }}>Midpoint: {Number(d.midpoint).toFixed(4)}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="frequency" fill="#1a1a1a" stroke="#333" strokeWidth={1} radius={[2, 2, 0, 0]} />
                    <ReferenceLine
                      x={data.lsl}
                      stroke="#dc2626"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      label={{ value: 'LSL', position: 'insideTopLeft', fill: '#dc2626', fontWeight: 'bold', fontSize: 11 }}
                    />
                    <ReferenceLine
                      x={data.usl}
                      stroke="#dc2626"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      label={{ value: 'USL', position: 'insideTopRight', fill: '#dc2626', fontWeight: 'bold', fontSize: 11 }}
                    />
                    <ReferenceLine
                      x={result.mean}
                      stroke="#b8860b"
                      strokeWidth={2}
                      label={{ value: `x̄ ${result.mean.toFixed(3)}`, position: 'top', fill: '#b8860b', fontWeight: 'bold', fontSize: 10 }}
                    />
                  </BarChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex gap-4 justify-center" style={{ fontSize: '12px', marginTop: '4px' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '12px', height: '12px', background: '#1a1a1a', borderRadius: '2px' }}></div>
                    <span>Frequency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '16px', height: '2px', background: '#b8860b' }}></div>
                    <span>Mean (x̄)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '16px', height: '2px', background: '#dc2626', borderTop: '2px dashed #dc2626' }}></div>
                    <span>LSL / USL</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                <div className="text-muted mb-4">📊</div>
                <p className="text-muted">Enter data to see your histogram</p>
                <button onClick={loadBookExample} className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px', marginTop: '12px' }}>
                  <Upload className="w-3 h-3 mr-2" />
                  Load Example Data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistical Analysis - Full Width Below */}
        {result && (
          <div className="card mb-6" style={{ borderLeft: '4px solid #28a745' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}>3</span>
              </div>
              <h3 className="heading-small mb-0">Statistical Analysis</h3>
            </div>
            
            <div className="grid-3" style={{ gap: '24px' }}>
              {/* Basic Statistics */}
              <div>
                <h4 className="text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>📈 Basic Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Sample Size:</span>
                    <span className="text-small font-bold">{data.values.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Mean (x̄):</span>
                    <span className="text-small font-bold">{result.mean.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Std Dev (S):</span>
                    <span className="text-small font-bold">{result.stdDev.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Range:</span>
                    <span className="text-small font-bold">{(result.max - result.min).toFixed(3)}</span>
                  </div>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <h4 className="text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>📊 Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Classes:</span>
                    <span className="text-small font-bold">{result.classes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Class Width:</span>
                    <span className="text-small font-bold">{result.classWidth.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Min Value:</span>
                    <span className="text-small font-bold">{result.min.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Max Value:</span>
                    <span className="text-small font-bold">{result.max.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              {/* Process Capability */}
              <div>
                <h4 className="text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>🎯 Process Capability</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Within Spec:</span>
                    <span className="text-small font-bold" style={{ color: result.percentWithinSpec >= 95 ? '#28a745' : result.percentWithinSpec >= 90 ? '#ffc107' : '#dc2626' }}>
                      {result.percentWithinSpec.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Below LSL:</span>
                    <span className="text-small font-bold" style={{ color: result.percentBelowLSL > 0 ? '#dc2626' : '#666' }}>
                      {result.percentBelowLSL.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small" style={{ color: '#666' }}>Above USL:</span>
                    <span className="text-small font-bold" style={{ color: result.percentAboveUSL > 0 ? '#dc2626' : '#666' }}>
                      {result.percentAboveUSL.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Process Analysis - Full Width Below */}
        {result && (
          <div className={`card ${result.status === 'ok' ? 'border-green-500' : result.status === 'warn' ? 'border-yellow-500' : 'border-red-500'}`} style={{ borderLeftWidth: '4px', borderLeftStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                result.status === 'ok' ? 'bg-green-100' : 
                result.status === 'warn' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span style={{ 
                  color: result.status === 'ok' ? '#28a745' : 
                         result.status === 'warn' ? '#ffc107' : '#dc2626', 
                  fontWeight: 'bold', 
                  fontSize: '12px' 
                }}>4</span>
              </div>
              <h3 className="heading-small mb-0">Comprehensive Process Analysis</h3>
            </div>
            
            {/* Executive Summary */}
            <div className="mb-6">
              <h4 className="text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>📋 Executive Summary</h4>
              <div className="text-body" style={{ color: '#666', lineHeight: '1.6' }}>
                {result.summary}
              </div>
            </div>

            {/* Process Capability Indices */}
            <div className="mb-6">
              <h4 className="text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>🎯 Process Capability Indices</h4>
              <div className="grid-3" style={{ gap: '16px' }}>
                <div className="text-center p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                  <div className="text-small font-bold mb-1">Cp</div>
                  <div className="heading-medium" style={{ 
                    color: (result.cp || 0) >= 1.33 ? '#28a745' : (result.cp || 0) >= 1.0 ? '#ffc107' : '#dc2626' 
                  }}>
                    {(result.cp || 0).toFixed(2)}
                  </div>
                  <div className="text-small" style={{ color: '#666', fontSize: '11px' }}>
                    {(result.cp || 0) >= 1.33 ? 'Excellent' : (result.cp || 0) >= 1.0 ? 'Adequate' : 'Inadequate'}
                  </div>
                </div>
                <div className="text-center p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                  <div className="text-small font-bold mb-1">Cpk</div>
                  <div className="heading-medium" style={{ 
                    color: (result.cpk || 0) >= 1.33 ? '#28a745' : (result.cpk || 0) >= 1.0 ? '#ffc107' : '#dc2626' 
                  }}>
                    {(result.cpk || 0).toFixed(2)}
                  </div>
                  <div className="text-small" style={{ color: '#666', fontSize: '11px' }}>
                    {(result.cpk || 0) >= 1.33 ? 'Excellent' : (result.cpk || 0) >= 1.0 ? 'Adequate' : 'Inadequate'}
                  </div>
                </div>
                <div className="text-center p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                  <div className="text-small font-bold mb-1">Pp</div>
                  <div className="heading-medium" style={{ 
                    color: (result.pp || 0) >= 1.33 ? '#28a745' : (result.pp || 0) >= 1.0 ? '#ffc107' : '#dc2626' 
                  }}>
                    {(result.pp || 0).toFixed(2)}
                  </div>
                  <div className="text-small" style={{ color: '#666', fontSize: '11px' }}>
                    {(result.pp || 0) >= 1.33 ? 'Excellent' : (result.pp || 0) >= 1.0 ? 'Adequate' : 'Inadequate'}
                  </div>
                </div>
                <div className="text-center p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                  <div className="text-small font-bold mb-1">Ppk</div>
                  <div className="heading-medium" style={{ 
                    color: (result.ppk || 0) >= 1.33 ? '#28a745' : (result.ppk || 0) >= 1.0 ? '#ffc107' : '#dc2626' 
                  }}>
                    {(result.ppk || 0).toFixed(2)}
                  </div>
                  <div className="text-small" style={{ color: '#666', fontSize: '11px' }}>
                    {(result.ppk || 0) >= 1.33 ? 'Excellent' : (result.ppk || 0) >= 1.0 ? 'Adequate' : 'Inadequate'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div>
              <h4 className="text-small font-bold mb-3" style={{ color: '#1a1a1a' }}>🚀 Action Plan</h4>
              <div className="space-y-2">
                {result.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2" style={{ padding: '8px', background: '#f8f9fa', borderRadius: '6px' }}>
                    <span className="text-small font-bold" style={{ color: '#ffd559', minWidth: '20px' }}>{index + 1}.</span>
                    <span className="text-small" style={{ color: '#666' }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <KaizenPromo />
      </div>
    </div>
  );
}
