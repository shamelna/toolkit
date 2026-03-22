import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { wizardQuestions } from '../utils/wizardQuestions';
import { WizardRecommendationEngine } from '../utils/wizardRecommendationEngine';
import WizardProgress from './WizardProgress';
import type { WizardQuestion, WizardSession, WizardResponse, DesignRecommendation } from '../types';
import WizardQuestionComponent from './WizardQuestion';
import WizardResults from './WizardResults';

interface WizardContainerProps {
  onComplete: (recommendation: DesignRecommendation) => void;
  onCancel: () => void;
}

const WizardContainer: React.FC<WizardContainerProps> = ({
  onComplete,
  onCancel
}) => {
  const [session, setSession] = useState<WizardSession>({
    id: Date.now().toString(),
    currentQuestion: 0,
    responses: [],
    startedAt: new Date()
  });

  const [recommendation, setRecommendation] = useState<DesignRecommendation | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = wizardQuestions[session.currentQuestion];
  const completedSections = Array.from(new Set(
    wizardQuestions
      .slice(0, session.currentQuestion)
      .map(q => q.section)
  ));

  const handleResponse = (response: WizardResponse) => {
    const existingIndex = session.responses.findIndex(r => r.questionId === response.questionId);
    const newResponses = [...session.responses];
    
    if (existingIndex >= 0) {
      newResponses[existingIndex] = response;
    } else {
      newResponses.push(response);
    }

    const updatedSession = {
      ...session,
      responses: newResponses
    };

    setSession(updatedSession);
  };

  const goToNext = () => {
    if (session.currentQuestion < wizardQuestions.length - 1) {
      setSession({
        ...session,
        currentQuestion: session.currentQuestion + 1
      });
    } else {
      // Complete wizard
      completeWizard();
    }
  };

  const goToPrevious = () => {
    if (session.currentQuestion > 0) {
      setSession({
        ...session,
        currentQuestion: session.currentQuestion - 1
      });
    }
  };

  const completeWizard = () => {
    const profile = WizardRecommendationEngine.generateProfile(session.responses);
    const rec = WizardRecommendationEngine.recommendDesign(profile);
    const explanation = WizardRecommendationEngine.getDesignExplanation(profile, rec);

    setRecommendation(rec);
    setShowResults(true);

    const completedSession = {
      ...session,
      completedAt: new Date(),
      recommendation: rec
    };

    setSession(completedSession);
  };

  const restart = () => {
    setSession({
      id: Date.now().toString(),
      currentQuestion: 0,
      responses: [],
      startedAt: new Date()
    });
    setRecommendation(null);
    setShowResults(false);
  };

  const canGoNext = () => {
    if (currentQuestion.required) {
      return session.responses.some(r => r.questionId === currentQuestion.id);
    }
    return true;
  };

  const getCurrentResponse = (): WizardResponse | undefined => {
    return session.responses.find(r => r.questionId === currentQuestion.id);
  };

  if (showResults && recommendation) {
    const profile = WizardRecommendationEngine.generateProfile(session.responses);
    const explanation = WizardRecommendationEngine.getDesignExplanation(profile, recommendation);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DOE Navigator
          </button>
          <div className="text-sm text-gray-600">
            Wizard Complete
          </div>
        </div>

        <WizardResults
          recommendation={recommendation}
          profile={profile}
          explanation={explanation}
          onRestart={restart}
          onUseInFullApp={() => onComplete(recommendation)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to DOE Navigator
        </button>
        <button
          onClick={restart}
          className="btn btn-secondary"
          title="Restart wizard"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress */}
      <WizardProgress
        currentQuestion={session.currentQuestion}
        totalQuestions={wizardQuestions.length}
        completedSections={completedSections}
      />

      {/* Current Question */}
      <WizardQuestionComponent
        question={currentQuestion}
        response={getCurrentResponse()}
        onResponse={handleResponse}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={goToPrevious}
          disabled={session.currentQuestion === 0}
          className={`btn btn-secondary ${
            session.currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Step {session.currentQuestion + 1} of {wizardQuestions.length}
        </div>

        <button
          onClick={goToNext}
          disabled={!canGoNext()}
          className={`btn btn-primary ${
            !canGoNext() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {session.currentQuestion === wizardQuestions.length - 1 ? (
            <>
              Complete
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Current Section:</span> {currentQuestion.section}
        </div>
      </div>
    </div>
  );
};

export default WizardContainer;
