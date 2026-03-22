import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { DesignRecommendationEngine } from '../utils/designRecommendationEngine';
import type { 
  ProblemDefinition, 
  ResponseVariable, 
  Factor, 
  DesignRecommendation, 
  StageValidation 
} from '../types';

interface Stage4DesignRecommendationProps {
  problemDefinition: ProblemDefinition;
  responseVariables: ResponseVariable[];
  factors: Factor[];
  data: DesignRecommendation | null;
  onUpdate: (data: DesignRecommendation) => void;
  onValidationChange: (validation: StageValidation) => void;
}

const Stage4DesignRecommendation: React.FC<Stage4DesignRecommendationProps> = ({
  problemDefinition,
  responseVariables,
  factors,
  data,
  onUpdate,
  onValidationChange
}) => {
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<DesignRecommendation | null>(data);

  useEffect(() => {
    const newRecommendation = DesignRecommendationEngine.recommendDesign(
      problemDefinition,
      responseVariables,
      factors
    );
    
    if (newRecommendation && !data) {
      setRecommendation(newRecommendation);
      onUpdate(newRecommendation);
    }
  }, [problemDefinition, responseVariables, factors]);

  useEffect(() => {
    const validation = validateStage(recommendation);
    onValidationChange(validation);
  }, [recommendation]);

  const validateStage = (design: DesignRecommendation | null): StageValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!design) {
      errors.push('No design recommendation available');
      return { isValid: false, errors, warnings };
    }

    const controllableFactors = factors.filter(f => f.type === 'controllable');
    
    if (design.runsRequired > 50) {
      warnings.push(`This design requires ${design.runsRequired} runs. Consider if this is feasible within your resource constraints.`);
    }

    if (design.type === 'full-factorial' && controllableFactors.length > 4) {
      warnings.push('Full factorial with many factors may be resource-intensive. Consider a fractional design.');
    }

    if (design.type === 'fractional-factorial' && problemDefinition.objective === 'optimization') {
      warnings.push('Fractional factorial designs may not provide sufficient information for optimization. Consider a response surface design.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const toggleHelp = (section: string) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  if (!recommendation) {
    return (
      <div className="space-y-4">
        <div className="factor-item">
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Generate Design Recommendation
            </h3>
            <p className="text-gray-600">
              Please complete the previous stages (Problem Definition, Response Variables, and Factors & Levels) 
              to receive a design recommendation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Design Recommendation */}
      <div className="factor-item">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <h3 className="form-label">Recommended Design</h3>
            <button
              onClick={() => toggleHelp('design')}
              className="text-gray-400 hover:text-yellow-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expandedHelp === 'design' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why this matters:</p>
                <p>
                  The experimental design determines how you'll structure your runs to efficiently 
                  collect data. Different designs have different strengths - some are good for screening, 
                  others for optimization. The recommendation is based on your objectives and constraints.
                </p>
                <p className="mt-2">
                  <strong>Key principle:</strong> "The choice of experimental design is crucial for 
                  the efficiency and effectiveness of the experiment."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Design Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {recommendation.type === 'full-factorial' && 'Full Factorial Design'}
                {recommendation.type === 'fractional-factorial' && 'Fractional Factorial Design'}
                {recommendation.type === 'response-surface' && 'Response Surface Design'}
                {recommendation.type === 'taguchi' && 'Taguchi Design'}
                {recommendation.type === 'plackett-burman' && 'Plackett-Burman Design'}
              </h4>
              <p className="text-gray-700 mb-3">
                {recommendation.justification}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded p-2">
                  <span className="font-medium">Runs Required:</span>
                  <span className="ml-2 text-yellow-600 font-bold">{recommendation.runsRequired}</span>
                </div>
                <div className="bg-white rounded p-2">
                  <span className="font-medium">Resolution:</span>
                  <span className="ml-2 text-gray-700">{recommendation.resolution || 'N/A'}</span>
                </div>
                <div className="bg-white rounded p-2">
                  <span className="font-medium">Efficiency:</span>
                  <span className="ml-2 text-green-600">{recommendation.efficiency || 'High'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-4">
          <h5 className="font-semibold text-gray-900 mb-2">Design Capabilities</h5>
          <div className="space-y-2">
            {(recommendation as any).capabilities?.map((capability: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">{capability}</span>
              </div>
            ))}
            {(!(recommendation as any).capabilities || (recommendation as any).capabilities.length === 0) && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">Efficient experimental design for your objectives</span>
              </div>
            )}
          </div>
        </div>

        {/* Limitations */}
        <div className="mb-4">
          <h5 className="font-semibold text-gray-900 mb-2">Design Limitations</h5>
          <div className="space-y-2">
            {(recommendation as any).limitations?.map((limitation: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <span className="text-sm text-gray-700">{limitation}</span>
              </div>
            ))}
            {(!(recommendation as any).limitations || (recommendation as any).limitations.length === 0) && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <span className="text-sm text-gray-700">Resource requirements may be significant for large experiments</span>
              </div>
            )}
          </div>
        </div>

        {/* Assumptions */}
        <div className="mb-4">
          <h5 className="font-semibold text-gray-900 mb-2">Key Assumptions</h5>
          <div className="space-y-2">
            {(recommendation as any).assumptions?.map((assumption: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <span className="text-sm text-gray-700">{assumption}</span>
              </div>
            ))}
            {(!(recommendation as any).assumptions || (recommendation as any).assumptions.length === 0) && (
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <span className="text-sm text-gray-700">Factors are controllable and measurable within specified ranges</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Design Matrix Preview */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Design Matrix Preview</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Run
                </th>
                {factors.filter(f => f.type === 'controllable').map((factor) => (
                  <th key={factor.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    {factor.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(recommendation as any).designMatrix?.slice(0, 10).map((row: any[], rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-b">
                    {rowIndex + 1}
                  </td>
                  {row.map((value: any, colIndex: number) => (
                    <td key={colIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-b">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!(recommendation as any).designMatrix || (recommendation as any).designMatrix.length === 0 ? (
          <p className="text-sm text-gray-600 mt-2">
            Design matrix will be generated based on your factors and levels.
          </p>
        ) : (recommendation as any).designMatrix.length > 10 && (
          <p className="text-sm text-gray-600 mt-2">
            Showing first 10 of {(recommendation as any).designMatrix.length} runs. 
            Full matrix will be available in execution planning.
          </p>
        )}
      </div>
    </div>
  );
};

export default Stage4DesignRecommendation;
