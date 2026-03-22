import type { 
  ProblemDefinition, 
  ResponseVariable, 
  Factor, 
  DesignRecommendation, 
  ObjectiveType,
  DesignType 
} from '../types';

export class DesignRecommendationEngine {
  static recommendDesign(
    problemDefinition: ProblemDefinition,
    responseVariables: ResponseVariable[],
    factors: Factor[]
  ): DesignRecommendation | null {
    const controllableFactors = factors.filter(f => f.type === 'controllable');
    const noiseFactors = factors.filter(f => f.type === 'noise');
    const quantitativeFactors = controllableFactors.filter(f => f.dataType === 'quantitative');
    const qualitativeFactors = controllableFactors.filter(f => f.dataType === 'qualitative');
    
    const hasContinuousResponse = responseVariables.some(r => r.type === 'continuous');
    const _hasMultipleResponses = responseVariables.length > 1;

    // Decision tree based on Montgomery's framework
    if (this.isSimpleComparative(controllableFactors, problemDefinition)) {
      return this.getComparativeDesign();
    }

    if (this.isOneWayANOVA(controllableFactors, problemDefinition)) {
      return this.getOneWayANOVA(controllableFactors);
    }

    if (this.needsBlocking(noiseFactors, controllableFactors)) {
      if (noiseFactors.length === 1) {
        return this.getRCBD(controllableFactors);
      } else if (noiseFactors.length === 2) {
        return this.getLatinSquare(controllableFactors);
      }
    }

    if (this.isFullFactorialFeasible(controllableFactors, problemDefinition)) {
      return this.getFullFactorial(controllableFactors);
    }

    if (this.isScreeningRequired(controllableFactors, problemDefinition)) {
      return this.getFractionalFactorial(controllableFactors);
    }

    if (this.isOptimizationRequired(problemDefinition, quantitativeFactors)) {
      return this.getResponseSurfaceDesign(quantitativeFactors, controllableFactors);
    }

    if (this.isRobustnessRequired(problemDefinition, noiseFactors)) {
      return this.getRobustDesign(controllableFactors, noiseFactors);
    }

    if (this.hasNestedStructure(factors)) {
      return this.getNestedDesign(controllableFactors);
    }

    if (this.hasSplitPlotStructure(factors)) {
      return this.getSplitPlotDesign(controllableFactors);
    }

    // Default recommendation
    return this.getDefaultRecommendation(controllableFactors);
  }

  private static isSimpleComparative(factors: Factor[], problemDef: ProblemDefinition): boolean {
    return factors.length === 1 && 
           factors[0].levels.length === 2 && 
           (problemDef.objective === 'comparison' || problemDef.objective === 'confirmation');
  }

  private static isOneWayANOVA(factors: Factor[], problemDef: ProblemDefinition): boolean {
    return factors.length === 1 && 
           factors[0].levels.length >= 3 && 
           problemDef.objective === 'comparison';
  }

  private static needsBlocking(noiseFactors: Factor[], controllableFactors: Factor[]): boolean {
    return noiseFactors.length > 0 && controllableFactors.length <= 4;
  }

  private static isFullFactorialFeasible(factors: Factor[], problemDef: ProblemDefinition): boolean {
    const totalRuns = Math.pow(2, factors.length);
    return factors.length >= 2 && 
           factors.length <= 4 && 
           totalRuns <= 32 && 
           !['screening', 'robustness'].includes(problemDef.objective);
  }

  private static isScreeningRequired(factors: Factor[], problemDef: ProblemDefinition): boolean {
    return factors.length >= 5 || problemDef.objective === 'screening';
  }

  private static isOptimizationRequired(problemDef: ProblemDefinition, quantitativeFactors: Factor[]): boolean {
    return problemDef.objective === 'optimization' && quantitativeFactors.length >= 2;
  }

  private static isRobustnessRequired(problemDef: ProblemDefinition, noiseFactors: Factor[]): boolean {
    return problemDef.objective === 'robustness' && noiseFactors.length > 0;
  }

  private static hasNestedStructure(factors: Factor[]): boolean {
    // This would require more sophisticated factor relationship mapping
    // For now, assume false
    return false;
  }

  private static hasSplitPlotStructure(factors: Factor[]): boolean {
    // This would require identifying hard-to-change factors
    // For now, assume false
    return false;
  }

