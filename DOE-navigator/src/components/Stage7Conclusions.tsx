import React, { useState } from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import type { 
  ProblemDefinition, 
  DesignRecommendation, 
  ExperimentResults, 
  Conclusions, 
  NextStep,
  StageValidation 
} from '../types';

interface Stage7ConclusionsProps {
  problemDefinition: ProblemDefinition;
  design: DesignRecommendation | null;
  results: ExperimentResults | null;
  data: Conclusions | null;
  onUpdate: (data: Conclusions) => void;
  onValidationChange: (validation: StageValidation) => void;
}

const Stage7Conclusions: React.FC<Stage7ConclusionsProps> = ({
  problemDefinition,
  design,
  results,
  data,
  onUpdate,
  onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  const defaultConclusions: Conclusions = {
    summary: '',
    objectiveAchieved: false,
    significantFindings: [],
    practicalImplications: [],
    nextSteps: [],
    confirmationNeeded: false
  };

  const conclusions = data || defaultConclusions;

  const validateStage = (conclusionData: Conclusions): StageValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!conclusionData.summary.trim()) {
      errors.push('Summary of findings is required');
    }

    if (conclusionData.significantFindings.length === 0) {
      warnings.push('Consider adding significant findings from your analysis');
    }

    if (conclusionData.nextSteps.length === 0) {
      warnings.push('Consider adding next steps for continued improvement');
    }

    if (!results || !results.analysisComplete) {
      errors.push('Analysis must be completed before drawing conclusions');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleUpdate = (updates: Partial<Conclusions>) => {
    const newConclusions = { ...conclusions, ...updates };
    onUpdate(newConclusions);
    onValidationChange(validateStage(newConclusions));
  };

  const addSignificantFinding = () => {
    handleUpdate({
      significantFindings: [...conclusions.significantFindings, '']
    });
  };

  const updateSignificantFinding = (index: number, value: string) => {
    const newFindings = [...conclusions.significantFindings];
    newFindings[index] = value;
    handleUpdate({ significantFindings: newFindings });
  };

  const removeSignificantFinding = (index: number) => {
    const newFindings = conclusions.significantFindings.filter((_, i) => i !== index);
    handleUpdate({ significantFindings: newFindings });
  };

  const addPracticalImplication = () => {
    handleUpdate({
      practicalImplications: [...conclusions.practicalImplications, '']
    });
  };

  const updatePracticalImplication = (index: number, value: string) => {
    const newImplications = [...conclusions.practicalImplications];
    newImplications[index] = value;
    handleUpdate({ practicalImplications: newImplications });
  };

  const removePracticalImplication = (index: number) => {
    const newImplications = conclusions.practicalImplications.filter((_, i) => i !== index);
    handleUpdate({ practicalImplications: newImplications });
  };

  const addNextStep = () => {
    const newStep: NextStep = {
      type: 'confirmation',
      description: '',
      priority: 'medium'
    };
    handleUpdate({
      nextSteps: [...conclusions.nextSteps, newStep]
    });
  };

  const updateNextStep = (index: number, updates: Partial<NextStep>) => {
    const newSteps = [...conclusions.nextSteps];
    newSteps[index] = { ...newSteps[index], ...updates };
    handleUpdate({ nextSteps: newSteps });
  };

  const removeNextStep = (index: number) => {
    const newSteps = conclusions.nextSteps.filter((_, i) => i !== index);
    handleUpdate({ nextSteps: newSteps });
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  const getObjectiveStatusColor = () => {
    if (conclusions.objectiveAchieved) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!results || !results.analysisComplete) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Conclusions & Next Steps</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Please complete the statistical analysis in Stage 6 before drawing conclusions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Conclusions & Next Steps</h2>
        </div>
        
        <div className="space-y-6">
          {/* Objective Achievement */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Objective Achievement</h3>
              <button
                onClick={() => toggleHelp('objective')}
                className="text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {expandedHelp === 'objective' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Why this matters:</p>
                  <p>
                    Revisit your original objective from Stage 1. Did you achieve what you set out to learn? 
                    This assessment helps determine if the experiment was successful and what follow-up actions are needed.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Original Objective</h4>
                  <p className="text-sm text-gray-600 mt-1">{problemDefinition.objectiveDescription}</p>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${getObjectiveStatusColor()}`}>
                    {conclusions.objectiveAchieved ? 'Achieved' : 'Partially Achieved'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="objectiveAchieved"
                  checked={conclusions.objectiveAchieved}
                  onChange={(e) => handleUpdate({ objectiveAchieved: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="objectiveAchieved" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Objective was achieved
                </label>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="font-medium text-gray-900">Executive Summary</label>
              <button
                onClick={() => toggleHelp('summary')}
                className="text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {expandedHelp === 'summary' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What to include:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>What you learned from the experiment</li>
                    <li>Key factors that affect the response</li>
                    <li>Recommended optimal settings (if applicable)</li>
                    <li>Quantified improvements or insights</li>
                  </ul>
                </div>
              </div>
            )}

            <textarea
              value={conclusions.summary}
              onChange={(e) => handleUpdate({ summary: e.target.value })}
              placeholder="Summarize your key findings in plain language. What did you learn? What factors are important? What are the recommended actions?"
              className="w-full h-32 resize-none"
            />
          </div>

          {/* Significant Findings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Significant Findings</h4>
              <button
                onClick={addSignificantFinding}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add Finding
              </button>
            </div>

            <div className="space-y-2">
              {conclusions.significantFindings.map((finding, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={finding}
                    onChange={(e) => updateSignificantFinding(index, e.target.value)}
                    placeholder="e.g., Temperature has a significant positive effect on yield (p < 0.05)"
                    className="flex-1"
                  />
                  {conclusions.significantFindings.length > 1 && (
                    <button
                      onClick={() => removeSignificantFinding(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {conclusions.significantFindings.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  List the statistically significant findings from your analysis
                </p>
              )}
            </div>
          </div>

          {/* Practical Implications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Practical Implications</h4>
              <button
                onClick={addPracticalImplication}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add Implication
              </button>
            </div>

            <div className="space-y-2">
              {conclusions.practicalImplications.map((implication, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={implication}
                    onChange={(e) => updatePracticalImplication(index, e.target.value)}
                    placeholder="e.g., Increase temperature by 10°C to improve yield by 5%"
                    className="flex-1"
                  />
                  {conclusions.practicalImplications.length > 1 && (
                    <button
                      onClick={() => removePracticalImplication(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {conclusions.practicalImplications.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  What do these findings mean for your process or business?
                </p>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Next Steps</h4>
              <button
                onClick={addNextStep}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add Next Step
              </button>
            </div>

            <div className="space-y-3">
              {conclusions.nextSteps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => updateNextStep(index, { description: e.target.value })}
                        placeholder="Describe the next step..."
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={step.type}
                        onChange={(e) => updateNextStep(index, { type: e.target.value as any })}
                        className="flex-1 text-sm"
                      >
                        <option value="confirmation">Confirmation</option>
                        <option value="optimization">Optimization</option>
                        <option value="augmentation">Augmentation</option>
                        <option value="new-experiment">New Experiment</option>
                      </select>
                      <select
                        value={step.priority}
                        onChange={(e) => updateNextStep(index, { priority: e.target.value as any })}
                        className="flex-1 text-sm"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      {conclusions.nextSteps.length > 1 && (
                        <button
                          onClick={() => removeNextStep(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {conclusions.nextSteps.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  What follow-up actions are needed? Consider confirmation runs, optimization studies, or new experiments.
                </p>
              )}
            </div>
          </div>

          {/* Confirmation Needed */}
          <div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="confirmationNeeded"
                checked={conclusions.confirmationNeeded}
                onChange={(e) => handleUpdate({ confirmationNeeded: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="confirmationNeeded" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Confirmation runs needed before implementation
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended when implementing significant process changes
            </p>
          </div>

          {/* Key Principles */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Montgomery's Key Principles</h4>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>
                <strong>Iterative Learning:</strong> "Experiments are usually iterative. The first experiment should use no more than 25% of your total resource budget — leave room to learn and refine."
              </p>
              <p>
                <strong>Statistical vs. Practical:</strong> "Statistical significance is not the same as practical importance. Always interpret results in the context of the engineering or business problem."
              </p>
              <p>
                <strong>Documentation:</strong> Document your experiment thoroughly for future reference and organizational learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stage7Conclusions;
