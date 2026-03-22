import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { OEEData, OEResult, calculateOEE, validateOEEData } from '../utils/tpmCalculations';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, ReferenceLine
} from 'recharts';

export default function OEECalculator() {
  const [data, setData] = useState<OEEData>({
    workingHours: 8,
    plannedDowntime: 20,
    stoppageLosses: 60,
    output: 400,
    qualityRate: 98,
    idealCycleTime: 0.5,
    actualCycleTime: 0.8
  });

  const [result, setResult] = useState<OEResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const validationErrors = validateOEEData(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    const calculationResult = calculateOEE(data);
    setResult(calculationResult);
    setErrors([]);
  };

  const handleInputChange = (field: keyof OEEData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => ({ ...prev, [field]: numValue }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'adequate': return 'text-yellow-600';
      case 'inadequate': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'adequate': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'inadequate': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  // Prepare data for charts
  const componentData = result ? [
    { name: 'Availability', value: result.availability, target: 90 },
    { name: 'Performance', value: result.performanceEfficiency, target: 95 },
    { name: 'Quality', value: data.qualityRate, target: 99 }
  ] : [];

  const oeeTrendData = result ? [
    { name: 'Current OEE', value: result.oee },
    { name: 'World-Class Target', value: 85 }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Calculator className="w-6 h-6 text-yellow-800" />
        </div>
        <div>
          <h1 className="heading-large text-gray-800">OEE Calculator</h1>
          <p className="text-gray-600">Overall Equipment Effectiveness - The master TPM metric</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="card">
        <h2 className="heading-medium text-gray-800 mb-6">Input Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours (per day)
            </label>
            <input
              type="number"
              value={data.workingHours}
              onChange={(e) => handleInputChange('workingHours', e.target.value)}
              className="input"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Total available working hours</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planned Downtime (minutes)
            </label>
            <input
              type="number"
              value={data.plannedDowntime}
              onChange={(e) => handleInputChange('plannedDowntime', e.target.value)}
              className="input"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-1">Scheduled maintenance, meetings, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stoppage Losses (minutes)
            </label>
            <input
              type="number"
              value={data.stoppageLosses}
              onChange={(e) => handleInputChange('stoppageLosses', e.target.value)}
              className="input"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-1">Breakdowns + setup + adjustment</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output (units)
            </label>
            <input
              type="number"
              value={data.output}
              onChange={(e) => handleInputChange('output', e.target.value)}
              className="input"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-1">Total output per day</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Rate (%)
            </label>
            <input
              type="number"
              value={data.qualityRate}
              onChange={(e) => handleInputChange('qualityRate', e.target.value)}
              className="input"
              step="0.1"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">Percentage of good products</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ideal Cycle Time (minutes/unit)
            </label>
            <input
              type="number"
              value={data.idealCycleTime}
              onChange={(e) => handleInputChange('idealCycleTime', e.target.value)}
              className="input"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">Theoretical minimum cycle time</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Cycle Time (minutes/unit)
            </label>
            <input
              type="number"
              value={data.actualCycleTime}
              onChange={(e) => handleInputChange('actualCycleTime', e.target.value)}
              className="input"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">Current actual cycle time</p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="btn btn-primary mt-6"
        >
          <Calculator className="w-5 h-5" />
          Calculate OEE
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">Please correct the following errors:</h3>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`card ${result.status === 'excellent' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Overall OEE</h3>
                {getStatusIcon(result.status)}
              </div>
              <div className={`text-3xl font-bold ${getStatusColor(result.status)}`}>
                {result.oee.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">World-Class Target: 85%</p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-2">Availability</h3>
              <div className="text-2xl font-bold text-blue-600">
                {result.availability.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Target: {'>'}90%</p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
              <div className="text-2xl font-bold text-purple-600">
                {result.performanceEfficiency.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Target: {'>'}95%</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="heading-medium text-gray-800 mb-4">Time Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loading Time:</span>
                  <span className="font-semibold">{result.loadingTime.toFixed(0)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Time:</span>
                  <span className="font-semibold">{result.operatingTime.toFixed(0)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilization Rate:</span>
                  <span className="font-semibold">{result.utilizationRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TEEP:</span>
                  <span className="font-semibold">{result.teep.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="heading-medium text-gray-800 mb-4">Performance Components</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Speed Rate:</span>
                  <span className="font-semibold">{result.operatingSpeedRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Operating Rate:</span>
                  <span className="font-semibold">{result.netOperatingRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality Rate:</span>
                  <span className="font-semibold">{data.qualityRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="heading-medium text-gray-800 mb-4">Component Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={componentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ffd559" name="Actual" />
                  <Bar dataKey="target" fill="#e5e5e5" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="heading-medium text-gray-800 mb-4">OEE vs World-Class</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={oeeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ffd559" />
                  <ReferenceLine y={85} stroke="#dc2626" strokeDasharray="5 5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interpretation and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="heading-medium text-gray-800 mb-4">Interpretation</h3>
              <p className="text-gray-700 leading-relaxed">{result.interpretation}</p>
            </div>

            <div className="card">
              <h3 className="heading-medium text-gray-800 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
