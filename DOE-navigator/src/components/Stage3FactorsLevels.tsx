import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { Factor, StageValidation } from '../types';

interface Stage3FactorsLevelsProps {
  data: Factor[];
  onUpdate: (data: Factor[]) => void;
  onValidationChange: (validation: StageValidation) => void;
}

const Stage3FactorsLevels: React.FC<Stage3FactorsLevelsProps> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  const validateStage = (factors: Factor[]): StageValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (factors.length === 0) {
      errors.push('At least one factor is required');
    }

    const controllableFactors = factors.filter(f => f.type === 'controllable');
    if (controllableFactors.length === 0) {
      errors.push('At least one controllable factor is required for experimental design');
    }

    factors.forEach((factor, index) => {
      if (!factor.name.trim()) {
        errors.push(`Factor ${index + 1} name is required`);
      }

      if (factor.type === 'controllable' && factor.levels.length < 2) {
        errors.push(`Controllable factor "${factor.name}" must have at least 2 levels`);
      }

      if (factor.dataType === 'quantitative' && factor.levels.length > 0) {
        const numericLevels = factor.levels.filter(l => !isNaN(Number(l)));
        if (numericLevels.length !== factor.levels.length) {
          warnings.push(`Quantitative factor "${factor.name}" should have numeric levels`);
        }
      }

      if (factor.dataType === 'qualitative' && factor.range) {
        warnings.push(`Qualitative factor "${factor.name}" should not have numeric ranges`);
      }
    });

    if (controllableFactors.length > 8) {
      warnings.push('Many controllable factors may require a fractional factorial design. Consider screening first.');
    }

    const noiseFactors = factors.filter(f => f.type === 'noise');
    if (noiseFactors.length > 0 && controllableFactors.length > 4) {
      warnings.push('Many controllable factors plus noise factors may lead to complex designs. Consider prioritizing factors.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleUpdate = (factors: Factor[]) => {
    onUpdate(factors);
    onValidationChange(validateStage(factors));
  };

  const addFactor = () => {
    const newFactor: Factor = {
      id: Date.now().toString(),
      name: '',
      type: 'controllable',
      dataType: 'quantitative',
      levels: ['', '']
    };
    handleUpdate([...data, newFactor]);
  };

  const updateFactor = (id: string, updates: Partial<Factor>) => {
    const updatedFactors = data.map(factor =>
      factor.id === id ? { ...factor, ...updates } : factor
    );
    handleUpdate(updatedFactors);
  };

  const removeFactor = (id: string) => {
    const updatedFactors = data.filter(factor => factor.id !== id);
    handleUpdate(updatedFactors);
  };

  const addLevel = (factorId: string) => {
    const factor = data.find(f => f.id === factorId);
    if (factor) {
      const updatedLevels = [...factor.levels, ''];
      updateFactor(factorId, { levels: updatedLevels });
    }
  };

  const removeLevel = (factorId: string, levelIndex: number) => {
    const factor = data.find(f => f.id === factorId);
    if (factor && factor.levels.length > 2) {
      const updatedLevels = factor.levels.filter((_, index) => index !== levelIndex);
      updateFactor(factorId, { levels: updatedLevels });
    }
  };

  const updateLevel = (factorId: string, levelIndex: number, value: string) => {
    const factor = data.find(f => f.id === factorId);
    if (factor) {
      const updatedLevels = factor.levels.map((level, index) =>
        index === levelIndex ? value : level
      );
      updateFactor(factorId, { levels: updatedLevels });
    }
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Factors Section */}
      <div className="factor-item">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <h3 className="form-label">Factors & Levels</h3>
            <button
              onClick={() => toggleHelp('factors')}
              className="text-gray-400 hover:text-yellow-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expandedHelp === 'factors' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why this matters:</p>
                <p>
                  Factors are the variables you control and vary in your experiment. The number and type 
                  of factors determine the appropriate experimental design. More factors mean more 
                  experimental runs, so choose factors that are most likely to affect your response.
                </p>
                <p className="mt-2">
                  <strong>Key principle:</strong> "Factors should be chosen based on engineering 
                  judgment and prior knowledge. Include factors that are suspected to affect the response."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Factors List */}
        <div className="space-y-3">
          {data.map((factor, index) => (
            <div key={factor.id} className="factor-item">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Factor {index + 1}</h4>
                {data.length > 1 && (
                  <button
                    onClick={() => removeFactor(factor.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">
                    Factor Name *
                  </label>
                  <input
                    type="text"
                    value={factor.name}
                    onChange={(e) => updateFactor(factor.id, { name: e.target.value })}
                    placeholder="e.g., Temperature, Pressure, Speed"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Factor Type *
                  </label>
                  <select
                    value={factor.type}
                    onChange={(e) => updateFactor(factor.id, { 
                      type: e.target.value as 'controllable' | 'noise'
                    })}
                  >
                    <option value="controllable">Controllable (you can set this)</option>
                    <option value="noise">Noise (uncontrolled, but can be measured)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Data Type *
                  </label>
                  <select
                    value={factor.dataType}
                    onChange={(e) => updateFactor(factor.id, { 
                      dataType: e.target.value as 'quantitative' | 'qualitative'
                    })}
                  >
                    <option value="quantitative">Quantitative (numeric values)</option>
                    <option value="qualitative">Qualitative (categories/types)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={factor.unit || ''}
                    onChange={(e) => updateFactor(factor.id, { unit: e.target.value })}
                    placeholder="e.g., °C, psi, rpm"
                  />
                </div>

                {factor.dataType === 'quantitative' && (
                  <div className="form-group md:col-span-2">
                    <label className="form-label">
                      Practical Range (optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={factor.range?.min || ''}
                        onChange={(e) => updateFactor(factor.id, { 
                          range: { 
  low: factor.range?.low || 0, 
  high: factor.range?.high || 0, 
  min: parseFloat(e.target.value) || 0 
}
                        })}
                        placeholder="Min value"
                      />
                      <input
                        type="text"
                        value={factor.range?.max || ''}
                        onChange={(e) => updateFactor(factor.id, { 
                          range: { 
  low: factor.range?.low || 0, 
  high: factor.range?.high || 0, 
  max: parseFloat(e.target.value) || 0 
}
                        })}
                        placeholder="Max value"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Levels Section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label">
                    Factor Levels *
                  </label>
                  {factor.type === 'controllable' && (
                    <button
                      onClick={() => addLevel(factor.id)}
                      className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add Level
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {factor.levels.map((level, levelIndex) => (
                    <div key={levelIndex} className="level-item">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-16">
                          Level {levelIndex + 1}:
                        </span>
                        <input
                          type="text"
                          value={level}
                          onChange={(e) => updateLevel(factor.id, levelIndex, e.target.value)}
                          placeholder={
                            factor.dataType === 'quantitative' 
                              ? 'e.g., 100, 150, 200' 
                              : 'e.g., Low, Medium, High'
                          }
                          className="flex-1"
                        />
                        {factor.type === 'controllable' && factor.levels.length > 2 && (
                          <button
                            onClick={() => removeLevel(factor.id, levelIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Factor Button */}
        <div className="mt-4">
          <button
            onClick={addFactor}
            className="btn btn-secondary"
          >
            <Plus className="w-4 h-4" />
            Add Factor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage3FactorsLevels;
