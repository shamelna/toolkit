export interface ExperimentData {
  stage: number;
  problemDefinition: ProblemDefinition;
  responseVariables: ResponseVariable[];
  factors: Factor[];
  design: DesignRecommendation | null;
  executionPlan: ExecutionPlan | null;
  results: ExperimentResults | null;
  conclusions: Conclusions | null;
  analysisResults?: AnalysisResults;
  experimentRuns?: ExperimentRun[];
}

// Wizard Types
export interface WizardQuestion {
  id: string;
  section: string;
  question: string;
  type: 'single' | 'multiple';
  options: WizardOption[];
  required: boolean;
  explanation?: string;
}

export interface WizardOption {
  id: string;
  text: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface WizardResponse {
  questionId: string;
  answer: string | string[];
  confidence: number;
  timestamp: Date;
}

export interface WizardSession {
  id: string;
  currentQuestion: number;
  responses: WizardResponse[];
  startedAt: Date;
  completedAt?: Date;
  recommendation?: DesignRecommendation;
}

export interface WizardProfile {
  goal: 'screening' | 'optimization' | 'comparison' | 'confirmation' | 'discovery' | 'robustness';
  factorCount: '1-3' | '4-6' | '7+';
  factorTypes: 'quantitative' | 'mixed' | 'categorical';
  resources: 'limited' | 'moderate' | 'unlimited';
  industry: 'manufacturing' | 'healthcare' | 'research' | 'software' | 'other';
  experience: 'beginner' | 'intermediate' | 'advanced';
  urgency: 'urgent' | 'normal' | 'flexible';
  precision: 'high' | 'standard' | 'rough';
}

export interface ProblemDefinition {
  processDescription: string;
  objective: ObjectiveType;
  objectiveDescription: string;
}

export type ObjectiveType = 
  | 'screening'
  | 'optimization' 
  | 'comparison'
  | 'confirmation'
  | 'discovery'
  | 'robustness';

export interface ResponseVariable {
  id: string;
  name: string;
  type: 'continuous' | 'discrete';
  distribution?: 'normal' | 'skewed' | 'count';
  measurementMethod: string;
  unit?: string;
  target?: string;
}

export interface Factor {
  id: string;
  name: string;
  type: 'controllable' | 'noise' | 'held-constant';
  dataType: 'quantitative' | 'qualitative';
  levels: string[];
  range?: {
    low: number;
    high: number;
    min?: number;
    max?: number;
  };
  unit?: string;
}

export interface DesignRecommendation {
  type: DesignType;
  name: string;
  description: string;
  justification: string;
  runsRequired: number;
  canEstimate: string[];
  capabilities?: string[];
  limitations: string[];
  assumptions: string[];
  designMatrix?: string[][];
  chapterReference: string;
  requiresReplication: boolean;
  supportsCenterPoints: boolean;
  supportsBlocking: boolean;
  resolution?: string;
  efficiency?: string;
}

export type DesignType = 
  | 'comparative'
  | 'anova'
  | 'rcbd'
  | 'latin-square'
  | 'full-factorial'
  | 'fractional-factorial'
  | 'central-composite'
  | 'box-behnken'
  | 'crossed-array'
  | 'nested'
  | 'split-plot'
  | 'response-surface'
  | 'taguchi'
  | 'plackett-burman';

export interface ExecutionPlan {
  replicates: number;
  randomization: boolean;
  blocking: boolean;
  blockVariable?: string;
  centerPoints: number;
  dataCollectionPlan: string;
  riskMitigation: string[];
}

export interface ExperimentResults {
  data: ExperimentRun[];
  analysisComplete: boolean;
}

export interface ExperimentRun {
  runId: number;
  factorSettings: Record<string, string | number>;
  responseValues: Record<string, number>;
  block?: string;
  replication?: number;
}

export interface ANOVAResults {
  source: string;
  df: number;
  ss: number;
  ms: number;
  f: number;
  p: number;
  significant: boolean;
}

export interface EffectEstimate {
  factor: string;
  effect: number;
  standardError: number;
  t: number;
  p: number;
  significant: boolean;
  codedUnits: number;
  naturalUnits: number;
}

export interface ModelDiagnostics {
  normalityResiduals: boolean;
  equalVariance: boolean;
  independence: boolean;
  modelAdequacy: boolean;
  curvatureSignificant: boolean;
  recommendations: string[];
}

export interface AnalysisResults {
  anova: ANOVAResults[];
  effects: EffectEstimate[];
  diagnostics: ModelDiagnostics;
  modelSummary: {
    rSquared: number;
    adjustedRSquared: number;
    lackOfFit: boolean;
  };
}

export interface Conclusions {
  summary: string;
  objectiveAchieved: boolean;
  significantFindings: string[];
  practicalImplications: string[];
  nextSteps: NextStep[];
  confirmationNeeded: boolean;
}

export interface NextStep {
  type: 'confirmation' | 'optimization' | 'augmentation' | 'new-experiment';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface StageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DOEContext {
  data: ExperimentData;
  validation: Record<number, StageValidation>;
  navigationHistory: number[];
}
