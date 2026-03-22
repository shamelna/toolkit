import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Shuffle } from 'lucide-react';
import type { ExecutionPlan, DesignRecommendation, Factor, StageValidation } from '../types';

interface Stage5ExecutionPlanningProps {
  design: DesignRecommendation | null;
  factors: Factor[];
  data: ExecutionPlan | null;
  onUpdate: (data: ExecutionPlan) => void;
  onValidationChange: (validation: StageValidation) => void;
}

const Stage5ExecutionPlanning: React.FC<Stage5ExecutionPlanningProps> = ({
  design,
  factors,
  data,
  onUpdate,
  onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  const defaultPlan: ExecutionPlan = {
    replicates: 1,
    randomization: true,
    blocking: false,
    centerPoints: design?.supportsCenterPoints ? 4 : 0,
    dataCollectionPlan: '',
    riskMitigation: []
  };

  const plan = data || defaultPlan;

  const validateStage = (executionPlan: ExecutionPlan): StageValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!design) {
      errors.push('No design selected. Please complete Stage 4 first.');
      return { isValid: false, errors, warnings };
    }

    if (executionPlan.replicates < 1) {
      errors.push('Number of replicates must be at least 1');
    }

    if (executionPlan.replicates > 5) {
      warnings.push('High number of replicates may be resource-intensive. Consider if this is necessary.');
    }

    if (!executionPlan.dataCollectionPlan.trim()) {
      errors.push('Data collection plan is required');
    }

    const totalRuns = design.runsRequired * executionPlan.replicates + executionPlan.centerPoints;
    
    if (totalRuns > 100) {
      warnings.push(`This experiment requires ${totalRuns} total runs. Ensure you have adequate resources and time.`);
    }

    if (executionPlan.blocking && !design.supportsBlocking) {
      warnings.push('Blocking is not supported by the selected design type');
    }

    if (executionPlan.centerPoints > 0 && !design.supportsCenterPoints) {
      warnings.push('Center points are not supported by the selected design type');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleUpdate = (updates: Partial<ExecutionPlan>) => {
    const newPlan = { ...plan, ...updates };
    onUpdate(newPlan);
    onValidationChange(validateStage(newPlan));
  };

  const addRiskMitigation = () => {
    handleUpdate({
      riskMitigation: [...plan.riskMitigation, '']
    });
  };

  const updateRiskMitigation = (index: number, value: string) => {
    const newRisks = [...plan.riskMitigation];
    newRisks[index] = value;
    handleUpdate({ riskMitigation: newRisks });
  };

  const removeRiskMitigation = (index: number) => {
    const newRisks = plan.riskMitigation.filter((_, i) => i !== index);
    handleUpdate({ riskMitigation: newRisks });
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  const calculateTotalRuns = () => {
    if (!design) return 0;
    return design.runsRequired * plan.replicates + plan.centerPoints;
  };

  const getNoiseFactors = () => factors.filter(f => f.type === 'noise');

  if (!design) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Execution Planning</h2>
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
          <h2 className="card-title">Execution Planning</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{design.runsRequired}</div>
                <div className="text-sm text-gray-600">Base Runs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{calculateTotalRuns()}</div>
                <div className="text-sm text-gray-600">Total Runs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{plan.replicates}</div>
                <div className="text-sm text-gray-600">Replicates</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="font-medium text-gray-900">Replicates</label>
                <button
                  onClick={() => toggleHelp('replicates')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'replicates' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why replicates matter:</p>
                    <p>
                      Replication provides an estimate of experimental error and increases statistical power. 
                      More replicates give more precise estimates but require more resources.
                    </p>
                  </div>
                </div>
              )}

              <input
                type="number"
                min="1"
                max="10"
                value={plan.replicates}
                onChange={(e) => handleUpdate({ replicates: parseInt(e.target.value) || 1 })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of times each design point is repeated independently
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="font-medium text-gray-900">Center Points</label>
                <button
                  onClick={() => toggleHelp('centerPoints')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'centerPoints' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why center points matter:</p>
                    <p>
                      Center points test for curvature and provide an independent estimate of pure error. 
                      Recommended for quantitative factors to check if linear model is adequate.
                    </p>
                  </div>
                </div>
              )}

              <input
                type="number"
                min="0"
                max="10"
                value={plan.centerPoints}
                onChange={(e) => handleUpdate({ centerPoints: parseInt(e.target.value) || 0 })}
                disabled={!design.supportsCenterPoints}
                className="w-full disabled:bg-gray-100"
              />
              {!design.supportsCenterPoints && (
                <p className="text-xs text-gray-500 mt-1">
                  Not supported by selected design
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="font-medium text-gray-900">Randomization</label>
                <button
                  onClick={() => toggleHelp('randomization')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'randomization' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why randomization matters:</p>
                    <p>
                      Randomization protects against unknown sources of variation and ensures valid statistical inference. 
                      Always randomize run order unless there are strong practical constraints.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="randomization"
                  checked={plan.randomization}
                  onChange={(e) => handleUpdate({ randomization: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="randomization" className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4" />
                  Randomize run order
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="font-medium text-gray-900">Blocking</label>
                <button
                  onClick={() => toggleHelp('blocking')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {expandedHelp === 'blocking' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why blocking matters:</p>
                    <p>
                      Blocking eliminates known sources of variation (like batches, operators, or time periods) 
                      to increase experimental precision. Use when you can identify nuisance factors.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="blocking"
                    checked={plan.blocking}
                    onChange={(e) => handleUpdate({ blocking: e.target.checked })}
                    disabled={!design.supportsBlocking}
                    className="w-4 h-4"
                  />
                  <label htmlFor="blocking">Use blocking</label>
                </div>

                {plan.blocking && design.supportsBlocking && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blocking Variable
                    </label>
                    <select
                      value={plan.blockVariable || ''}
                      onChange={(e) => handleUpdate({ blockVariable: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Select blocking variable</option>
                      {getNoiseFactors().map(factor => (
                        <option key={factor.id} value={factor.name}>
                          {factor.name}
                        </option>
                      ))}
                      <option value="time">Time periods</option>
                      <option value="batch">Batches</option>
                      <option value="operator">Operators</option>
                      <option value="equipment">Equipment</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="font-medium text-gray-900">Data Collection Plan</label>
              <button
                onClick={() => toggleHelp('dataCollection')}
                className="text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {expandedHelp === 'dataCollection' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What to include:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Who will collect data and their training</li>
                    <li>Measurement procedures and equipment</li>
                    <li>Data recording methods and formats</li>
                    <li>Quality control checks</li>
                    <li>Timeline and schedule</li>
                  </ul>
                </div>
              </div>
            )}

            <textarea
              value={plan.dataCollectionPlan}
              onChange={(e) => handleUpdate({ dataCollectionPlan: e.target.value })}
              placeholder="Describe how data will be collected: who, what, when, where, and how. Include measurement procedures, equipment calibration, data recording methods, and quality control measures."
              className="w-full h-32 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">Risk Mitigation</label>
              <button
                onClick={addRiskMitigation}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Risk
              </button>
            </div>

            <div className="space-y-2">
              {plan.riskMitigation.map((risk, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={risk}
                    onChange={(e) => updateRiskMitigation(index, e.target.value)}
                    placeholder="e.g., Equipment failure - have backup equipment ready"
                    className="flex-1"
                  />
                  {plan.riskMitigation.length > 1 && (
                    <button
                      onClick={() => removeRiskMitigation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {plan.riskMitigation.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  Consider potential risks and how to mitigate them (equipment failure, material shortages, operator errors, etc.)
                </p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-3">Key Planning Principles</h4>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>
                <strong>Montgomery's Principle:</strong> "The most common mistake in experimentation is conducting the experiment without adequate planning. If you design it carefully, the analysis almost analyzes itself."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-medium mb-1">Before Starting:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Verify all equipment is calibrated</li>
                    <li>Train all personnel on procedures</li>
                    <li>Prepare data collection forms</li>
                    <li>Test the measurement system</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">During Execution:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Follow the randomized run order</li>
                    <li>Document any deviations</li>
                    <li>Monitor for unexpected events</li>
                    <li>Perform regular quality checks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stage5ExecutionPlanning;