  private static getComparativeDesign(): DesignRecommendation {
    return {
      type: 'comparative',
      name: 'Simple Comparative Experiment (Two-Sample t-test)',
      description: 'Compare two treatments or conditions using statistical hypothesis testing',
      justification: 'With only one factor at two levels, a simple comparative design is most efficient',
      runsRequired: 20, // Typical recommendation for adequate power
      canEstimate: ['Main effect of the single factor'],
      limitations: ['Cannot estimate interactions', 'Limited to two conditions'],
      assumptions: ['Independent samples', 'Normal distribution', 'Equal variances'],
      designMatrix: [
        ['Treatment A', 'Treatment B']
      ],
      chapterReference: 'Chapter 2',
      requiresReplication: true,
      supportsCenterPoints: false,
      supportsBlocking: false
    };
  }

  private static getOneWayANOVA(factors: Factor[]): DesignRecommendation {
    return {
      type: 'anova',
      name: 'One-Way Analysis of Variance (ANOVA)',
      description: 'Compare three or more treatment levels using ANOVA',
      justification: 'With one factor at multiple levels, ANOVA is the appropriate statistical method',
      runsRequired: factors[0].levels.length * 3, // 3 replicates per level
      canEstimate: ['Main effect of the single factor'],
      limitations: ['Cannot estimate interactions', 'Assumes equal variances across levels'],
      assumptions: ['Independent samples', 'Normal distribution', 'Equal variances'],
      designMatrix: factors[0].levels.map(level => [level]),
      chapterReference: 'Chapter 3',
      requiresReplication: true,
      supportsCenterPoints: false,
      supportsBlocking: false
    };
  }

  private static getRCBD(factors: Factor[]): DesignRecommendation {
    const totalRuns = Math.pow(2, factors.length);
    return {
      type: 'rcbd',
      name: 'Randomized Complete Block Design (RCBD)',
      description: 'Control for one nuisance factor (blocking variable) while studying main factors',
      justification: 'Blocking eliminates known sources of variation, increasing experimental precision',
      runsRequired: totalRuns * 2, // Assuming 2 blocks
      canEstimate: ['Main effects', 'Block effects'],
      limitations: ['Block effects cannot interact with treatment effects'],
      assumptions: ['No interaction between blocks and treatments', 'Homogeneous variance within blocks'],
      designMatrix: this.generateFullFactorialMatrix(factors),
      chapterReference: 'Chapter 4',
      requiresReplication: false,
      supportsCenterPoints: false,
      supportsBlocking: true
    };
  }

  private static getLatinSquare(factors: Factor[]): DesignRecommendation {
    return {
      type: 'latin-square',
      name: 'Latin Square Design',
      description: 'Control for two nuisance factors simultaneously while studying one treatment factor',
      justification: 'Efficient design when you have two blocking factors and one treatment factor',
      runsRequired: factors[0].levels.length * factors[0].levels.length,
      canEstimate: ['Main treatment effect', 'Two block effects'],
      limitations: ['Requires same number of levels for all factors', 'Cannot estimate interactions'],
      assumptions: ['No interactions between any factors', 'Equal number of levels for all factors'],
      designMatrix: this.generateLatinSquareMatrix(factors[0].levels.length),
      chapterReference: 'Chapter 4',
      requiresReplication: false,
      supportsCenterPoints: false,
      supportsBlocking: true
    };
  }

  private static getFullFactorial(factors: Factor[]): DesignRecommendation {
    const totalRuns = Math.pow(2, factors.length);
    return {
      type: 'full-factorial',
      name: `${totalRuns}-Run Full Factorial Design (2^${factors.length})`,
      description: 'Study all possible combinations of factor levels',
      justification: `${factors.length} factors is manageable for a full factorial, providing complete information`,
      runsRequired: totalRuns,
      canEstimate: ['All main effects', 'All interactions', 'Curvature (with center points)'],
      limitations: ['Number of runs grows exponentially with factors'],
      assumptions: ['Factor effects are additive', 'Independent observations'],
      designMatrix: this.generateFullFactorialMatrix(factors),
      chapterReference: 'Chapter 6',
      requiresReplication: false,
      supportsCenterPoints: true,
      supportsBlocking: false
    };
  }

