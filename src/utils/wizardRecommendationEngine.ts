import type { WizardProfile, WizardResponse, DesignRecommendation } from '../types';

export class WizardRecommendationEngine {
  static generateProfile(responses: WizardResponse[]): WizardProfile {
    const profile: Partial<WizardProfile> = {};
    
    responses.forEach(response => {
      switch (response.questionId) {
        case 'goal':
          profile.goal = response.answer as any;
          break;
        case 'factor-count':
          profile.factorCount = response.answer as any;
          break;
        case 'factor-types':
          profile.factorTypes = response.answer as any;
          break;
        case 'resources':
          profile.resources = response.answer as any;
          break;
        case 'industry':
          profile.industry = response.answer as any;
          break;
        case 'experience':
          profile.experience = response.answer as any;
          break;
        case 'urgency':
          profile.urgency = response.answer as any;
          break;
        case 'precision':
          profile.precision = response.answer as any;
          break;
      }
    });

    return profile as WizardProfile;
  }

  static recommendDesign(profile: WizardProfile): DesignRecommendation {
    const { goal, factorCount, factorTypes, resources, experience, precision } = profile;
    
    // Decision tree logic based on Montgomery's framework
    if (this.isComparativeStudy(goal, factorCount)) {
      return this.getComparativeDesign(profile);
    }

    if (this.isSimpleScreening(goal, factorCount, resources)) {
      return this.getScreeningDesign(profile);
    }

    if (this.isOptimizationStudy(goal, factorCount, factorTypes)) {
      return this.getOptimizationDesign(profile);
    }

    if (this.isComplexScreening(goal, factorCount, resources)) {
      return this.getFractionalFactorialDesign(profile);
    }

    if (this.isFullFactorialFeasible(goal, factorCount, resources)) {
      return this.getFullFactorialDesign(profile);
    }

    // Default fallback
    return this.getDefaultDesign(profile);
  }

  private static isComparativeStudy(goal: string, factorCount: string): boolean {
    return goal === 'comparison' && factorCount === '1-3';
  }

  private static isSimpleScreening(goal: string, factorCount: string, resources: string): boolean {
    return goal === 'screening' && factorCount === '1-3' && resources !== 'unlimited';
  }

  private static isOptimizationStudy(goal: string, factorCount: string, factorTypes: string): boolean {
    return goal === 'optimization' && factorCount === '1-3' && factorTypes === 'quantitative';
  }

  private static isComplexScreening(goal: string, factorCount: string, resources: string): boolean {
    return goal === 'screening' && factorCount === '7+' && resources === 'limited';
  }

  private static isFullFactorialFeasible(goal: string, factorCount: string, resources: string): boolean {
    return goal !== 'screening' && factorCount === '1-3' && resources === 'unlimited';
  }

  private static getComparativeDesign(profile: WizardProfile): DesignRecommendation {
    return {
      type: 'comparative' as any,
      name: 'Comparative Study Design',
      description: 'Compare treatments or methods with statistical analysis',
      justification: 'For comparing treatments or methods with 1-3 factors, a comparative design provides clear statistical analysis with minimal experimental runs.',
      runsRequired: this.calculateRunsForComparative(profile),
      designMatrix: undefined,
      canEstimate: ['Main effects', 'Treatment differences'],
      capabilities: [
        'Direct comparison of treatments',
        'Statistical significance testing',
        'Clear interpretation of results',
        'Efficient use of resources'
      ],
      limitations: [
        'Limited to few factors',
        'Cannot detect interactions between many factors',
        'May not identify optimal settings'
      ],
      assumptions: ['Independent observations', 'Normal distribution', 'Equal variances'],
      chapterReference: 'Montgomery Ch. 2',
      requiresReplication: true,
      supportsCenterPoints: false,
      supportsBlocking: true
    };
  }

