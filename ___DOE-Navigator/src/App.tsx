import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Stage1ProblemDefinition from './components/Stage1ProblemDefinition';
import Stage2ResponseVariables from './components/Stage2ResponseVariables';
import Stage3FactorsLevels from './components/Stage3FactorsLevels';
import Stage4DesignRecommendation from './components/Stage4DesignRecommendation';
import Stage5ExecutionPlanning from './components/Stage5ExecutionPlanning';
import Stage6AnalysisEngine from './components/Stage6AnalysisEngine';
import Stage7Conclusions from './components/Stage7Conclusions';
import TutorialSection from './components/TutorialSection';
import WizardContainer from './components/WizardContainer';
import type { 
  ExperimentData, 
  ProblemDefinition, 
  ResponseVariable, 
  Factor, 
  DesignRecommendation, 
  ExecutionPlan, 
  ExperimentResults, 
  AnalysisResults,
  Conclusions,
  StageValidation 
} from './types';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const totalStages = 7;

  // Initialize experiment data
  const [experimentData, setExperimentData] = useState<ExperimentData>({
    stage: currentStage,
    problemDefinition: {
      processDescription: '',
      objective: 'screening',
      objectiveDescription: ''
    },
    responseVariables: [],
    factors: [],
    design: null,
    executionPlan: null,
    results: null,
    conclusions: null
  });

  const stages = [
    { id: 1, name: 'Problem Definition', description: 'Define your experimental objective' },
    { id: 2, name: 'Response Variables', description: 'Identify what you will measure' },
    { id: 3, name: 'Factors & Levels', description: 'Define experimental factors' },
    { id: 4, name: 'Design Recommendation', description: 'Select the optimal experimental design' },
    { id: 5, name: 'Execution Planning', description: 'Plan the experiment execution' },
    { id: 6, name: 'Analysis Engine', description: 'Analyze the experimental results' },
    { id: 7, name: 'Conclusions & Report', description: 'Draw conclusions and generate report' }
  ];

  const isStageAccessible = (stageId: number): boolean => {
    switch (stageId) {
      case 1:
        return true;
      case 2:
        return experimentData.problemDefinition.processDescription.length > 0;
      case 3:
        return experimentData.responseVariables.length > 0;
      case 4:
        return experimentData.factors.length >= 2;
      case 5:
        return experimentData.design !== null;
      case 6:
        return experimentData.executionPlan !== null;
      case 7:
        return experimentData.results !== null;
      default:
        return false;
    }
  };

  const isStageValid = (stageId: number): boolean => {
    switch (stageId) {
      case 1:
        return experimentData.problemDefinition.processDescription.length > 10 && 
               experimentData.problemDefinition.objectiveDescription.length > 10;
      case 2:
        return experimentData.responseVariables.length > 0;
      case 3:
        return experimentData.factors.length >= 2 && 
               experimentData.factors.every(f => f.levels.length >= 2);
      case 4:
        return experimentData.design !== null;
      case 5:
        return experimentData.executionPlan !== null;
      case 6:
        return experimentData.results !== null;
      case 7:
        return experimentData.conclusions !== null;
      default:
        return false;
    }
  };

  const currentStageInfo = stages.find(s => s.id === currentStage);

  const handleProblemDefinition = (data: ProblemDefinition) => {
    setExperimentData(prev => ({
      ...prev,
      problemDefinition: data,
      stage: Math.max(prev.stage, 2)
    }));
  };

  const handleResponseVariables = (variables: ResponseVariable[]) => {
    setExperimentData(prev => ({
      ...prev,
      responseVariables: variables,
      stage: Math.max(prev.stage, 3)
    }));
  };

  const handleFactorsLevels = (factors: Factor[]) => {
    setExperimentData(prev => ({
      ...prev,
      factors: factors,
      stage: Math.max(prev.stage, 4)
    }));
  };

  const handleDesignRecommendation = (design: DesignRecommendation) => {
    setExperimentData(prev => ({
      ...prev,
      design: design,
      stage: Math.max(prev.stage, 5)
    }));
  };

  const handleExecutionPlanning = (plan: ExecutionPlan) => {
    setExperimentData(prev => ({
      ...prev,
      executionPlan: plan,
      stage: Math.max(prev.stage, 6)
    }));
  };

  const handleAnalysisResults = (results: ExperimentResults) => {
    setExperimentData(prev => ({
      ...prev,
      results: results,
      stage: Math.max(prev.stage, 7)
    }));
  };

  const handleConclusions = (conclusions: Conclusions) => {
    setExperimentData(prev => ({
      ...prev,
      conclusions: conclusions,
      stage: Math.max(prev.stage, 8)
    }));
  };

  const handleStartTutorial = () => {
    setShowTutorial(true);
    setShowWizard(false);
  };

  const handleStartWizard = () => {
    setShowWizard(true);
    setShowTutorial(false);
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <Stage1ProblemDefinition
            data={experimentData.problemDefinition}
            onUpdate={handleProblemDefinition}
            onValidationChange={(validation) => console.log('Stage 1 validation:', validation)}
          />
        );
      case 2:
        return (
          <Stage2ResponseVariables
            data={experimentData.responseVariables}
            onUpdate={handleResponseVariables}
            onValidationChange={(validation) => console.log('Stage 2 validation:', validation)}
          />
        );
      case 3:
        return (
          <Stage3FactorsLevels
            data={experimentData.factors}
            onUpdate={handleFactorsLevels}
            onValidationChange={(validation) => console.log('Stage 3 validation:', validation)}
          />
        );
      case 4:
        return (
          <Stage4DesignRecommendation
            problemDefinition={experimentData.problemDefinition}
            responseVariables={experimentData.responseVariables}
            factors={experimentData.factors}
            data={experimentData.design}
            onUpdate={handleDesignRecommendation}
            onValidationChange={(validation) => console.log('Stage 4 validation:', validation)}
          />
        );
      case 5:
        return (
          <Stage5ExecutionPlanning
            design={experimentData.design}
            factors={experimentData.factors}
            data={experimentData.executionPlan}
            onUpdate={handleExecutionPlanning}
            onValidationChange={(validation: StageValidation) => console.log('Stage 5 validation:', validation)}
          />
        );
      case 6:
        return (
          <Stage6AnalysisEngine
            design={experimentData.design}
            factors={experimentData.factors}
            responseVariables={experimentData.responseVariables}
            data={experimentData.results}
            onUpdate={(results) => {
              setExperimentData(prev => ({
                ...prev,
                results: results,
                stage: Math.max(prev.stage, 7)
              }));
            }}
            onValidationChange={(validation) => console.log('Stage 6 validation:', validation)}
          />
        );
      case 7:
        return (
          <Stage7Conclusions
            problemDefinition={experimentData.problemDefinition}
            design={experimentData.design}
            results={experimentData.results}
            data={experimentData.conclusions}
            onUpdate={handleConclusions}
            onValidationChange={(validation) => console.log('Stage 7 validation:', validation)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStage={currentStage} totalStages={totalStages} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">DOE Navigator</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Complete Design of Experiments wizard
                </p>
              </div>
              <div className="card-body">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">DOE Navigator</h1>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartTutorial}
                        className="btn btn-secondary btn-sm"
                        title="Learn about experimental designs"
                      >
                        📚 Tutorial
                      </button>
                      <button
                        onClick={handleStartWizard}
                        className="btn btn-secondary btn-sm"
                        title="Get quick design recommendation"
                      >
                        🧙 Quick Wizard
                      </button>
                      <div className="text-sm text-gray-600">
                        Stage {currentStage} of {totalStages}
                      </div>
                    </div>
                  </div>

                  {/* Stage Progress */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stages.map((stage) => {
                      const isAccessible = isStageAccessible(stage.id);
                      const isValid = isStageValid(stage.id);
                      const isCurrent = stage.id === currentStage;
                      const isPast = stage.id < currentStage;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => isAccessible && setCurrentStage(stage.id)}
                          disabled={!isAccessible}
                          className={`nav-btn transition-all ${
                            isCurrent
                              ? 'active'
                              : isPast && isValid
                              ? 'completed'
                              : isAccessible && !isValid
                              ? 'upcoming'
                              : 'disabled'
                          }`}
                          title={
                            !isAccessible
                              ? `Complete Stage ${stage.id - 1} first`
                              : !isValid && !isPast
                              ? `Complete current stage requirements`
                              : `Go to Stage ${stage.id}`
                          }
                        >
                          <span className="flex items-center gap-1">
                            {stage.id}. {stage.name}
                            {!isAccessible && (
                              <span className="text-xs opacity-60">🔒</span>
                            )}
                            {isAccessible && !isValid && !isPast && (
                              <span className="text-xs opacity-60">⚠️</span>
                            )}
                            {isPast && isValid && (
                              <span className="text-xs opacity-60">✅</span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Stage Status Message */}
                  {!isStageValid(currentStage) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 text-sm">⚠️</span>
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Stage {currentStage} Requirements:</p>
                          <p className="mt-1">
                            {currentStage === 1 && "Complete all fields in Problem Definition to proceed"}
                            {currentStage === 2 && "Add at least one response variable with name and measurement method"}
                            {currentStage === 3 && "Add at least one factor with name and at least 2 levels"}
                            {currentStage >= 4 && "Complete previous stages to unlock this stage"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="card mt-4">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
                        disabled={currentStage === 1}
                        className="btn btn-secondary"
                      >
                        Previous Stage
                      </button>
                      <div className="text-sm text-gray-600">
                        Progress: {currentStage}/{totalStages}
                      </div>
                      <button
                        onClick={() => setCurrentStage(Math.min(totalStages, currentStage + 1))}
                        disabled={currentStage === totalStages}
                        className="btn btn-primary"
                      >
                        {currentStage === totalStages ? 'Complete' : 'Next Stage'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="card mt-4">
                  <div className="card-header">
                    <h4 className="section-title">Quick Tips</h4>
                  </div>
                  <div className="card-body">
                    <div className="text-sm text-gray-600">
                      {currentStage === 1 && (
                        <p>Start by clearly defining what you want to achieve with your experiment. Be specific about your objectives and success criteria.</p>
                      )}
                      {currentStage === 2 && (
                        <p>Identify all measurable outcomes that will help you evaluate your experiment. Consider both primary and secondary responses.</p>
                      )}
                      {currentStage === 3 && (
                        <p>List all factors you can control and vary. For each factor, specify the levels you want to test and the practical range.</p>
                      )}
                      {currentStage === 4 && (
                        <p>Review the recommended design based on your inputs. The system will suggest the most appropriate experimental design.</p>
                      )}
                      {currentStage === 5 && (
                        <p>Plan how you'll execute the experiment, including randomization, replication, and any blocking factors.</p>
                      )}
                      {currentStage === 6 && (
                        <p>Input your experimental results and run statistical analysis to identify significant factors and effects.</p>
                      )}
                      {currentStage === 7 && (
                        <p>Review your conclusions and plan next steps based on your analysis results.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {showTutorial && <TutorialSection onClose={() => setShowTutorial(false)} />}
            {showWizard && <WizardContainer onComplete={(recommendation) => { handleDesignRecommendation(recommendation); setShowWizard(false); }} onCancel={() => setShowWizard(false)} />}
            
            {!showTutorial && !showWizard && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">DOE Navigator</h1>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartTutorial}
                        className="btn btn-secondary btn-sm"
                        title="Learn about experimental designs"
                      >
                        📚 Tutorial
                      </button>
                      <button
                        onClick={handleStartWizard}
                        className="btn btn-secondary btn-sm"
                        title="Get quick design recommendation"
                      >
                        🧙 Quick Wizard
                      </button>
                      <div className="text-sm text-gray-600">
                        Stage {currentStage} of {totalStages}
                      </div>
                    </div>
                  </div>

                  {/* Stage Progress */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStage / totalStages) * 100}%` }}
                    />
                  </div>

                  {/* Stage Status Message */}
                  {!isStageValid(currentStage) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 text-sm">⚠️</span>
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Stage {currentStage} Requirements:</p>
                          <p className="mt-1">
                            {currentStage === 1 && "Complete all fields in Problem Definition to proceed"}
                            {currentStage === 2 && "Add at least one response variable with name and measurement method"}
                            {currentStage === 3 && "Add at least one factor with name and at least 2 levels"}
                            {currentStage >= 4 && "Complete previous stages to unlock this stage"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Stage Content */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">
                        Stage {currentStage}: {currentStageInfo?.name}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {currentStageInfo?.description}
                      </p>
                    </div>
                    <div className="card-body">
                      {renderStageContent()}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="card mt-4">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
                          disabled={currentStage === 1}
                          className="btn btn-secondary"
                        >
                          Previous Stage
                        </button>
                        <div className="text-sm text-gray-600">
                          Progress: {currentStage}/{totalStages}
                        </div>
                        <button
                          onClick={() => setCurrentStage(Math.min(totalStages, currentStage + 1))}
                          disabled={currentStage === totalStages}
                          className="btn btn-primary"
                        >
                          {currentStage === totalStages ? 'Complete' : 'Next Stage'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="card mt-4">
                    <div className="card-header">
                      <h4 className="section-title">Quick Tips</h4>
                    </div>
                    <div className="card-body">
                      <div className="text-sm text-gray-600">
                        {currentStage === 1 && (
                          <p>Start by clearly defining what you want to achieve with your experiment. Be specific about your objectives and success criteria.</p>
                        )}
                        {currentStage === 2 && (
                          <p>Identify all measurable outcomes that will help you evaluate your experiment. Consider both primary and secondary responses.</p>
                        )}
                        {currentStage === 3 && (
                          <p>List all factors you can control and vary. For each factor, specify the levels you want to test and the practical range.</p>
                        )}
                        {currentStage === 4 && (
                          <p>Review the recommended design based on your inputs. The system will suggest the most appropriate experimental design.</p>
                        )}
                        {currentStage === 5 && (
                          <p>Plan how you'll execute the experiment, including randomization, replication, and any blocking factors.</p>
                        )}
                        {currentStage === 6 && (
                          <p>Input your experimental results and run statistical analysis to identify significant factors and effects.</p>
                        )}
                        {currentStage === 7 && (
                          <p>Review your conclusions and plan next steps based on your analysis results.</p>
                        )}
                      </div>
                    </div>
                </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
