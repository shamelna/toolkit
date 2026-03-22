import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { ResponseVariable, StageValidation } from '../types';

interface Stage2ResponseVariablesProps {
  data: ResponseVariable[];
  onUpdate: (data: ResponseVariable[]) => void;
  onValidationChange: (validation: StageValidation) => void;
}

const Stage2ResponseVariables: React.FC<Stage2ResponseVariablesProps> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  const validateStage = (variables: ResponseVariable[]): StageValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (variables.length === 0) {
      errors.push('At least one response variable is required');
    }

    variables.forEach((variable, index) => {
      if (!variable.name.trim()) {
        errors.push(`Response variable ${index + 1} name is required`);
      }
      
      if (!variable.measurementMethod.trim()) {
        errors.push(`Response variable ${index + 1} measurement method is required`);
      }

      if (variable.type === 'continuous' && !variable.unit) {
        warnings.push(`Consider specifying units for continuous variable "${variable.name}"`);
      }

      if (variable.type === 'discrete' && variable.distribution === 'normal') {
        warnings.push(`Discrete variable "${variable.name}" is unlikely to be normally distributed`);
      }
    });

    if (variables.length > 3) {
      warnings.push('Multiple response variables can complicate analysis. Consider focusing on the most important ones.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleUpdate = (variables: ResponseVariable[]) => {
    onUpdate(variables);
    onValidationChange(validateStage(variables));
  };

  const addVariable = () => {
    const newVariable: ResponseVariable = {
      id: Date.now().toString(),
      name: '',
      type: 'continuous',
      measurementMethod: '',
      unit: ''
    };
    handleUpdate([...data, newVariable]);
  };

  const updateVariable = (id: string, updates: Partial<ResponseVariable>) => {
    const updatedVariables = data.map(variable =>
      variable.id === id ? { ...variable, ...updates } : variable
    );
    handleUpdate(updatedVariables);
  };

  const removeVariable = (id: string) => {
    const updatedVariables = data.filter(variable => variable.id !== id);
    handleUpdate(updatedVariables);
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Response Variables Section */}
      <div className="factor-item">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <h3 className="form-label">Response Variables</h3>
            <button
              onClick={() => toggleHelp('response')}
              className="text-gray-400 hover:text-yellow-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expandedHelp === 'response' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why this matters:</p>
                <p>
                  The response variable is what you measure to determine if your experiment was successful. 
                  It must be defined before choosing a design because different types of responses 
                  (continuous vs. discrete) require different analytical approaches.
                </p>
                <p className="mt-2">
                  <strong>Key principle:</strong> "The response variable must be measured on a numerical scale. 
                  Quantitative responses are preferred because they give more information per experimental run."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Response Variables List */}
        <div className="space-y-3">
          {data.map((variable, index) => (
            <div key={variable.id} className="response-item">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Response Variable {index + 1}</h4>
                {data.length > 1 && (
                  <button
                    onClick={() => removeVariable(variable.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">
                    Variable Name *
                  </label>
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                    placeholder="e.g., Yield, Defect Rate, Strength"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Variable Type *
                  </label>
                  <select
                    value={variable.type}
                    onChange={(e) => updateVariable(variable.id, { 
                      type: e.target.value as 'continuous' | 'discrete',
                      distribution: e.target.value === 'continuous' ? 'normal' : undefined
                    })}
                  >
                    <option value="continuous">Continuous (measurable on a scale)</option>
                    <option value="discrete">Discrete (count, pass/fail, categorical)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Distribution
                  </label>
                  <select
                    value={variable.distribution || ''}
                    onChange={(e) => updateVariable(variable.id, { 
                      distribution: e.target.value as 'normal' | 'skewed' | 'count' | undefined
                    })}
                  >
                    <option value="">Select distribution</option>
                    {variable.type === 'continuous' && (
                      <>
                        <option value="normal">Normal</option>
                        <option value="skewed">Skewed</option>
                      </>
                    )}
                    {variable.type === 'discrete' && (
                      <>
                        <option value="count">Count (Poisson)</option>
                        <option value="binomial">Binomial</option>
                        <option value="normal">Approximately Normal</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={variable.unit || ''}
                    onChange={(e) => updateVariable(variable.id, { unit: e.target.value })}
                    placeholder="e.g., %, mm, kg, count"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Target/Specification
                  </label>
                  <input
                    type="text"
                    value={variable.target || ''}
                    onChange={(e) => updateVariable(variable.id, { target: e.target.value })}
                    placeholder="e.g., >95%, <0.5mm, 100±5kg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Measurement Method *
                  </label>
                  <input
                    type="text"
                    value={variable.measurementMethod}
                    onChange={(e) => updateVariable(variable.id, { measurementMethod: e.target.value })}
                    placeholder="How will you measure this variable?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Variable Button */}
        <div className="mt-4">
          <button
            onClick={addVariable}
            className="btn btn-secondary"
          >
            <Plus className="w-4 h-4" />
            Add Response Variable
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage2ResponseVariables;
