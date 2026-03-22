import React from 'react';
import { Calculator, Activity, Clock, TrendingUp, ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (tool: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const tools = [
    {
      id: 'oee',
      name: 'OEE Calculator',
      description: 'Overall Equipment Effectiveness - The master TPM metric combining availability, performance, and quality',
      icon: Calculator,
      color: 'bg-yellow-100 text-yellow-800',
      features: ['Availability', 'Performance', 'Quality Rate', 'TEEP', 'World-Class Benchmarks']
    },
    {
      id: 'reliability',
      name: 'Reliability Metrics',
      description: 'Equipment reliability analysis including MTBF, MTTR, and failure rate calculations',
      icon: Activity,
      color: 'bg-blue-100 text-blue-800',
      features: ['MTBF', 'MTTR', 'Failure Rate', 'Reliability %', 'Bathtub Curve']
    },
    {
      id: 'mtbf',
      name: 'MTBF Analysis',
      description: 'Mean Time Between Failures analysis for maintenance planning and reliability tracking',
      icon: Clock,
      color: 'bg-green-100 text-green-800',
      features: ['Failure Tracking', 'Trend Analysis', 'Maintenance Planning', 'Component Life']
    },
    {
      id: 'performance',
      name: 'Performance Analysis',
      description: 'Equipment performance efficiency and utilization rate analysis',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800',
      features: ['Performance Efficiency', 'Utilization Rate', 'Speed Losses', 'Capacity Analysis']
    }
  ];

  return (
    <div className="section">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="heading-large text-dark mb-4">
            TPM Calculations Toolkit
          </h1>
          <p className="text-body text-muted max-w-3xl mx-auto mb-8">
            Professional Total Productive Maintenance calculations based on Seiichi Nakajima's authoritative TPM methodology. 
            Calculate and analyze 12 core TPM KPIs with world-class benchmarking.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
              <span className="font-semibold text-yellow-800">12 KPIs</span>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="font-semibold text-blue-800">Nakajima Sources</span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <span className="font-semibold text-green-800">World-Class Targets</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid-2 mb-12">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="card hover:shadow-lg cursor-pointer transition-all duration-200 group"
                onClick={() => onNavigate(tool.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted group-hover:text-yellow-500 transition-colors" />
                </div>
                
                <h3 className="heading-medium text-dark mb-2">{tool.name}</h3>
                <p className="text-muted mb-4 text-sm leading-relaxed">{tool.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-50 text-muted text-xs rounded-full border border-gray-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* TPM Info Section */}
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h2 className="heading-medium text-dark mb-6">About TPM Methodology</h2>
          <div className="grid-2">
            <div>
              <h3 className="font-semibold text-dark mb-3">Based on Seiichi Nakajima</h3>
              <p className="text-sm text-muted leading-relaxed">
                All calculations are based on the authoritative TPM literature from Seiichi Nakajima, 
                the founder of Total Productive Maintenance methodology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-3">12 Core KPIs</h3>
              <p className="text-sm text-muted leading-relaxed">
                Comprehensive coverage of equipment effectiveness, reliability, and maintainability metrics 
                that form the foundation of TPM analysis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-3">World-Class Benchmarks</h3>
              <p className="text-sm text-muted leading-relaxed">
                Compare your performance against world-class targets: OEE {'≥'}85%, Availability {'>'}90%, 
                Performance {'>'}95%, Quality {'>'}99%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
