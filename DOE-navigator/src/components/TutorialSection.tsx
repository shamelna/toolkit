import React, { useState } from 'react';
import { Book, ChevronRight, ChevronDown, Play, Lightbulb, Target, BarChart3, FlaskConical, Zap } from 'lucide-react';

interface TutorialSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  content: {
    overview: string;
    whenToUse: string[];
    keyBenefits: string[];
    example: {
      scenario: string;
      factors: string[];
      design: string;
      runs: number;
      outcome: string;
    };
    steps: string[];
  };
}

const tutorialSections: TutorialSection[] = [
  {
    id: 'comparative',
    title: 'Comparative Study Design',
    icon: <Target className="w-5 h-5" />,
    description: 'Compare different treatments or methods to find the best option',
    difficulty: 'Beginner',
    estimatedTime: '5 min',
    content: {
      overview: 'Comparative studies are the simplest form of DOE, designed to compare two or more treatments, methods, or conditions to determine which performs best.',
      whenToUse: [
        'Comparing different suppliers or vendors',
        'Testing alternative manufacturing processes',
        'Evaluating different marketing strategies',
        'Choosing between software algorithms'
      ],
      keyBenefits: [
        'Simple to understand and implement',
        'Statistically rigorous comparison',
        'Minimal experimental runs required',
        'Clear, actionable results'
      ],
      example: {
        scenario: 'A manufacturing company wants to compare three different cutting tools to determine which provides the best surface finish.',
        factors: ['Cutting Tool Type'],
        design: 'Completely Randomized Design',
        runs: 12,
        outcome: 'Tool B provides 23% better surface finish than Tools A and C'
      },
      steps: [
        'Define your treatments (what you\'re comparing)',
        'Determine sample size for each treatment',
        'Randomize the order of experiments',
        'Measure response variable consistently',
        'Use ANOVA to test for significant differences',
        'Apply post-hoc tests to identify the best option'
      ]
    }
  },
  {
    id: 'screening',
    title: 'Screening Design (Plackett-Burman)',
    icon: <FlaskConical className="w-5 h-5" />,
    description: 'Identify important factors from many possibilities efficiently',
    difficulty: 'Intermediate',
    estimatedTime: '8 min',
    content: {
      overview: 'Screening designs help you identify which factors significantly affect your response when you have many potential factors but limited resources.',
      whenToUse: [
        'New process development with many variables',
        'Quality improvement projects',
        'Troubleshooting manufacturing issues',
        'Research with multiple potential causes'
      ],
      keyBenefits: [
        'Test many factors with few runs',
        'Identify "vital few" from "trivial many"',
        'Resource-efficient experimentation',
        'Quick preliminary insights'
      ],
      example: {
        scenario: 'A chemical plant has 7 potential factors affecting yield and needs to identify which ones matter most.',
        factors: ['Temperature', 'Pressure', 'Catalyst', 'Flow Rate', 'pH', 'Time', 'Concentration'],
        design: 'Plackett-Burman Design',
        runs: 8,
        outcome: 'Temperature and Catalyst are the two most significant factors'
      },
      steps: [
        'List all potential factors (5-15 factors typical)',
        'Choose appropriate Plackett-Burman design',
        'Run experiments in randomized order',
        'Calculate main effects for each factor',
        'Create Pareto chart to identify significant factors',
        'Focus follow-up experiments on significant factors only'
      ]
    }
  },
  {
    id: 'factorial',
    title: 'Full Factorial Design',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Study all factor combinations and interactions comprehensively',
    difficulty: 'Intermediate',
    estimatedTime: '10 min',
    content: {
      overview: 'Full factorial designs examine all possible combinations of factor levels, providing complete information about main effects and interactions.',
      whenToUse: [
        'Critical process optimization',
        'New product development',
        'Research requiring complete understanding',
        'When interactions are expected to be important'
      ],
      keyBenefits: [
        'Complete information about all effects',
        'Identifies interactions between factors',
        'No confounding of effects',
        'Predictive model development'
      ],
      example: {
        scenario: 'A bakery wants to optimize bread quality by studying temperature and baking time interactions.',
        factors: ['Temperature', 'Baking Time'],
        design: '2² Full Factorial Design',
        runs: 4,
        outcome: 'Optimal at 375°F for 25 minutes with significant interaction effect'
      },
      steps: [
        'Select 2-4 factors for comprehensive study',
        'Choose 2-3 levels for each factor',
        'Create full factorial matrix (2^k runs)',
        'Randomize run order to avoid bias',
        'Analyze main effects and interaction plots',
        'Develop regression model for prediction'
      ]
    }
  },
  {
    id: 'fractional',
    title: 'Fractional Factorial Design',
    icon: <Zap className="w-5 h-5" />,
    description: 'Balance efficiency with information for moderate factor counts',
    difficulty: 'Advanced',
    estimatedTime: '12 min',
    content: {
      overview: 'Fractional factorial designs use a carefully selected subset of runs from a full factorial, providing good information while being resource-efficient.',
      whenToUse: [
        '4-8 factors need investigation',
        'Budget or time constraints exist',
        'Main effects are primary interest',
        'Some interaction information is acceptable'
      ],
      keyBenefits: [
        'Reduces experimental runs dramatically',
        'Still provides main effect information',
        'Some interaction data available',
        'Cost-effective for many factors'
      ],
      example: {
        scenario: 'An electronics company studies 5 factors affecting circuit board performance with limited testing time.',
        factors: ['Solder Temp', 'PCB Thickness', 'Component Spacing', 'Cooling Rate', 'Material Grade'],
        design: '2^(5-1) Fractional Factorial',
        runs: 16,
        outcome: 'Solder Temp and Component Spacing are critical, with one significant interaction'
      },
      steps: [
        'Select 4-8 factors for study',
        'Choose resolution (III, IV, or V) based on goals',
        'Generate fractional factorial design matrix',
        'Understand confounding structure',
        'Run experiments and analyze effects',
        'Consider follow-up experiments for clarification'
      ]
    }
  },
  {
    id: 'response-surface',
    title: 'Response Surface Methodology',
    icon: <Lightbulb className="w-5 h-5" />,
    description: 'Find optimal settings and model curved relationships',
    difficulty: 'Advanced',
    estimatedTime: '15 min',
    content: {
      overview: 'Response Surface Methodology (RSM) designs help you find optimal factor settings and model curved relationships for quantitative factors.',
      whenToUse: [
        'Process optimization after screening',
        'Finding optimal operating conditions',
        'Developing predictive models',
        'When curvature is expected'
      ],
      keyBenefits: [
        'Finds optimal factor settings',
        'Models quadratic relationships',
        'Predicts response across design space',
        'Efficient optimization tool'
      ],
      example: {
        scenario: 'A pharmaceutical company optimizes drug formulation to maximize yield while minimizing impurities.',
        factors: ['Reaction Temperature', 'pH', 'Catalyst Concentration'],
        design: 'Central Composite Design',
        runs: 15,
        outcome: 'Optimal at 85°C, pH 7.2, 2.5% catalyst with 94% yield'
      },
      steps: [
        'Start with significant factors from screening',
        'Choose RSM design (Central Composite or Box-Behnken)',
        'Include center points for curvature detection',
        'Add axial points for quadratic terms',
        'Fit quadratic regression model',
        'Use contour plots and optimization algorithms'
      ]
    }
  }
];