  private static getScreeningDesign(profile: WizardProfile): DesignRecommendation {
    return {
      type: 'plackett-burman' as any,
      name: 'Plackett-Burman Screening Design',
      description: 'Efficient screening design for identifying significant factors',
      justification: 'For initial screening with 1-3 factors and limited resources, Plackett-Burman efficiently identifies significant factors.',
      runsRequired: this.calculateRunsForScreening(profile),
      designMatrix: undefined,
      canEstimate: ['Main effects'],
      capabilities: [
        'Identifies main effects efficiently',
        'Minimal experimental runs',
        'Good for factor screening',
        'Resource-efficient'
      ],
      limitations: [
        'Cannot estimate interactions',
        'May confound main effects',
        'Limited to screening objectives'
      ],
      assumptions: ['Main effects dominate', 'No significant interactions'],
      chapterReference: 'Montgomery Ch. 8',
      requiresReplication: false,
      supportsCenterPoints: true,
      supportsBlocking: false
    };
  }

  private static getOptimizationDesign(profile: WizardProfile): DesignRecommendation {
    return {
      type: 'response-surface' as any,
      name: 'Response Surface Methodology',
      description: 'Optimization design for finding optimal factor settings',
      justification: 'For optimization with quantitative factors, response surface methodology finds optimal settings and models curvature.',
      runsRequired: this.calculateRunsForOptimization(profile),
      designMatrix: undefined,
      canEstimate: ['Main effects', 'Interactions', 'Quadratic effects', 'Optimal settings'],
      capabilities: [
        'Finds optimal factor settings',
        'Models quadratic relationships',
        'Predicts response across design space',
        'Identifies optimal regions'
      ],
      limitations: [
        'Requires more experimental runs',
        'Assumes smooth response surface',
        'Limited to quantitative factors'
      ],
      assumptions: ['Continuous response surface', 'Adequate model fit'],
      chapterReference: 'Montgomery Ch. 11',
      requiresReplication: true,
      supportsCenterPoints: true,
      supportsBlocking: true
    };
  }

  private static getFractionalFactorialDesign(profile: WizardProfile): DesignRecommendation {
    return {
      type: 'fractional-factorial' as any,
      name: 'Fractional Factorial Design',
      description: 'Efficient design for screening many factors with limited resources',
      justification: 'For complex screening with many factors and limited resources, fractional factorial provides balance between information and efficiency.',
      runsRequired: this.calculateRunsForFractional(profile),
      designMatrix: undefined,
      canEstimate: ['Main effects', 'Some interactions'],
      capabilities: [
        'Screens many factors efficiently',
        'Estimates main effects',
        'Some interaction information',
        'Resource-conscious design'
      ],
      limitations: [
        'Confounding of effects',
        'Limited interaction analysis',
        'Complex interpretation'
      ],
      assumptions: ['Higher-order interactions negligible'],
      chapterReference: 'Montgomery Ch. 8',
      requiresReplication: true,
      supportsCenterPoints: true,
      supportsBlocking: true
    };
  }

  private static getFullFactorialDesign(profile: WizardProfile): DesignRecommendation {
    return {
      type: 'full-factorial' as any,
      name: 'Full Factorial Design',
      description: 'Complete design for estimating all effects and interactions',
      justification: 'With unlimited resources and few factors, full factorial provides complete information about all effects and interactions.',
      runsRequired: this.calculateRunsForFullFactorial(profile),
      designMatrix: undefined,
      canEstimate: ['All main effects', 'All interactions', 'Complete factor information'],
      capabilities: [
        'Estimates all main effects',
        'Estimates all interactions',
        'Complete factor information',
        'No confounding'
      ],
      limitations: [
        'Requires many experimental runs',
        'Resource-intensive',
        'May be overkill for simple objectives'
      ],
      assumptions: ['All effects estimable', 'Sufficient resources'],
      chapterReference: 'Montgomery Ch. 5',
      requiresReplication: true,
      supportsCenterPoints: true,
      supportsBlocking: true
    };
  }

  private static getDefaultDesign(profile: WizardProfile): DesignRecommendation {
    return {
      type: 'fractional-factorial' as any,
      name: 'General Purpose Fractional Factorial',
      description: 'Versatile design balancing efficiency and information',
      justification: 'A versatile design that balances efficiency and information for most experimental situations.',
      runsRequired: 16,
      designMatrix: undefined,
      canEstimate: ['Main effects', 'Some interactions'],
      capabilities: [
        'Versatile for many situations',
        'Reasonable efficiency',
        'Some interaction information',
        'Widely applicable'
      ],
      limitations: [
        'Not optimized for specific objectives',
        'May require more runs than specialized designs',
        'General compromise'
      ],
      assumptions: ['Reasonable factor count', 'Moderate complexity'],
      chapterReference: 'Montgomery Ch. 8',
      requiresReplication: true,
      supportsCenterPoints: true,
      supportsBlocking: true
    };
  }

