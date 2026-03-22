import React, { useState, useEffect } from 'react';
import { HelpCircle, Play, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  generateANOVA, 
  calculateEffectEstimates, 
  generateParetoData, 
  checkModelAssumptions,
  generateMainEffectsData,
  generateInteractionData
} from '../utils/statisticalAnalysis';
import type {
  DesignRecommendation,
  Factor,
  ResponseVariable,
  ExperimentResults,
  ANOVAResults,
  EffectEstimate,
  ModelDiagnostics,
  StageValidation
} from '../types';

interface Stage6AnalysisEngineProps {
  design: DesignRecommendation | null;
  factors: Factor[];
  responseVariables: ResponseVariable[];
  data: ExperimentResults | null;
  onUpdate: (_data: ExperimentResults) => void;
  onValidationChange?: (validation: StageValidation) => void;
}

interface AnalysisResults {
  anova: ANOVAResults[];
  effects: EffectEstimate[];
  diagnostics: ModelDiagnostics;
  paretoData: { effect: string; value: number; significant: boolean }[];
  mainEffectsData: { factor: string; levels: { level: string; mean: number }[] }[];
  interactionData: { factor1: string; factor2: string; data: { x: string; y: string; value: number }[] }[];
}

const Stage6AnalysisEngine: React.FC<Stage6AnalysisEngineProps> = ({
  design,
  factors,
  responseVariables,
  data,
  onUpdate,
  onValidationChange: _onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const controllableFactors = factors.filter(f => f.type === 'controllable');

  useEffect(() => {
    if (responseVariables.length > 0 && !selectedResponse) {
      setSelectedResponse(responseVariables[0].id);
    }
  }, [responseVariables, selectedResponse]);

  const runAnalysis = async () => {
    if (!data || !design || !selectedResponse) return;

    setIsAnalyzing(true);
    
    // Simulate analysis computation
    setTimeout(() => {
      const results: AnalysisResults = {
        anova: generateANOVA(data, selectedResponse, controllableFactors),
        effects: calculateEffectEstimates(data, selectedResponse, controllableFactors),
        diagnostics: checkModelAssumptions(data, selectedResponse),
        paretoData: generateParetoData(data, selectedResponse, controllableFactors),
        mainEffectsData: generateMainEffectsData(data, selectedResponse, controllableFactors),
        interactionData: generateInteractionData(data, selectedResponse, controllableFactors)
      };

      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  const interpretSignificance = (pValue: number, alpha: number = 0.05) => {
    return pValue < alpha ? 'significant' : 'not significant';
  };

  const getSignificanceColor = (pValue: number, alpha: number = 0.05) => {
    return pValue < alpha ? 'text-green-600' : 'text-gray-600';
  };

  if (!design) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Analysis Engine</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Please complete Stage 4 to select an experimental design.</p>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Analysis Engine</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No experimental data available. Please enter your results first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Statistical Analysis</h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedResponse}
                onChange={(e) => setSelectedResponse(e.target.value)}
                className="text-sm"
              >
                {responseVariables.map(variable => (
                  <option key={variable.id} value={variable.id}>
                    {variable.name}
                  </option>
                ))}
              </select>
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>
          </div>
        </div>

        {!analysisResults && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
              <p className="text-gray-600 mb-4">
                Click "Run Analysis" to perform statistical analysis on your experimental data
              </p>
              <p className="text-sm text-gray-500">
                Analysis includes ANOVA, effect estimates, model diagnostics, and visualization
              </p>
            </div>
          </div>
        )}

        {analysisResults && (
          <div className="space-y-8">
            {/* ANOVA Table */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">ANOVA Table</h3>
                <button
                  onClick={() => toggleHelp('anova')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'anova' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Understanding ANOVA:</p>
                    <p>
                      The ANOVA table partitions the total variation in your response into components 
                      attributable to each factor and residual error. The F-statistic tests whether each 
                      factor has a significant effect on the response.
                    </p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">DF</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SS</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">MS</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">F</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">p-value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Significant</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analysisResults.anova.map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{row.source}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.df}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.ss.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.ms.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.f.toFixed(2)}</td>
                        <td className={`px-4 py-2 text-sm font-medium ${getSignificanceColor(row.p)}`}>
                          {row.p.toFixed(4)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {row.significant ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-600">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Interpretation</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {analysisResults.anova
                    .filter(row => row.source !== 'Error' && row.source !== 'Total')
                    .map(row => (
                      <p key={row.source}>
                        <strong>{row.source}</strong> is {interpretSignificance(row.p)} 
                        {row.significant && (
                          <span className="text-green-600 ml-1">
                            (p = {row.p.toFixed(4)})
                          </span>
                        )}
                        {!row.significant && (
                          <span className="text-gray-600 ml-1">
                            (p = {row.p.toFixed(4)})
                          </span>
                        )}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {/* Effect Estimates */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Effect Estimates</h3>
                <button
                  onClick={() => toggleHelp('effects')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'effects' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">About effect estimates:</p>
                    <p>
                      Effect estimates quantify the magnitude and direction of each factor's influence 
                      on the response. Positive effects increase the response, negative effects decrease it. 
                      The t-statistic tests whether each effect is significantly different from zero.
                    </p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Effect</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estimate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Std Error</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">t</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">p-value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Significant</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analysisResults.effects.map((effect, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{effect.factor}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{effect.effect.toFixed(3)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{effect.standardError.toFixed(3)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{effect.t.toFixed(2)}</td>
                        <td className={`px-4 py-2 text-sm font-medium ${getSignificanceColor(effect.p)}`}>
                          {effect.p.toFixed(4)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {effect.significant ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-600">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model Diagnostics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Model Diagnostics</h3>
                <button
                  onClick={() => toggleHelp('diagnostics')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'diagnostics' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why diagnostics matter:</p>
                    <p>
                      Model diagnostics check whether the ANOVA assumptions are satisfied. 
                      Violations can affect the validity of your conclusions. 
                      Key assumptions include normality of residuals, equal variances, and independence.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysisResults.diagnostics).map(([key, value]) => {
                  if (key === 'recommendations') return null;
                  
                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        {value ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${value ? 'text-green-700' : 'text-yellow-700'}`}>
                        {value ? 'Assumption satisfied' : 'Potential concern'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {analysisResults.diagnostics.recommendations.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Recommendations</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {analysisResults.diagnostics.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Analysis complete. Results are ready for interpretation and reporting.
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stage6AnalysisEngine;