const TutorialSection: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'example' | 'steps'>('overview');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setActiveTab('overview');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Book className="w-8 h-8 text-yellow-600" />
          <h2 className="text-3xl font-bold text-gray-900">DOE Tutorial</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Learn about key experimental designs through practical examples and step-by-step guidance
        </p>
      </div>

      {/* Tutorial Sections */}
      <div className="space-y-4">
        {tutorialSections.map((section) => (
          <div key={section.id} className="factor-item">
            <div
              className="section-header cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="form-label mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                      {section.difficulty}
                    </span>
                    <span className="text-gray-500">{section.estimatedTime}</span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedSection === section.id && (
              <div className="mt-4">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                  {['overview', 'example', 'steps'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
                        <p className="text-gray-700">{section.content.overview}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">When to Use</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {section.content.whenToUse.map((item, index) => (
                            <li key={index} className="text-gray-700">{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Benefits</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {section.content.keyBenefits.map((benefit, index) => (
                            <li key={index} className="text-gray-700">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'example' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Practical Example</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Scenario:</span>
                          <p className="text-gray-600 mt-1">{section.content.example.scenario}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Factors:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {section.content.example.factors.map((factor, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <span className="font-medium text-gray-700">Design:</span>
                            <p className="text-gray-600">{section.content.example.design}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Runs Required:</span>
                            <p className="text-gray-600">{section.content.example.runs}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Outcome:</span>
                            <p className="text-gray-600">{section.content.example.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'steps' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps</h4>
                      <ol className="space-y-2">
                        {section.content.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Quick Action */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Play className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Ready to try this design?</p>
                      <p className="mt-1">
                        Use the Quick Wizard to get recommendations based on your specific situation, 
                        or start with the detailed DOE Navigator for comprehensive planning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Getting Started with DOE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-800 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900">Define Your Problem</h4>
            <p className="text-sm text-gray-600 mt-1">Clearly state what you want to achieve</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-800 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900">Choose Your Design</h4>
            <p className="text-sm text-gray-600 mt-1">Select the appropriate experimental design</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-800 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900">Execute & Analyze</h4>
            <p className="text-sm text-gray-600 mt-1">Run experiments and analyze results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialSection;