  private static calculateRunsForComparative(profile: WizardProfile): number {
    const base = 6; // Minimum for comparison
    if (profile.precision === 'high') return base * 2;
    if (profile.precision === 'rough') return Math.max(3, base - 2);
    return base;
  }

  private static calculateRunsForScreening(profile: WizardProfile): number {
    const base = 8;
    if (profile.factorCount === '1-3') return base;
    if (profile.factorCount === '4-6') return base * 2;
    return base * 3;
  }

  private static calculateRunsForOptimization(profile: WizardProfile): number {
    const base = 15;
    if (profile.precision === 'high') return base * 2;
    if (profile.factorCount === '1-3') return base;
    return base * 2;
  }

  private static calculateRunsForFractional(profile: WizardProfile): number {
    const base = 16;
    if (profile.resources === 'limited') return base;
    if (profile.resources === 'unlimited') return base * 2;
    return base;
  }

  private static calculateRunsForFullFactorial(profile: WizardProfile): number {
    const factorCount = parseInt(profile.factorCount.split('-')[0]) || 3;
    const base = Math.pow(2, factorCount);
    if (profile.precision === 'high') return base * 2;
    return base;
  }

  static getDesignExplanation(profile: WizardProfile, recommendation: DesignRecommendation): string {
    const { goal, factorCount, factorTypes, resources, experience, precision } = profile;
    
    let explanation = `Based on your responses, we recommend ${recommendation.name} because:\n\n`;
    
    explanation += `**Primary Goal**: `;
    switch (goal) {
      case 'screening':
        explanation += 'You want to identify important factors from many possibilities, which calls for an efficient screening approach.\n';
        break;
      case 'optimization':
        explanation += 'You need to find optimal settings, requiring a design that can model relationships and predict optimal conditions.\n';
        break;
      case 'comparison':
        explanation += 'You want to compare different treatments or methods, which calls for a design focused on statistical comparison.\n';
        break;
      default:
        explanation += 'Your objective suggests a balanced approach between efficiency and information.\n';
    }
    
    explanation += `**Factor Count**: With ${factorCount} factors, `;
    if (factorCount === '1-3') {
      explanation += 'you can afford more comprehensive designs that provide complete information.\n';
    } else if (factorCount === '4-6') {
      explanation += 'you need designs that balance efficiency with adequate information.\n';
    } else {
      explanation += 'you need highly efficient designs that can handle many factors.\n';
    }
    
    explanation += `**Resource Constraints**: `;
    switch (resources) {
      case 'limited':
        explanation += 'Limited resources require highly efficient designs with minimal runs.\n';
        break;
      case 'moderate':
        explanation += 'Moderate resources allow for balanced designs.\n';
        break;
      case 'unlimited':
        explanation += 'With adequate resources, you can use more comprehensive designs.\n';
        break;
    }
    
    explanation += `**Factor Types**: `;
    switch (factorTypes) {
      case 'quantitative':
        explanation += 'All quantitative factors enable designs that can model mathematical relationships.\n';
        break;
      case 'mixed':
        explanation += 'Mixed factor types require versatile designs that handle different data types.\n';
        break;
      case 'categorical':
        explanation += 'Categorical factors work well with designs focused on comparison and screening.\n';
        break;
    }
    
    explanation += `\n**Experience Level**: As a ${experience} user, this design provides `;
    if (experience === 'beginner') {
      explanation += 'straightforward interpretation and clear results.\n';
    } else if (experience === 'intermediate') {
      explanation += 'a good balance of sophistication and usability.\n';
    } else {
      explanation += 'comprehensive information for advanced analysis.\n';
    }
    
    explanation += `\n**Expected Runs**: ${recommendation.runsRequired} experimental runs are required, which `;
    if (resources === 'limited') {
      explanation += 'fits your resource constraints while still providing valuable insights.';
    } else {
      explanation += 'provides excellent value for the information gained.';
    }
    
    return explanation;
  }
}