  private static getFractionalFactorial(factors: Factor[]): DesignRecommendation {
    const resolution = factors.length <= 7 ? 'IV' : 'III';
    const fraction = factors.length <= 7 ? 2 : 4;
    const totalRuns = Math.pow(2, factors.length) / fraction;
    
    return {
      type: 'fractional-factorial',
      name: `${totalRuns}-Run Fractional Factorial (2^${factors.length}-${Math.log2(fraction)})`,
      description: `Screening design that estimates main effects and some interactions at Resolution ${resolution}`,
      justification: `${factors.length} factors requires fractional design for efficiency. Resolution ${resolution} provides good balance of information vs. runs`,
      runsRequired: totalRuns,
      canEstimate: resolution === 'IV' 
        ? ['All main effects', 'Some two-factor interactions']
        : ['All main effects', 'Limited interaction information'],
      limitations: [
        resolution === 'IV' 
          ? 'Some two-factor interactions are confounded with other two-factor interactions'
          : 'Main effects are confounded with some two-factor interactions'
      ],
      assumptions: ['Higher-order interactions are negligible', 'Sparsity of effects'],
      designMatrix: this.generateFractionalFactorialMatrix(factors, fraction),
      chapterReference: 'Chapter 8',
      requiresReplication: false,
      supportsCenterPoints: true,
      supportsBlocking: false
    };
  }

  private static getResponseSurfaceDesign(quantitativeFactors: Factor[], allFactors: Factor[]): DesignRecommendation {
    const factorCount = quantitativeFactors.length;
    const ccdRuns = Math.pow(2, factorCount) + 2 * factorCount + 6; // factorial + axial + center points
    
    return {
      type: 'central-composite',
      name: 'Central Composite Design (CCD)',
      description: 'Response surface methodology design for optimization and curvature detection',
      justification: 'Optimization objective with quantitative factors requires response surface design',
      runsRequired: ccdRuns,
      canEstimate: ['Main effects', 'Two-factor interactions', 'Quadratic effects', 'Curvature'],
      limitations: ['Requires quantitative factors', 'More complex analysis'],
      assumptions: ['Continuous response', 'Adequate model fit (quadratic)'],
      designMatrix: this.generateCCDMatrix(quantitativeFactors),
      chapterReference: 'Chapter 11',
      requiresReplication: false,
      supportsCenterPoints: true,
      supportsBlocking: false
    };
  }

  private static getRobustDesign(controllableFactors: Factor[], noiseFactors: Factor[]): DesignRecommendation {
    return {
      type: 'crossed-array',
      name: 'Crossed Array Design (Taguchi-style)',
      description: 'Robust design that studies controllable factors across noise conditions',
      justification: 'Robustness objective with noise factors requires crossed array approach',
      runsRequired: Math.pow(2, controllableFactors.length) * Math.pow(2, noiseFactors.length),
      canEstimate: ['Main effects of controllable factors', 'Noise effects', 'Robustness interactions'],
      limitations: ['Large number of runs', 'Complex analysis'],
      assumptions: ['Independence of control and noise factors', 'Additive effects'],
      designMatrix: this.generateCrossedArrayMatrix(controllableFactors, noiseFactors),
      chapterReference: 'Chapter 12',
      requiresReplication: false,
      supportsCenterPoints: false,
      supportsBlocking: false
    };
  }

  private static getNestedDesign(factors: Factor[]): DesignRecommendation {
    return {
      type: 'nested',
      name: 'Nested Design',
      description: 'Design for hierarchical factor structures (e.g., batches within suppliers)',
      justification: 'Nested factor structure requires nested design approach',
      runsRequired: factors.length * 4, // Simplified calculation
      canEstimate: ['Main effects', 'Nested effects', 'Variance components'],
      limitations: ['Cannot estimate interactions between nested factors'],
      assumptions: ['Hierarchical factor structure', 'Random effects for nested factors'],
      designMatrix: this.generateNestedMatrix(factors),
      chapterReference: 'Chapter 14',
      requiresReplication: true,
      supportsCenterPoints: false,
      supportsBlocking: false
    };
  }

  private static getSplitPlotDesign(factors: Factor[]): DesignRecommendation {
    return {
      type: 'split-plot',
      name: 'Split-Plot Design',
      description: 'Design for hard-to-change factors (whole plots) and easy-to-change factors (subplots)',
      justification: 'Hard-to-change factors require split-plot design structure',
      runsRequired: Math.pow(2, factors.length) * 1.5, // Simplified calculation
      canEstimate: ['Whole plot effects', 'Subplot effects', 'Some interactions'],
      limitations: ['Different error terms for different effects', 'Complex randomization'],
      assumptions: ['Restriction on randomization', 'Two-level error structure'],
      designMatrix: this.generateSplitPlotMatrix(factors),
      chapterReference: 'Chapter 14',
      requiresReplication: false,
      supportsCenterPoints: false,
      supportsBlocking: false
    };
  }

