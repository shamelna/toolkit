import type { 
  ExperimentResults, 
  ANOVAResults, 
  EffectEstimate, 
  ModelDiagnostics,
  Factor 
} from '../types';

// Mock statistical analysis functions - in a real implementation, these would use actual statistical libraries
export function generateANOVA(
  results: ExperimentResults, 
  responseId: string, 
  factors: Factor[]
): ANOVAResults[] {
  // Mock ANOVA calculation - replace with actual statistical computation
  const mockANOVA: ANOVAResults[] = [
    {
      source: 'Factor A',
      df: 1,
      ss: 125.4,
      ms: 125.4,
      f: 15.67,
      p: 0.0012,
      significant: true
    },
    {
      source: 'Factor B',
      df: 1,
      ss: 89.2,
      ms: 89.2,
      f: 11.15,
      p: 0.0045,
      significant: true
    },
    {
      source: 'AB',
      df: 1,
      ss: 23.8,
      ms: 23.8,
      f: 2.97,
      p: 0.0987,
      significant: false
    },
    {
      source: 'Error',
      df: 12,
      ss: 96.1,
      ms: 8.01,
      f: 0,
      p: 0,
      significant: false
    },
    {
      source: 'Total',
      df: 15,
      ss: 334.5,
      ms: 0,
      f: 0,
      p: 0,
      significant: false
    }
  ];

  // Add factor-specific rows based on actual factors
  const factorRows: ANOVAResults[] = factors.map((factor, index) => ({
    source: factor.name,
    df: 1,
    ss: Math.random() * 100 + 50,
    ms: 0,
    f: Math.random() * 10 + 2,
    p: Math.random() * 0.05,
    significant: Math.random() > 0.5
  }));

  // Calculate MS for factor rows
  factorRows.forEach(row => {
    row.ms = row.ss / row.df;
  });

  return [...factorRows, ...mockANOVA.slice(factors.length)];
}

export function calculateEffectEstimates(
  results: ExperimentResults, 
  responseId: string, 
  factors: Factor[]
): EffectEstimate[] {
  // Mock effect calculation - replace with actual statistical computation
  return factors.map(factor => ({
    factor: factor.name,
    effect: (Math.random() - 0.5) * 10,
    standardError: Math.random() * 2 + 0.5,
    t: Math.random() * 5 - 2.5,
    p: Math.random() * 0.1,
    significant: Math.random() > 0.5,
    codedUnits: (Math.random() - 0.5) * 5,
    naturalUnits: (Math.random() - 0.5) * 20
  }));
}

export function generateParetoData(
  results: ExperimentResults, 
  responseId: string, 
  factors: Factor[]
): { effect: string; value: number; significant: boolean }[] {
  // Mock Pareto data - replace with actual calculation
  const effects = factors.map(f => f.name);
  
  // Add interaction effects
  for (let i = 0; i < factors.length; i++) {
    for (let j = i + 1; j < factors.length; j++) {
      effects.push(`${factors[i].name}${factors[j].name}`);
    }
  }

  return effects.map(effect => ({
    effect,
    value: Math.random() * 20 - 10,
    significant: Math.random() > 0.3
  })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

export function checkModelAssumptions(
  results: ExperimentResults, 
  responseId: string
): ModelDiagnostics {
  // Mock diagnostics - replace with actual statistical tests
  return {
    normalityResiduals: Math.random() > 0.2,
    equalVariance: Math.random() > 0.15,
    independence: Math.random() > 0.1,
    modelAdequacy: Math.random() > 0.25,
    curvatureSignificant: Math.random() > 0.7,
    recommendations: [
      'Consider adding center points to check for curvature',
      'Verify measurement system capability',
      'Check for outliers in the data'
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  };
}

export function generateMainEffectsData(
  results: ExperimentResults, 
  responseId: string, 
  factors: Factor[]
): { factor: string; levels: { level: string; mean: number }[] }[] {
  // Mock main effects data - replace with actual calculation
  return factors.map(factor => ({
    factor: factor.name,
    levels: factor.levels.slice(0, 2).map(level => ({
      level,
      mean: Math.random() * 50 + 25
    }))
  }));
}

export function generateInteractionData(
  results: ExperimentResults, 
  responseId: string, 
  factors: Factor[]
): { factor1: string; factor2: string; data: { x: string; y: string; value: number }[] }[] {
  // Mock interaction data - replace with actual calculation
  const interactions: { factor1: string; factor2: string; data: { x: string; y: string; value: number }[] }[] = [];
  
  for (let i = 0; i < Math.min(factors.length - 1, 3); i++) {
    for (let j = i + 1; j < Math.min(factors.length, i + 2); j++) {
      const factor1 = factors[i];
      const factor2 = factors[j];
      
      const data: { x: string; y: string; value: number }[] = [];
      for (const level1 of factor1.levels.slice(0, 2)) {
        for (const level2 of factor2.levels.slice(0, 2)) {
          data.push({
            x: level1,
            y: level2,
            value: Math.random() * 50 + 25
          });
        }
      }
      
      interactions.push({
        factor1: factor1.name,
        factor2: factor2.name,
        data
      });
    }
  }
  
  return interactions;
}

// Additional statistical utility functions

export function calculateFStatistic(msEffect: number, msError: number): number {
  return msEffect / msError;
}

export function calculatePValue(fStatistic: number, dfEffect: number, dfError: number): number {
  // Mock p-value calculation - in reality, would use F-distribution
  return Math.max(0.0001, Math.random() * 0.1);
}

export function calculateStandardError(effect: number, sampleSize: number): number {
  // Mock standard error calculation
  return Math.abs(effect) / (Math.sqrt(sampleSize) * (Math.random() * 2 + 1));
}

export function testNormality(residuals: number[]): { isNormal: boolean; pValue: number } {
  // Mock normality test (e.g., Shapiro-Wilk)
  return {
    isNormal: Math.random() > 0.2,
    pValue: Math.random() * 0.5
  };
}

export function testEqualVariance(groups: number[][]): { equalVariance: boolean; pValue: number } {
  // Mock equal variance test (e.g., Levene's test)
  return {
    equalVariance: Math.random() > 0.15,
    pValue: Math.random() * 0.5
  };
}

export function calculateResiduals(observed: number[], predicted: number[]): number[] {
  return observed.map((obs, i) => obs - predicted[i]);
}

export function calculateRSquared(ssTotal: number, ssError: number): number {
  return 1 - (ssError / ssTotal);
}

export function calculateAdjustedRSquared(rSquared: number, n: number, p: number): number {
  return 1 - ((1 - rSquared) * (n - 1)) / (n - p - 1);
}

// Utility functions for data transformation

export function transformLog(data: number[]): number[] {
  return data.map(x => Math.log(x));
}

export function transformSqrt(data: number[]): number[] {
  return data.map(x => Math.sqrt(x));
}

export function transformArcsin(data: number[]): number[] {
  return data.map(x => Math.asin(Math.sqrt(x / 100)) * (180 / Math.PI)); // For percentages
}

// Power analysis functions

export function calculateSampleSize(
  effectSize: number, 
  alpha: number = 0.05, 
  power: number = 0.8
): number {
  // Mock sample size calculation - would use power analysis formulas
  return Math.ceil(8 / (effectSize * effectSize));
}

export function calculatePower(
  effectSize: number, 
  sampleSize: number, 
  alpha: number = 0.05
): number {
  // Mock power calculation - would use power analysis formulas
  return Math.min(0.99, effectSize * Math.sqrt(sampleSize) / 4);
}
