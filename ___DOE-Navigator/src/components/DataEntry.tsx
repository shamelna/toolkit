import React, { useState, useEffect } from 'react';
import { HelpCircle, Upload, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import type { 
  DesignRecommendation, 
  Factor, 
  ResponseVariable, 
  ExperimentResults, 
  ExperimentRun 
} from '../types';

interface DataEntryProps {
  design: DesignRecommendation | null;
  factors: Factor[];
  responseVariables: ResponseVariable[];
  data: ExperimentResults | null;
  onUpdate: (data: ExperimentResults) => void;
}

const DataEntry: React.FC<DataEntryProps> = ({
  design,
  factors,
  responseVariables,
  data,
  onUpdate
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);
  const [experimentData, setExperimentData] = useState<ExperimentRun[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const controllableFactors = factors.filter(f => f.type === 'controllable');

  useEffect(() => {
    if (design && !data) {
      // Initialize with design matrix
      const initialData: ExperimentRun[] = (design.designMatrix || []).map((row, index) => ({
        runId: index + 1,
        factorSettings: controllableFactors.reduce((acc, factor, factorIndex) => {
          acc[factor.name] = row[factorIndex] || '';
          return acc;
        }, {} as Record<string, string | number>),
        responseValues: responseVariables.reduce((acc, variable) => {
          acc[variable.id] = 0;
          return acc;
        }, {} as Record<string, number>)
      }));
      setExperimentData(initialData);
    } else if (data) {
      setExperimentData(data.data);
    }
  }, [design, data, factors, responseVariables]);

  const validateData = (runs: ExperimentRun[]): string[] => {
    const errors: string[] = [];

    runs.forEach((run, index) => {
      // Check for missing response values
      responseVariables.forEach(variable => {
        if (run.responseValues[variable.id] === undefined || run.responseValues[variable.id] === null) {
          errors.push(`Run ${run.runId}: Missing response value for ${variable.name}`);
        }
      });

      // Check for invalid numeric values
      responseVariables.forEach(variable => {
        const value = run.responseValues[variable.id];
        if (value !== undefined && value !== null && (isNaN(value) || !isFinite(value))) {
          errors.push(`Run ${run.runId}: Invalid numeric value for ${variable.name}`);
        }
      });

      // Check for outliers (simple check)
      responseVariables.forEach(variable => {
        const value = run.responseValues[variable.id];
        if (value !== undefined && value !== null) {
          const allValues = runs.map(r => r.responseValues[variable.id]).filter(v => v !== undefined && v !== null);
          const mean = allValues.reduce((sum, v) => sum + v, 0) / allValues.length;
          const stdDev = Math.sqrt(allValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / allValues.length);
          
          if (Math.abs(value - mean) > 3 * stdDev) {
            errors.push(`Run ${run.runId}: Possible outlier for ${variable.name} (value: ${value})`);
          }
        }
      });
    });

    return errors;
  };

  const updateRun = (runId: number, field: 'factorSettings' | 'responseValues', key: string, value: string | number) => {
    const updatedData = experimentData.map(run => {
      if (run.runId === runId) {
        return {
          ...run,
          [field]: {
            ...run[field],
            [key]: field === 'responseValues' ? parseFloat(value as string) || 0 : value
          }
        };
      }
      return run;
    });

    setExperimentData(updatedData);
    setValidationErrors(validateData(updatedData));
    
    onUpdate({
      data: updatedData,
      analysisComplete: false
    });
  };

  const addReplicate = () => {
    if (!design) return;

    const lastRunId = Math.max(...experimentData.map(run => run.runId), 0);
    const newRun: ExperimentRun = {
      runId: lastRunId + 1,
      factorSettings: controllableFactors.reduce((acc, factor) => {
        acc[factor.name] = '';
        return acc;
      }, {} as Record<string, string | number>),
      responseValues: responseVariables.reduce((acc, variable) => {
        acc[variable.id] = 0;
        return acc;
      }, {} as Record<string, number>)
    };

    const updatedData = [...experimentData, newRun];
    setExperimentData(updatedData);
    setValidationErrors(validateData(updatedData));
    
    onUpdate({
      data: updatedData,
      analysisComplete: false
    });
  };

  const removeRun = (runId: number) => {
    const updatedData = experimentData.filter(run => run.runId !== runId);
    setExperimentData(updatedData);
    setValidationErrors(validateData(updatedData));
    
    onUpdate({
      data: updatedData,
      analysisComplete: false
    });
  };

  const markAnalysisComplete = () => {
    const errors = validateData(experimentData);
    if (errors.length === 0) {
      onUpdate({
        data: experimentData,
        analysisComplete: true
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      // Header
      ['Run ID', ...controllableFactors.map(f => f.name), ...responseVariables.map(v => v.name)],
      // Data rows
      ...experimentData.map(run => [
        run.runId.toString(),
        ...controllableFactors.map(f => run.factorSettings[f.name]),
        ...responseVariables.map(v => run.responseValues[v.id])
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiment_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const importedData: ExperimentRun[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',');
        const run: ExperimentRun = {
          runId: parseInt(values[0]) || i,
          factorSettings: {},
          responseValues: {}
        };

        // Map factor settings
        controllableFactors.forEach((factor, index) => {
          run.factorSettings[factor.name] = values[index + 1] || '';
        });

        // Map response values
        responseVariables.forEach((variable, index) => {
          const valueIndex = controllableFactors.length + index + 1;
          run.responseValues[variable.id] = parseFloat(values[valueIndex]) || 0;
        });

        importedData.push(run);
      }

      setExperimentData(importedData);
      setValidationErrors(validateData(importedData));
      
      onUpdate({
        data: importedData,
        analysisComplete: false
      });
    };
    
    reader.readAsText(file);
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  if (!design) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Data Entry</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Please complete Stage 4 to select an experimental design.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Experimental Data Entry</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <button
                onClick={exportData}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={addReplicate}
                className="flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Add Run
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
            <button
              onClick={() => toggleHelp('dataEntry')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {expandedHelp === 'dataEntry' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Data entry guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Enter response values for each experimental run</li>
                  <li>Factor settings are pre-populated from your design</li>
                  <li>Use consistent units for all measurements</li>
                  <li>Check for outliers and data entry errors</li>
                  <li>Mark analysis complete when ready to proceed</li>
                </ul>
              </div>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-900">Data Validation Issues</h4>
              </div>
              <ul className="text-sm text-red-800 space-y-1">
                {validationErrors.slice(0, 5).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {validationErrors.length > 5 && (
                  <li>• ... and {validationErrors.length - 5} more issues</li>
                )}
              </ul>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Run</th>
                  {controllableFactors.map(factor => (
                    <th key={factor.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {factor.name}
                    </th>
                  ))}
                  {responseVariables.map(variable => (
                    <th key={variable.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {variable.name} {variable.unit && `(${variable.unit})`}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experimentData.map((run) => (
                  <tr key={run.runId}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{run.runId}</td>
                    {controllableFactors.map(factor => (
                      <td key={factor.id} className="px-4 py-2 text-sm text-gray-500">
                        {run.factorSettings[factor.name]}
                      </td>
                    ))}
                    {responseVariables.map(variable => (
                      <td key={variable.id} className="px-4 py-2">
                        <input
                          type="number"
                          step="any"
                          value={run.responseValues[variable.id] || ''}
                          onChange={(e) => updateRun(run.runId, 'responseValues', variable.id, e.target.value)}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="0.0"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeRun(run.runId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {experimentData.length} runs entered • {validationErrors.length} validation issues
            </div>
            <button
              onClick={markAnalysisComplete}
              disabled={validationErrors.length > 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Analysis Ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
