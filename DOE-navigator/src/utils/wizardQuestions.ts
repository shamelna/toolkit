import type { WizardQuestion } from '../types';

export const wizardQuestions: WizardQuestion[] = [
  {
    id: 'goal',
    section: 'Problem Understanding',
    question: 'What is your primary goal for this experiment?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'screening',
        text: 'Screening',
        value: 'screening',
        description: 'I have many factors and want to identify which ones actually matter',
        icon: '🔍'
      },
      {
        id: 'optimization',
        text: 'Optimization',
        value: 'optimization',
        description: 'I know my key factors and want to find the best settings',
        icon: '⚡'
      },
      {
        id: 'comparison',
        text: 'Comparison',
        value: 'comparison',
        description: 'I want to compare two or more treatments, methods, or conditions',
        icon: '⚖️'
      },
      {
        id: 'confirmation',
        text: 'Confirmation',
        value: 'confirmation',
        description: 'I want to verify that a known solution works as expected',
        icon: '✅'
      },
      {
        id: 'discovery',
        text: 'Discovery',
        value: 'discovery',
        description: 'I\'m exploring new territory with no strong prior hypothesis',
        icon: '🔬'
      },
      {
        id: 'robustness',
        text: 'Robustness',
        value: 'robustness',
        description: 'I want my process to be insensitive to noise factors I can\'t control',
        icon: '🛡️'
      }
    ]
  },
  {
    id: 'factor-count',
    section: 'Problem Understanding',
    question: 'How many factors are you considering?',
    type: 'single',
    required: true,
    options: [
      {
        id: '1-3',
        text: '1-3 factors',
        value: '1-3',
        description: 'A small number of key variables to investigate'
      },
      {
        id: '4-6',
        text: '4-6 factors',
        value: '4-6',
        description: 'A moderate number of potential factors'
      },
      {
        id: '7+',
        text: '7+ factors',
        value: '7+',
        description: 'Many potential factors that need investigation'
      }
    ]
  },
  {
    id: 'factor-types',
    section: 'Problem Understanding',
    question: 'What type of factors are you working with?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'quantitative',
        text: 'All quantitative',
        value: 'quantitative',
        description: 'All factors can be measured on a numerical scale (temperature, pressure, etc.)'
      },
      {
        id: 'mixed',
        text: 'Mixed types',
        value: 'mixed',
        description: 'Combination of numerical and categorical factors'
      },
      {
        id: 'categorical',
        text: 'All categorical',
        value: 'categorical',
        description: 'All factors are categories or types (material types, methods, etc.)'
      }
    ]
  },
  {
    id: 'resources',
    section: 'Problem Understanding',
    question: 'What are your resource constraints?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'limited',
        text: 'Limited resources',
        value: 'limited',
        description: 'I have strict constraints on time, budget, or number of runs'
      },
      {
        id: 'moderate',
        text: 'Moderate resources',
        value: 'moderate',
        description: 'I have reasonable resources but want to be efficient'
      },
      {
        id: 'unlimited',
        text: 'No significant constraints',
        value: 'unlimited',
        description: 'I have adequate resources for thorough investigation'
      }
    ]
  },
  {
    id: 'industry',
    section: 'Experimental Context',
    question: 'What industry or application area are you working in?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'manufacturing',
        text: 'Manufacturing',
        value: 'manufacturing',
        description: 'Production processes, quality control, process optimization'
      },
      {
        id: 'healthcare',
        text: 'Healthcare',
        value: 'healthcare',
        description: 'Medical treatments, clinical trials, healthcare processes'
      },
      {
        id: 'research',
        text: 'Research',
        value: 'research',
        description: 'Scientific research, academic studies, experiments'
      },
      {
        id: 'software',
        text: 'Software',
        value: 'software',
        description: 'Software testing, user experience, algorithm optimization'
      },
      {
        id: 'other',
        text: 'Other',
        value: 'other',
        description: 'Other industries or applications'
      }
    ]
  },
  {
    id: 'experience',
    section: 'Experimental Context',
    question: 'What is your experience level with Design of Experiments?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'beginner',
        text: 'Beginner',
        value: 'beginner',
        description: 'This is my first time using DOE or I need a refresher'
      },
      {
        id: 'intermediate',
        text: 'Intermediate',
        value: 'intermediate',
        description: 'I have some DOE experience and understand the basics'
      },
      {
        id: 'advanced',
        text: 'Advanced',
        value: 'advanced',
        description: 'I\'m experienced with DOE and understand advanced concepts'
      }
    ]
  },
  {
    id: 'urgency',
    section: 'Experimental Context',
    question: 'How urgent is your timeline?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'urgent',
        text: 'Urgent',
        value: 'urgent',
        description: 'I need results quickly and have tight deadlines'
      },
      {
        id: 'normal',
        text: 'Normal',
        value: 'normal',
        description: 'Standard timeline with reasonable deadlines'
      },
      {
        id: 'flexible',
        text: 'Flexible',
        value: 'flexible',
        description: 'I have flexibility in timing and can be thorough'
      }
    ]
  },
  {
    id: 'precision',
    section: 'Factor Details',
    question: 'What level of measurement precision do you need?',
    type: 'single',
    required: true,
    options: [
      {
        id: 'high',
        text: 'High precision',
        value: 'high',
        description: 'I need very precise measurements and tight control'
      },
      {
        id: 'standard',
        text: 'Standard precision',
        value: 'standard',
        description: 'Normal measurement precision is sufficient'
      },
      {
        id: 'rough',
        text: 'Rough estimates',
        value: 'rough',
        description: 'I can work with approximate values and trends'
      }
    ],
    explanation: 'This helps determine the appropriate level of experimental complexity and replication needed.'
  }
];
