import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { WizardQuestion, WizardResponse } from '../types';

interface WizardQuestionProps {
  question: WizardQuestion;
  response?: WizardResponse;
  onResponse: (response: WizardResponse) => void;
}

export default function WizardQuestion({ question, response, onResponse }: WizardQuestionProps) {
  const handleSelectOption = (optionId: string) => {
    const option = question.options.find(opt => opt.id === optionId);
    if (!option) return;

    const newResponse: WizardResponse = {
      questionId: question.id,
      answer: option.value,
      confidence: 1.0,
      timestamp: new Date()
    };

    onResponse(newResponse);
  };

  const isSelected = (optionId: string): boolean => {
    if (!response) return false;
    if (question.type === 'single') {
      const option = question.options.find(opt => opt.id === optionId);
      return option?.value === response.answer;
    }
    return false;
  };

  return (
    <div className="factor-item">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <h3 className="form-label">{question.question}</h3>
          {question.required && (
            <span className="text-red-500 text-sm">*</span>
          )}
        </div>
      </div>

      {question.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              {question.explanation}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              isSelected(option.id)
                ? 'border-yellow-500 bg-yellow-50 shadow-md'
                : 'border-gray-200 hover:border-yellow-300 hover:shadow-sm'
            }`}
            onClick={() => handleSelectOption(option.id)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <input
                  type="radio"
                  name={question.id}
                  checked={isSelected(option.id)}
                  onChange={() => handleSelectOption(option.id)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {option.icon && (
                    <span className="text-lg">{option.icon}</span>
                  )}
                  <h4 className="font-semibold text-gray-900">
                    {option.text}
                  </h4>
                </div>
                {option.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
