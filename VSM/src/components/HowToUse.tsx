import React from 'react';
import { HelpCircle, Play, Calculator, Clock, Users, Package, TrendingUp, ArrowRight } from 'lucide-react';

const HowToUse = () => {
  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <HelpCircle className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">How to Use VSM Calculator</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Learn how to effectively use each calculator to analyze and improve your value stream
          </p>
        </div>

        {/* Getting Started */}
        <div className="card mb-8">
          <h2 className="heading-medium mb-6" style={{ color: '#1a1a1a' }}>
            Getting Started
          </h2>
          <div className="text-body text-muted" style={{ lineHeight: '1.8' }}>
            <p className="mb-4">
              The VSM Calculator provides four essential tools for value stream mapping analysis. Each calculator is designed to help you understand different aspects of your production system and identify opportunities for improvement.
            </p>
            <div className="grid-2" style={{ gap: '40px', marginTop: '32px' }}>
              <div>
                <h3 className="heading-small mb-4" style={{ color: '#ffd559' }}>Choose Your Calculator</h3>
                <p className="mb-4">
                  Select from four specialized calculators based on what you want to analyze:
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li className="mb-2"><strong>Takt Time:</strong> Production pace needed to meet customer demand</li>
                  <li className="mb-2"><strong>Inventory & Lead Time:</strong> Analyze inventory levels and production flow</li>
                  <li className="mb-2"><strong>Process Capacity:</strong> Determine operator requirements and utilization</li>
                  <li className="mb-2"><strong>Kanban & Leveling:</strong> Design pull systems and production leveling</li>
                </ul>
              </div>
              <div>
                <h3 className="heading-small mb-4" style={{ color: '#ffd559' }}>Auto-Calculation Feature</h3>
                <p className="mb-4">
                  All calculators feature real-time auto-calculation - no need to press buttons! Results update automatically as you enter your data.
                </p>
                <div className="card" style={{ background: 'rgba(255, 213, 89, 0.1)', border: '2px solid #ffd559', padding: '20px' }}>
                  <h4 className="text-small font-bold mb-2">💡 Pro Tip</h4>
                  <p className="text-small">
                    Start with data you have available. The calculators will guide you through what information you need for each analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guides */}
        <div className="grid-2" style={{ gap: '40px' }}>
          {/* Takt Time Guide */}
          <div className="card">
            <h3 className="heading-medium mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-3" style={{ color: '#4CAF50' }} />
              Takt Time Calculator
            </h3>
            <div className="text-body text-muted">
              <h4 className="heading-small mb-3">Step 1: Enter Available Time</h4>
              <p className="mb-4">
                Input your total available working time per shift (in seconds). This excludes breaks, meetings, and planned downtime.
              </p>
              
              <h4 className="heading-small mb-3">Step 2: Add Customer Demand</h4>
              <p className="mb-4">
                Enter the number of units customers need per shift. This drives your required production pace.
              </p>
              
              <h4 className="heading-small mb-3">Step 3: Review Results</h4>
              <p className="mb-4">
                The calculator shows your takt time and provides examples from real-world scenarios.
              </p>
              
              <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5', padding: '16px' }}>
                <h5 className="text-small font-bold mb-2">📊 What Takt Time Tells You:</h5>
                <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>Production pace needed per unit</li>
                  <li>Whether you are meeting customer demand</li>
                  <li>Basis for operator capacity planning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inventory Calculator Guide */}
          <div className="card">
            <h3 className="heading-medium mb-4 flex items-center">
              <Package className="w-6 h-6 mr-3" style={{ color: '#2196F3' }} />
              Inventory & Lead Time Calculator
            </h3>
            <div className="text-body text-muted">
              <h4 className="heading-small mb-3">Step 1: Input Demand Data</h4>
              <p className="mb-4">
                Enter daily customer demand and current inventory levels to establish your baseline.
              </p>
              
              <h4 className="heading-small mb-3">Step 2: Map Your Timeline</h4>
              <p className="mb-4">
                Use the timeline section to add wait times and process times for each inventory stage.
              </p>
              
              <h4 className="heading-small mb-3">Step 3: Analyze Results</h4>
              <p className="mb-4">
                Review inventory days, lead time, and value-added ratio to identify improvement opportunities.
              </p>
              
              <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5', padding: '16px' }}>
                <h5 className="text-small font-bold mb-2">📈 Key Insights:</h5>
                <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>How much inventory you actually need</li>
                  <li>Where your bottlenecks are occurring</li>
                  <li>Percentage of value-added time vs. total time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Process Capacity & Kanban Guides */}
        <div className="grid-2" style={{ gap: '40px' }}>
          {/* Process Capacity Guide */}
          <div className="card">
            <h3 className="heading-medium mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3" style={{ color: '#9C27B0' }} />
              Process Capacity Calculator
            </h3>
            <div className="text-body text-muted">
              <h4 className="heading-small mb-3">Step 1: Define Work Content</h4>
              <p className="mb-4">
                Enter the total work content time required to produce one unit, including all manual operations.
              </p>
              
              <h4 className="heading-small mb-3">Step 2: Set Takt Time</h4>
              <p className="mb-4">
                Input your required takt time based on customer demand and available production time.
              </p>
              
              <h4 className="heading-small mb-3">Step 3: Optimize Operator Allocation</h4>
              <p className="mb-4">
                Use results to determine the optimal number of operators and balance work across stations.
              </p>
              
              <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5', padding: '16px' }}>
                <h5 className="text-small font-bold mb-2">⚖️ Balance Metrics:</h5>
                <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>Process capacity vs. customer demand</li>
                  <li>Operator utilization rates</li>
                  <li>Work balance across stations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kanban Guide */}
          <div className="card">
            <h3 className="heading-medium mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#DC2626' }} />
              Kanban & Leveling Calculator
            </h3>
            <div className="text-body text-muted">
              <h4 className="heading-small mb-3">Step 1: Determine Pitch</h4>
              <p className="mb-4">
                Calculate pitch based on takt time and pack-out quantity to establish withdrawal intervals.
              </p>
              
              <h4 className="heading-small mb-3">Step 2: Design Kanban System</h4>
              <p className="mb-4">
                Use results to determine kanban quantities and supermarket sizing.
              </p>
              
              <h4 className="heading-small mb-3">Step 3: Plan Production Leveling</h4>
              <p className="mb-4">
                Analyze leveling box requirements and changeover capacity for mixed-model production.
              </p>
              
              <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5', padding: '16px' }}>
                <h5 className="text-small font-bold mb-2">🔄 Pull System Insights:</h5>
                <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>Kanban cards needed per shift</li>
                  <li>Optimal withdrawal intervals</li>
                  <li>Changeover capacity analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="card">
          <h2 className="heading-medium mb-6" style={{ color: '#1a1a1a' }}>
            Best Practices & Tips
          </h2>
          <div className="grid-3" style={{ gap: '30px' }}>
            <div className="card" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#4CAF50' }}>📊 Data Accuracy</h4>
              <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Use actual production data, not estimates</li>
                <li>Measure multiple cycles for accuracy</li>
                <li>Include all downtime and breaks in available time</li>
                <li>Verify customer demand with sales data</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: 'rgba(33, 150, 243, 0.1)', border: '1px solid #2196F3', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#2196F3' }}>🎯 Continuous Improvement</h4>
              <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Recalculate regularly as conditions change</li>
                <li>Track trends over time</li>
                <li>Use results to identify improvement projects</li>
                <li>Share findings with your team</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid #DC2626', padding: '20px' }}>
              <h4 className="heading-small mb-3" style={{ color: '#DC2626' }}>💡 Advanced Usage</h4>
              <ul style={{ paddingLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Combine multiple calculators for complete analysis</li>
                <li>Use results for value stream mapping</li>
                <li>Apply to both current and future state design</li>
                <li>Document assumptions and methodology</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card-elevated" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 className="heading-medium mb-4" style={{ color: '#1a1a1a' }}>
            Ready for Advanced Value Stream Mapping?
          </h2>
          <p className="text-body text-muted mb-6" style={{ maxWidth: '600px', margin: '0 auto' }}>
            These calculators provide the data you need. The next step is learning how to create comprehensive value stream maps and design lean future states.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://academy.continuousimprovement.education/p/advanced-value-stream-mapping"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Play className="w-5 h-5" />
              Take Advanced VSM Course
            </a>
            <a 
              href="https://practitioner.kaizenacademy.education/"
              className="btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Calculator className="w-5 h-5" />
              Get Certified
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
