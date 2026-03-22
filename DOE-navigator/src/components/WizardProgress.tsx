import React from 'react';

interface WizardProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  completedSections: string[];
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentQuestion,
  totalQuestions,
  completedSections
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Quick Wizard</h3>
        <span className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Section Progress */}
      <div className="flex flex-wrap gap-2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          completedSections.includes('Problem Understanding')
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          Problem Understanding
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          completedSections.includes('Experimental Context')
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          Experimental Context
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          completedSections.includes('Factor Details')
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          Factor Details
        </div>
      </div>
    </div>
  );
};

export default WizardProgress;