  private static getDefaultRecommendation(factors: Factor[]): DesignRecommendation {
    if (factors.length <= 4) {
      return this.getFullFactorial(factors);
    } else {
      return this.getFractionalFactorial(factors);
    }
  }

  // Matrix generation methods
  private static generateFullFactorialMatrix(factors: Factor[]): string[][] {
    const matrix: string[][] = [];
    const numFactors = factors.length;
    const totalRuns = Math.pow(2, numFactors);
    
    for (let run = 0; run < totalRuns; run++) {
      const row: string[] = [];
      for (let factor = 0; factor < numFactors; factor++) {
        const bit = (run >> factor) & 1;
        row.push(bit === 0 ? '-1' : '+1');
      }
      matrix.push(row);
    }
    
    return matrix;
  }

  private static generateFractionalFactorialMatrix(factors: Factor[], fraction: number): string[][] {
    const fullMatrix = this.generateFullFactorialMatrix(factors);
    return fullMatrix.filter((_, index) => index % fraction === 0);
  }

  private static generateLatinSquareMatrix(size: number): string[][] {
    // Simple Latin square generation
    const matrix: string[][] = [];
    for (let i = 0; i < size; i++) {
      const row: string[] = [];
      for (let j = 0; j < size; j++) {
        row.push(`T${((i + j) % size) + 1}`);
      }
      matrix.push(row);
    }
    return matrix;
  }

  private static generateCCDMatrix(factors: Factor[]): string[][] {
    const matrix: string[][] = [];
    const numFactors = factors.length;
    
    // Factorial points
    const factorialMatrix = this.generateFullFactorialMatrix(factors);
    matrix.push(...factorialMatrix);
    
    // Axial points
    for (let i = 0; i < numFactors; i++) {
      const axialPoint1 = new Array(numFactors).fill('0');
      const axialPoint2 = new Array(numFactors).fill('0');
      axialPoint1[i] = 'α';
      axialPoint2[i] = '-α';
      matrix.push(axialPoint1, axialPoint2);
    }
    
    // Center points
    for (let i = 0; i < 6; i++) {
      matrix.push(new Array(numFactors).fill('0'));
    }
    
    return matrix;
  }

  private static generateCrossedArrayMatrix(controllableFactors: Factor[], noiseFactors: Factor[]): string[][] {
    const controlMatrix = this.generateFullFactorialMatrix(controllableFactors);
    const noiseMatrix = this.generateFullFactorialMatrix(noiseFactors);
    const crossedMatrix: string[][] = [];
    
    for (const controlRow of controlMatrix) {
      for (const noiseRow of noiseMatrix) {
        crossedMatrix.push([...controlRow, ...noiseRow]);
      }
    }
    
    return crossedMatrix;
  }

  private static generateNestedMatrix(factors: Factor[]): string[][] {
    // Simplified nested matrix generation
    const matrix: string[][] = [];
    for (let i = 0; i < factors.length; i++) {
      for (let j = 0; j < 4; j++) {
        matrix.push([`Factor${i + 1}`, `Nested${j + 1}`]);
      }
    }
    return matrix;
  }

  private static generateSplitPlotMatrix(factors: Factor[]): string[][] {
    // Simplified split-plot matrix generation
    const matrix: string[][] = [];
    const wholePlotFactors = Math.ceil(factors.length / 2);
    const subPlotFactors = factors.length - wholePlotFactors;
    
    for (let wp = 0; wp < Math.pow(2, wholePlotFactors); wp++) {
      for (let sp = 0; sp < Math.pow(2, subPlotFactors); sp++) {
        const row: string[] = [];
        for (let i = 0; i < wholePlotFactors; i++) {
          const bit = (wp >> i) & 1;
          row.push(bit === 0 ? '-1' : '+1');
        }
        for (let i = 0; i < subPlotFactors; i++) {
          const bit = (sp >> i) & 1;
          row.push(bit === 0 ? '-1' : '+1');
        }
        matrix.push(row);
      }
    }
    
    return matrix;
  }
}
