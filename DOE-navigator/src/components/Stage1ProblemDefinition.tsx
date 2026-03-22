import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { ProblemDefinition, ObjectiveType, StageValidation } from '../types';

interface Stage1ProblemDefinitionProps {
  data: ProblemDefinition;
  onUpdate: (data: ProblemDefinition) => void;
  onValidationChange: (validation: StageValidation) => void;
}

const objectiveDescriptions: Record<ObjectiveType, { title: string; description: string; suitableFor: string }> = {
  screening: {
    title: 'Screening / Characterization',
    description: 'I have many factors and want to find which ones actually matter',
    suitableFor: 'Early-stage experimentation with 5+ factors, limited prior knowledge'
  },
  optimization: {
    title: 'Optimization',
    description: 'I know my key factors; I want to find the best settings',
    suitableFor: 'When you have identified important factors and need optimal levels'
  },
  comparison: {
    title: 'Comparison',
    description: 'I want to compare two or more treatments, methods, or conditions',
    suitableFor: 'Comparing existing processes, materials, or methods'
  },
  confirmation: {
    title: 'Confirmation',
    description: 'I want to verify that a known solution works as expected',
    suitableFor: 'Validating previous findings or implementing known improvements'
  },
  discovery: {
    title: 'Discovery / Exploration',
    description: 'I\'m exploring new territory with no strong prior hypothesis',
    suitableFor: 'New product development, process innovation, research'
  },
  robustness: {
    title: 'Robustness',
    description: 'I want my process to be insensitive to noise factors I can\'t control',
    suitableFor: 'Making processes reliable despite environmental variation'
  }
};

const Stage1ProblemDefinition: React.FC<Stage1ProblemDefinitionProps> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  const validateStage = (problemData: ProblemDefinition): StageValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!problemData.processDescription.trim()) {
      errors.push('Process description is required');
    } else if (problemData.processDescription.length < 20) {
      warnings.push('Process description seems very brief - consider adding more detail');
    }

    if (!problemData.objective) {
      errors.push('Please select an objective type');
    }

    if (!problemData.objectiveDescription.trim()) {
      errors.push('Objective description is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleUpdate = (updates: Partial<ProblemDefinition>) => {
    const newData = { ...data, ...updates };
    onUpdate(newData);
    onValidationChange(validateStage(newData));
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Process Description Section */}
      <div className="factor-item">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <label htmlFor="process" className="form-label">
              Process or System Description
            </label>
            <button
              onClick={() => toggleHelp('process')}
              className="text-gray-400 hover:text-yellow-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {expandedHelp === 'process' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why this matters:</p>
                <p>
                  A clear problem statement is the single most important pre-experimental step. 
                  Experiments designed without a clear objective waste time, money, and run quota. 
                  Montgomery emphasizes: "A clear statement of the problem often contributes substantially 
                  to better understanding of the phenomenon being studied."
                </p>
              </div>
            </div>
          </div>
        )}
        
        <textarea
          id="process"
          value={data.processDescription}
          onChange={(e) => handleUpdate({ processDescription: e.target.value })}
          placeholder="Describe the process, system, or product you are studying. What does it do? What are the key characteristics?"
          className="w-full h-24 resize-none"
        />
      </div>

      {/* Objective Type Selection */}
      <div className="factor-item">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <label className="form-label">
              What is your broad objective?
            </label>
            <button
              onClick={() => toggleHelp('objective')}
              className="text-gray-400 hover:text-yellow-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expandedHelp === 'objective' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why this matters:</p>
                <p>
                  Your objective determines the appropriate experimental design. 
                  Different objectives require different approaches - screening experiments 
                  need different designs than optimization studies. Choose the objective 
                  that best matches what you want to learn.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(objectiveDescriptions).map(([key, info]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                data.objective === key
                  ? 'border-yellow-500 bg-yellow-50 shadow-md'
                  : 'border-gray-200 hover:border-yellow-300 hover:shadow-sm'
              }`}
              onClick={() => handleUpdate({ objective: key as ObjectiveType })}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="objective"
                  value={key}
                  checked={data.objective === key}
                  onChange={() => handleUpdate({ objective: key as ObjectiveType })}
                  className="mt-1 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {info.description}
                  </p>
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Best for:</strong> {info.suitableFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specific Objective Description */}
      <div className="factor-item">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <label htmlFor="objectiveDesc" className="form-label">
              Describe your specific objective
            </label>
            <button
              onClick={() => toggleHelp('specific')}
              className="text-gray-400 hover:text-yellow-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expandedHelp === 'specific' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why this matters:</p>
                <p>
                  Be specific about what you want to achieve. Instead of "improve quality," 
                  try "reduce defect rate from 5% to less than 1%" or "increase yield by 15%." 
                  Specific objectives help determine appropriate sample sizes and success criteria.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <textarea
          id="objectiveDesc"
          value={data.objectiveDescription}
          onChange={(e) => handleUpdate({ objectiveDescription: e.target.value })}
          placeholder="What specifically do you want to achieve? Be as concrete as possible."
          className="w-full h-20 resize-none"
        />
      </div>
    </div>
  );
};

export default Stage1ProblemDefinition;
