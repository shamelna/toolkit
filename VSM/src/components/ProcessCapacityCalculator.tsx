import React, { useState, useEffect } from 'react';
import { Users, Calculator, Clock, TrendingUp, Info } from 'lucide-react';

interface ProcessCapacityResult {
  processCapacity: number;
  operatorsNeeded: number;
  maxWorkContent: number;
  utilizationRate: number;
}

interface ProcessStep {
  name: string;
  cycleTime: number;
  setupTime: number;
  uptime: number;
}

export default function ProcessCapacityCalculator() {
  const [availableTime, setAvailableTime] = useState<string>('27600');
  const [taktTime, setTaktTime] = useState<string>('60');
  const [totalWorkContent, setTotalWorkContent] = useState<string>('187');
  const [bufferTime, setBufferTime] = useState<string>('4');
  const [numOperators, setNumOperators] = useState<string>('3');
  const [steps, setSteps] = useState<ProcessStep[]>([
    { name: 'Step 1', cycleTime: 1, setupTime: 0, uptime: 85 },
    { name: 'Step 2', cycleTime: 39, setupTime: 0, uptime: 85 },
    { name: 'Step 3', cycleTime: 46, setupTime: 0, uptime: 85 },
    { name: 'Step 4', cycleTime: 62, setupTime: 0, uptime: 85 },
    { name: 'Step 5', cycleTime: 40, setupTime: 0, uptime: 85 },
  ]);
  const [result, setResult] = useState<ProcessCapacityResult | null>(null);

  const calculateCapacity = () => {
    const available = parseFloat(availableTime) || 0;
    const takt = parseFloat(taktTime) || 1;
    const workContent = parseFloat(totalWorkContent) || 0;
    const buffer = parseFloat(bufferTime) || 0;
    const operators = parseFloat(numOperators) || 1;

    // Calculate process capacity for first step (bottleneck)
    const firstStep = steps[0];
    const processCapacity = (available / firstStep.cycleTime) * (firstStep.uptime / 100);

    // Calculate operators needed
    const operatorsNeeded = workContent / takt;

    // Calculate max work content per operator
    const maxWorkContent = (takt - buffer) * operators;

    // Calculate utilization rate
    const utilizationRate = (workContent / (takt * operators)) * 100;

    setResult({
      processCapacity,
      operatorsNeeded,
      maxWorkContent,
      utilizationRate,
    });
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateCapacity();
  }, [availableTime, taktTime, totalWorkContent, bufferTime, numOperators]);

  const updateStep = (index: number, field: keyof ProcessStep, value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps, [field]: value };
    setSteps(newSteps);
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Users className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">Process Capacity Calculator</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Determine operator requirements and utilization
          </p>
          <div className="text-small text-muted mt-2">
            Book Reference: "VSM Guide"
          </div>
        </div>

        <div className="grid-2">
          {/* Input Section */}
          <div className="card">
            <h2 className="heading-medium mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-3" style={{ color: '#4CAF50' }} />
              Input Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-small font-bold mb-2">
                  Available Working Time (seconds)
                </label>
                <input
                  type="number"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 27,600"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Takt Time (seconds per piece)
                </label>
                <input
                  type="number"
                  value={taktTime}
                  onChange={(e) => setTaktTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 60"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Total Work Content (seconds)
                </label>
                <input
                  type="number"
                  value={totalWorkContent}
                  onChange={(e) => setTotalWorkContent(e.target.value)}
                  className="input"
                  placeholder="e.g., 187"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Buffer Time (seconds)
                </label>
                <input
                  type="number"
                  value={bufferTime}
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 4"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Number of Operators
                </label>
                <input
                  type="number"
                  value={numOperators}
                  onChange={(e) => setNumOperators(e.target.value)}
                  className="input"
                  placeholder="e.g., 3"
                />
              </div>

              <button
                onClick={calculateCapacity}
                className="btn-primary w-full"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Capacity Metrics
              </button>
            </div>
          </div>

          {/* Process Steps Section */}
          <div className="card">
            <h2 className="heading-medium mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3" style={{ color: '#2196F3' }} />
              Process Steps
            </h2>
            
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 className="text-small font-bold" style={{ flex: 1 }}>{step.name}</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={step.cycleTime}
                        onChange={(e) => updateStep(index, 'cycleTime', parseFloat(e.target.value) || 0)}
                        className="input"
                        placeholder="Cycle Time"
                        style={{ width: '100px' }}
                      />
                      <input
                        type="number"
                        value={step.setupTime}
                        onChange={(e) => updateStep(index, 'setupTime', parseFloat(e.target.value) || 0)}
                        className="input"
                        placeholder="Setup Time"
                        style={{ width: '100px' }}
                      />
                      <input
                        type="number"
                        value={step.uptime}
                        onChange={(e) => updateStep(index, 'uptime', parseFloat(e.target.value) || 0)}
                        className="input"
                        placeholder="Uptime %"
                        style={{ width: '100px' }}
                      />
                    </div>
                  </div>
                  <div className="text-small text-muted">
                    Cycle Time: {step.cycleTime} sec | Setup Time: {step.setupTime} sec | Uptime: {step.uptime}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <h2 className="heading-medium mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#DC2626' }} />
            Calculation Results
          </h2>

          {result ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid-3" style={{ gap: '20px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Process Capacity</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.processCapacity.toFixed(0)}
                  </div>
                  <div className="text-small text-muted">pieces/shift</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Operators Needed</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.operatorsNeeded.toFixed(1)}
                  </div>
                  <div className="text-small text-muted">operators</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Max Work Content/Operator</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.maxWorkContent.toFixed(0)}
                  </div>
                  <div className="text-small text-muted">seconds</div>
                </div>
              </div>

              {/* Utilization Rate */}
              <div className="card" style={{ 
                background: 'rgba(255, 213, 89, 0.1)', 
                border: '2px solid #ffd559',
                textAlign: 'center'
              }}>
                <h3 className="heading-medium mb-3" style={{ color: '#1a1a1a' }}>Utilization Rate</h3>
                <div className="text-center">
                  <div className="heading-display" style={{ fontSize: '48px', color: '#1a1a1a' }}>
                    {result.utilizationRate.toFixed(1)}%
                  </div>
                  <div className="text-small mt-2">
                    {parseFloat(totalWorkContent) || 0} sec ÷ ({result.operatorsNeeded.toFixed(1)} operators × {parseFloat(taktTime) || 0} sec)
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="card" style={{ 
                background: '#f8f9fa', 
                border: '1px solid #2196F3'
              }}>
                <h4 className="heading-small mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" style={{ color: '#2196F3' }} />
                  What this means:
                </h4>
                <div className="text-body text-muted">
                  <p className="mb-2">
                    <strong>Process Capacity:</strong> Your bottleneck process can produce {result.processCapacity.toFixed(0)} pieces per shift.
                  </p>
                  <p className="mb-2">
                    <strong>Operators Needed:</strong> You need {result.operatorsNeeded.toFixed(1)} operators to meet takt time.
                  </p>
                  <p className="mb-2">
                    <strong>Max Work Content:</strong> Each operator should handle no more than {result.maxWorkContent.toFixed(0)} seconds of work.
                  </p>
                  <p>
                    <strong>Utilization Rate:</strong> Your operators are working at {result.utilizationRate.toFixed(1)}% of their capacity.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter your parameters to see capacity calculations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
