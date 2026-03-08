import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Scatter as ScatterIcon, Download, RotateCcw, Upload, TrendingUp } from 'lucide-react';
import ExportButton from './ExportButton';
import ToolHeader from './ToolHeader';
import KaizenPromo from './KaizenPromo';

interface ScatterData {
  observations: Array<{
    obs: number;
    x: number;
    y: number;
  }>;
  xLabel: string;
  yLabel: string;
}

interface ScatterResult {
  correlation: number;
  rSquared: number;
  slope: number;
  intercept: number;
  regressionLine: Array<{ x: number; y: number }>;
  interpretation: string;
  strength: 'none' | 'weak' | 'moderate' | 'strong';
  direction: 'positive' | 'negative' | 'none';
  duplicates: Array<{ x: number; y: number; count: number }>;
  significance: boolean;
}

export default function ScatterDiagram() {
  const [data, setData] = useState<ScatterData>({
    observations: [],
    xLabel: 'Speed',
    yLabel: 'Length (mm)'
  });

  const [result, setResult] = useState<ScatterResult | null>(null);
  const [inputText, setInputText] = useState('');
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');

  const loadBookExample = () => {
    const bookData: ScatterData = {
      observations: [
        { obs: 1, x: 8.1, y: 1046 },
        { obs: 2, x: 7.7, y: 1030 },
        { obs: 3, x: 7.4, y: 1039 },
        { obs: 4, x: 5.8, y: 1027 },
        { obs: 5, x: 7.2, y: 1035 },
        { obs: 6, x: 6.9, y: 1032 },
        { obs: 7, x: 8.3, y: 1048 },
        { obs: 8, x: 7.1, y: 1033 },
        { obs: 9, x: 6.5, y: 1029 },
        { obs: 10, x: 7.8, y: 1037 },
        { obs: 11, x: 8.0, y: 1044 },
        { obs: 12, x: 7.3, y: 1034 },
        { obs: 13, x: 6.7, y: 1031 },
        { obs: 14, x: 7.6, y: 1036 },
        { obs: 15, x: 8.2, y: 1047 },
        { obs: 16, x: 7.0, y: 1032 },
        { obs: 17, x: 6.8, y: 1030 },
        { obs: 18, x: 7.9, y: 1042 },
        { obs: 19, x: 7.5, y: 1035 },
        { obs: 20, x: 8.4, y: 1050 }
      ],
      xLabel: 'Speed',
      yLabel: 'Length (mm)'
    };
    
    setData(bookData);
    
    const textData = bookData.observations.map(obs => `${obs.x}, ${obs.y}`).join('\n');
    setInputText(textData);
  };

  const clearData = () => {
    setData({ observations: [], xLabel: 'Speed', yLabel: 'Length (mm)' });
    setInputText('');
    setNewX('');
    setNewY('');
    setResult(null);
  };

  const addObservation = () => {
    const x = parseFloat(newX);
    const y = parseFloat(newY);
    
    if (!isNaN(x) && !isNaN(y)) {
      setData(prev => ({
        ...prev,
        observations: [...prev.observations, {
          obs: prev.observations.length + 1,
          x,
          y
        }]
      }));
      setNewX('');
      setNewY('');
    }
  };

  const parseInputData = (text: string) => {
    const lines = text.trim().split('\n');
    const observations = lines.map((line, index) => {
      const [x, y] = line.split(',').map(v => parseFloat(v.trim()));
      return {
        obs: index + 1,
        x: isNaN(x) ? 0 : x,
        y: isNaN(y) ? 0 : y
      };
    }).filter(obs => !isNaN(obs.x) && !isNaN(obs.y));
    
    setData(prev => ({ ...prev, observations }));
  };

  const calculateScatter = () => {
    if (data.observations.length < 2) return;

    const n = data.observations.length;
    const xValues = data.observations.map(obs => obs.x);
    const yValues = data.observations.map(obs => obs.y);
    
    // Calculate means
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
    
    // Calculate correlation coefficient (r)
    const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean), 0);
    const xSumSq = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    const ySumSq = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const denominator = Math.sqrt(xSumSq * ySumSq);
    
    const correlation = numerator / denominator;
    const rSquared = correlation * correlation;
    
    // Calculate regression line: y = a + bx
    const slope = numerator / xSumSq;
    const intercept = yMean - slope * xMean;
    
    // Generate regression line points
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const regressionLine = [
      { x: xMin, y: intercept + slope * xMin },
      { x: xMax, y: intercept + slope * xMax }
    ];
    
    // Detect duplicates
    const duplicates: Array<{ x: number; y: number; count: number }> = [];
    const pointMap = new Map<string, number>();
    
    data.observations.forEach(obs => {
      const key = `${obs.x}-${obs.y}`;
      const count = pointMap.get(key) || 0;
      pointMap.set(key, count + 1);
    });
    
    pointMap.forEach((count, key) => {
      if (count > 1) {
        const [x, y] = key.split('-').map(parseFloat);
        duplicates.push({ x, y, count });
      }
    });
    
    // Determine correlation strength and direction
    let strength: 'none' | 'weak' | 'moderate' | 'strong';
    let direction: 'positive' | 'negative' | 'none';
    
    const absR = Math.abs(correlation);
    if (absR < 0.2) {
      strength = 'none';
      direction = 'none';
    } else if (absR < 0.4) {
      strength = 'weak';
      direction = correlation > 0 ? 'positive' : 'negative';
    } else if (absR < 0.7) {
      strength = 'moderate';
      direction = correlation > 0 ? 'positive' : 'negative';
    } else {
      strength = 'strong';
      direction = correlation > 0 ? 'positive' : 'negative';
    }
    
    // Statistical significance test (95% confidence)
    const criticalValue = n >= 30 ? 0.361 : n >= 20 ? 0.447 : n >= 10 ? 0.632 : 0.878;
    const significance = absR > criticalValue;
    
    // Generate interpretation
    let interpretation = '';
    
    if (strength === 'strong' && direction === 'positive') {
      interpretation = `Strong positive correlation detected (r = ${correlation.toFixed(3)}). As ${data.xLabel} increases, ${data.yLabel} tends to increase significantly. This relationship is worth investigating as a potential cause-effect link.`;
    } else if (strength === 'strong' && direction === 'negative') {
      interpretation = `Strong negative correlation detected (r = ${correlation.toFixed(3)}). As ${data.xLabel} increases, ${data.yLabel} tends to decrease significantly. This inverse relationship may be important for process optimization.`;
    } else if (strength === 'moderate') {
      interpretation = `Moderate ${direction} correlation detected (r = ${correlation.toFixed(3)}). Some relationship exists between ${data.xLabel} and ${data.yLabel}, but other factors may also influence the relationship.`;
    } else if (strength === 'weak') {
      interpretation = `Weak ${direction} correlation detected (r = ${correlation.toFixed(3)}). The relationship between ${data.xLabel} and ${data.yLabel} is not strong enough to be practically significant.`;
    } else {
      interpretation = `No significant correlation detected (r = ${correlation.toFixed(3)}). ${data.xLabel} and ${data.yLabel} appear to be independent variables.`;
    }
    
    if (!significance) {
      interpretation += ` The correlation is not statistically significant at 95% confidence level.`;
    }
    
    setResult({
      correlation,
      rSquared,
      slope,
      intercept,
      regressionLine,
      interpretation,
      strength,
      direction,
      duplicates,
      significance
    });
  };

  useEffect(() => {
    calculateScatter();
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-small">{`${data.xLabel || data.x}, ${data.yLabel || data.y}`}</p>
          {data.count && <p className="text-small text-red-600">Count: {data.count}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="07"
          title="SCATTER DIAGRAM"
          subtitle="Determine whether a relationship (correlation) exists between two variables and analyze cause-effect relationships"
        />

        {/* Instructions */}
        <div className="card mb-6">
          <h4 className="heading-small mb-3" style={{ color: '#1a1a1a' }}>📈 How to Use Scatter Diagram</h4>
          <div className="grid-3" style={{ gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>1</span>
              <span className="text-small" style={{ color: '#666' }}>Enter X and Y variable labels (the factors you want to analyze for correlation)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>2</span>
              <span className="text-small" style={{ color: '#666' }}>Input paired data points to visualize the relationship between variables</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>3</span>
              <span className="text-small" style={{ color: '#666' }}>Interpret the correlation coefficient and R² to identify potential cause-effect links</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4" style={{ justifyContent: 'center' }}>
            <button onClick={loadBookExample} className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
              <Upload className="w-3 h-3 mr-2" />
              Try Example
            </button>
          </div>
        </div>

        <div className="tool-body">
          {/* Input Panel */}
          <div className="input-panel">
            <div className="card">
              <h2 className="heading-medium mb-4">Data Input</h2>
              
              <div className="mb-4">
                <label className="block text-small font-bold mb-2">
                  X Variable Label
                </label>
                <input
                  type="text"
                  value={data.xLabel}
                  onChange={(e) => setData(prev => ({ ...prev, xLabel: e.target.value }))}
                  className="input"
                  placeholder="e.g., Speed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-small font-bold mb-2">
                  Y Variable Label
                </label>
                <input
                  type="text"
                  value={data.yLabel}
                  onChange={(e) => setData(prev => ({ ...prev, yLabel: e.target.value }))}
                  className="input"
                  placeholder="e.g., Length (mm)"
                />
              </div>

              <div className="mb-4">
                <label className="block text-small font-bold mb-2">
                  Data Points (x, y format, one per line)
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onBlur={() => parseInputData(inputText)}
                  className="input"
                  rows={8}
                  placeholder="8.1, 1046&#10;7.7, 1030&#10;7.4, 1039"
                />
                <p className="text-xs text-muted mt-1">Enter as: x_value, y_value (one pair per line)</p>
              </div>

              <div className="space-y-3 mb-4">
                <h3 className="heading-small">Add Single Point</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newX}
                    onChange={(e) => setNewX(e.target.value)}
                    placeholder="X value"
                    className="input"
                    step="0.1"
                  />
                  <input
                    type="number"
                    value={newY}
                    onChange={(e) => setNewY(e.target.value)}
                    placeholder="Y value"
                    className="input"
                    step="0.1"
                  />
                  <button onClick={addObservation} className="btn-primary">
                    Add Point
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

            {result && (
              <div className="card">
                <h3 className="heading-small mb-4">Correlation Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-small">Correlation (r):</span>
                    <span className="text-small font-bold">{result.correlation.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small">R²:</span>
                    <span className="text-small font-bold">{result.rSquared.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small">Regression:</span>
                    <span className="text-small font-bold">y = {result.intercept.toFixed(2)} + {result.slope.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small">Strength:</span>
                    <span className={`badge-${result.strength === 'strong' ? 'ok' : result.strength === 'moderate' ? 'warn' : 'alert'}`}>
                      {result.strength} {result.direction}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-small">Significant:</span>
                    <span className={`badge-${result.significance ? 'ok' : 'warn'}`}>
                      {result.significance ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {result.duplicates.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-small">Duplicate Points:</span>
                      <span className="text-small font-bold text-red-600">{result.duplicates.length}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chart Panel */}
          <div className="chart-panel">
            {result ? (
              <>
                <div className="card" id="scatter-chart">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="heading-small">Scatter Diagram with Regression Line</h3>
                    <ExportButton
                      chartData={{
                        elementId: 'scatter-chart',
                        title: 'Scatter Diagram Analysis',
                        description: `Correlation analysis between ${data.xLabel} and ${data.yLabel} showing ${result.strength} ${result.direction} relationship (r=${result.correlation.toFixed(3)})`
                      }}
                      dataExport={{
                        data: data.observations.map(obs => ({
                          observation: obs.obs,
                          x: obs.x,
                          y: obs.y
                        })),
                        headers: ['observation', 'x', 'y'],
                        sheetName: 'Scatter Data'
                      }}
                      reportData={{
                        title: 'Scatter Diagram Correlation Analysis Report',
                        toolName: 'Scatter Diagram — Tool 07 of the 7 QC Tools',
                        date: new Date().toLocaleDateString(),
                        data: {
                          sections: [
                            {
                              heading: 'Correlation Results',
                              stats: {
                                'X Variable': data.xLabel,
                                'Y Variable': data.yLabel,
                                'Observations (n)': data.observations.length,
                                'Correlation r': result.correlation.toFixed(4),
                                'R² (explained var.)': result.rSquared.toFixed(4),
                                'Correlation Strength': result.strength.charAt(0).toUpperCase() + result.strength.slice(1),
                                'Direction': result.direction.charAt(0).toUpperCase() + result.direction.slice(1),
                                'Statistically Significant': result.significance ? 'Yes (95% confidence)' : 'No',
                              }
                            },
                            {
                              heading: 'Regression Equation',
                              stats: {
                                'Equation': `y = ${result.intercept.toFixed(4)} + ${result.slope.toFixed(4)}x`,
                                'Slope (b)': result.slope.toFixed(4),
                                'Intercept (a)': result.intercept.toFixed(4),
                                'R² Interpretation': result.rSquared >= 0.7 ? `${(result.rSquared*100).toFixed(1)}% of variation in ${data.yLabel} is explained by ${data.xLabel}` : `${(result.rSquared*100).toFixed(1)}% of variation explained — other factors important`,
                              }
                            },
                            {
                              heading: 'Interpretation',
                              text: result.interpretation
                            },
                            ...(result.duplicates.length > 0 ? [{
                              heading: 'Duplicate Points Detected',
                              list: result.duplicates.map(d => `(${d.x}, ${d.y}) appears ${d.count} times — check data accuracy`)
                            }] : []),
                            {
                              heading: 'Observation Data',
                              table: {
                                headers: ['Obs.', data.xLabel.substring(0,10), data.yLabel.substring(0,10)],
                                rows: data.observations.slice(0, 30).map(obs => [obs.obs, obs.x, obs.y])
                              }
                            },
                            {
                              heading: "Ishikawa's Correlation Guidelines",
                              list: [
                                '|r| > 0.7 — Strong correlation: investigate as potential cause-effect relationship',
                                '0.4 ≤ |r| ≤ 0.7 — Moderate correlation: further investigation required',
                                '0 < |r| < 0.4 — Weak correlation: may not be practically significant',
                                'r ≈ 0 — No correlation: variables appear to be independent',
                                'r < 0 — Negative correlation: as X increases, Y decreases (inverse relationship)'
                              ]
                            }
                          ]
                        },
                        charts: [{
                          elementId: 'scatter-chart',
                          title: 'Scatter Diagram with Regression Line',
                          description: `${data.xLabel} vs ${data.yLabel} — r = ${result.correlation.toFixed(3)}, R² = ${result.rSquared.toFixed(3)}, ${result.strength} ${result.direction} correlation`
                        }],
                        summary: `Scatter diagram analysis: ${result.strength} ${result.direction} correlation (r = ${result.correlation.toFixed(3)}, R² = ${result.rSquared.toFixed(3)}) between ${data.xLabel} and ${data.yLabel} (n = ${data.observations.length}). Regression: y = ${result.intercept.toFixed(2)} + ${result.slope.toFixed(2)}x. ${result.significance ? 'Statistically significant at 95% confidence.' : 'Not statistically significant at 95% confidence.'}`,
                        recommendations: result.strength === 'strong' && result.significance ? [
                          `Strong correlation confirmed — use ${data.xLabel} as a predictor / control variable for ${data.yLabel}`,
                          'Implement process controls based on the regression equation',
                          `Monitor the relationship over time to confirm stability (current R² = ${result.rSquared.toFixed(3)})`,
                          'Document the cause-effect relationship in Standard Operating Procedures',
                          'Validate findings with additional data collected across different conditions'
                        ] : [
                          `Weak or non-significant correlation — investigate other factors affecting ${data.yLabel}`,
                          'Consider stratifying data by shifts, operators, or machines to reveal hidden patterns',
                          'Collect more observations (recommend n ≥ 30) to improve statistical power',
                          `Use Check Sheets to track other variables that may correlate with ${data.yLabel}`,
                          'Apply Fishbone diagram to brainstorm additional potential cause variables'
                        ]
                      }}
                    />
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        type="number"
                        dataKey="x" 
                        tick={{ fontSize: 12 }}
                        label={{ value: data.xLabel, position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        type="number"
                        dataKey="y" 
                        tick={{ fontSize: 12 }}
                        label={{ value: data.yLabel, angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Scatter 
                        name="Data Points" 
                        data={data.observations} 
                        fill="#ffd559"
                      />
                      <Line 
                        type="monotone"
                        dataKey="y"
                        data={result.regressionLine}
                        stroke="#dc2626"
                        strokeWidth={2}
                        dot={false}
                        name="Regression Line"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="heading-small mb-4">Correlation Strength</h3>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="absolute top-0 left-0 h-8 bg-gradient-to-r from-red-500 via-gray-500 to-green-500 rounded-full flex items-center justify-center"
                        style={{ 
                          left: `${((result.correlation + 1) / 2) * 100}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="bg-white rounded-full w-6 h-6 border-2 border-gray-800"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted mt-1">
                      <span>-1.0</span>
                      <span>0.0</span>
                      <span>+1.0</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-lg font-bold">{result.correlation.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <p className="text-muted">Enter data to see scatter diagram analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Interpretation Panel */}
        {result && (
          <div className="interpretation-panel card-featured">
            <h3 className="heading-medium mb-4">Scatter Diagram Interpretation</h3>
            <div className="text-body text-muted">
              <div className={`mb-4 p-4 rounded-lg ${
                result.strength === 'strong' ? 'bg-green-50' : 
                result.strength === 'moderate' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge-${result.strength === 'strong' ? 'ok' : result.strength === 'moderate' ? 'warn' : 'alert'}`}>
                    {result.strength} {result.direction} correlation
                  </span>
                </div>
                <p>{result.interpretation}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <h4 className="heading-small mb-2">Ishikawa's Correlation Guidelines</h4>
                <div className="space-y-2 text-small">
                  <p><strong>r greater than 0.7:</strong> Strong correlation - investigate cause-effect relationship</p>
                  <p><strong>0.4 to 0.7:</strong> Moderate correlation - further investigation needed</p>
                  <p><strong>0 to 0.4:</strong> Weak correlation - may not be practically significant</p>
                  <p><strong>r near 0:</strong> No correlation - variables appear independent</p>
                  <p><strong>r less than 0:</strong> Negative correlation - inverse relationship</p>
                </div>
              </div>

              {result.duplicates.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="heading-small mb-2">Duplicate Points Detected</h4>
                  <p className="text-small mb-2">
                    {result.duplicates.length} duplicate point(s) found. These may indicate:
                  </p>
                  <ul className="space-y-1 ml-6 text-small">
                    <li>Measurement precision limitations</li>
                    <li>Process stability at certain conditions</li>
                    <li>Data recording errors</li>
                  </ul>
                </div>
              )}

              <div className="grid-2 gap-4">
                <div>
                  <h4 className="heading-small mb-2">Statistical Significance</h4>
                  <p className="text-small">
                    {result.significance 
                      ? `The correlation is statistically significant at 95% confidence level (n=${data.observations.length}).`
                      : `The correlation is not statistically significant at 95% confidence level. More data may be needed.`
                    }
                  </p>
                </div>
                <div>
                  <h4 className="heading-small mb-2">Next Steps</h4>
                  <ul className="space-y-1 ml-6 text-small">
                    <li>Verify data accuracy and outliers</li>
                    <li>Consider stratification by other factors</li>
                    <li>Investigate potential causal mechanisms</li>
                    <li>Validate findings with additional data</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <h4 className="heading-small mb-2">Practical Application</h4>
                <p className="text-small">
                  {result.strength === 'strong' && result.significance
                    ? `This strong correlation suggests that ${data.xLabel} could be used to predict or control ${data.yLabel}. Consider implementing process controls based on this relationship.`
                    : `The weak or non-significant correlation suggests that other factors may be more important for controlling ${data.yLabel}. Investigate additional variables.`
                  }
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
