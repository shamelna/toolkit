import React from 'react';
import { CheckCircle, AlertTriangle, Info, ArrowRight, RotateCcw } from 'lucide-react';
import type { DesignRecommendation, WizardProfile } from '../types';

interface WizardResultsProps {
  recommendation: DesignRecommendation;
  profile: WizardProfile;
  explanation: string;
  onRestart: () => void;
  onUseInFullApp: () => void;
}

const WizardResults: React.FC<WizardResultsProps> = ({
  recommendation,
  profile,
  explanation,
  onRestart,
  onUseInFullApp
}) => {
  return (
    <div className="space-y-4">
      {/* Recommendation Header */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Recommended Design</h3>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {recommendation.name}
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
                  <span className="font-medium">Complexity:</span>
                  <span className="ml-2 text-gray-700">
                    {recommendation.runsRequired <= 8 ? 'Low' : 
                     recommendation.runsRequired <= 16 ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="bg-white rounded p-2">
                  <span className="font-medium">Experience:</span>
                  <span className="ml-2 capitalize text-gray-700">{profile.experience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Explanation */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Why This Design?</h3>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="text-gray-700 whitespace-pre-line">
            {explanation}
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Design Capabilities</h3>
        </div>

        <div className="space-y-2">
          {recommendation.capabilities?.map((capability: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span className="text-sm text-gray-700">{capability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Considerations & Limitations</h3>
        </div>

        <div className="space-y-2">
          {recommendation.limitations?.map((limitation: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <span className="text-sm text-gray-700">{limitation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Key Assumptions</h3>
        </div>

        <div className="space-y-2">
          {recommendation.assumptions?.map((assumption: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <span className="text-sm text-gray-700">{assumption}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Your Profile Summary */}
      <div className="factor-item">
        <div className="section-header">
          <h3 className="form-label">Your Experiment Profile</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-gray-50 rounded p-2">
            <span className="font-medium text-gray-600">Goal:</span>
            <span className="ml-1 capitalize">{profile.goal}</span>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <span className="font-medium text-gray-600">Factors:</span>
            <span className="ml-1">{profile.factorCount}</span>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <span className="font-medium text-gray-600">Resources:</span>
            <span className="ml-1 capitalize">{profile.resources}</span>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <span className="font-medium text-gray-600">Industry:</span>
            <span className="ml-1 capitalize">{profile.industry}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onUseInFullApp}
          className="btn btn-primary flex-1"
        >
          <ArrowRight className="w-4 h-4" />
          Use This Design in Full DOE Navigator
        </button>
        <button
          onClick={onRestart}
          className="btn btn-secondary"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Wizard
        </button>
      </div>

      {/* Additional Resources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Next Steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Review the design capabilities and limitations</li>
              <li>Consider if this design fits your timeline and resources</li>
              <li>Use the "Full DOE Navigator" for detailed implementation</li>
              <li>Consult with a statistician if you have questions about the design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardResults;
