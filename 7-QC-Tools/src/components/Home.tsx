import React, { useEffect } from 'react';
import { Shield, BarChart3, GitBranch, CheckCircle, TrendingUp, LineChart, Activity, Target, Download } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface HomeProps {
  onNavigate?: (tool: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  useEffect(() => {
    // Set countdown to 48 hours from page load
    const end = Date.now() + 48 * 60 * 60 * 1000;

    function tick() {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      
      const hoursEl = document.getElementById('ka-hours');
      const minsEl = document.getElementById('ka-mins');
      const secsEl = document.getElementById('ka-secs');
      
      if (hoursEl) hoursEl.textContent = String(h).padStart(2,'0');
      if (minsEl) minsEl.textContent = String(m).padStart(2,'0');
      if (secsEl) secsEl.textContent = String(s).padStart(2,'0');
      
      if (diff > 0) requestAnimationFrame(tick);
    }
    tick();
  }, []);
  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          title="7 QC TOOLS"
          subtitle="Professional quality control toolkit based on Dr. Kaoru Ishikawa's proven methodologies for manufacturing excellence"
        />

        {/* Tools Grid */}
        <div className="grid-3 mb-12" style={{ gap: '20px' }}>
          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('histogram')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="heading-small">Histogram</h3>
                <p className="text-body mb-4">
                  Display distribution of continuous measurement data to understand process capability and identify patterns.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('checksheet')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="heading-small">Check Sheets</h3>
                <p className="text-body mb-4">
                  Structured forms for collecting data at the point of occurrence with immediate visual feedback.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('pareto')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="heading-small">Pareto Chart</h3>
                <p className="text-body mb-4">
                  Identify vital few problems that cause majority of issues using the 80/20 principle.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('fishbone')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <GitBranch className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="heading-small">Cause & Effect Diagram</h3>
                <p className="text-body mb-4">
                  Systematic root cause analysis using fishbone diagrams to identify all potential causes.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('graphs')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <LineChart className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="heading-small">Graphs</h3>
                <p className="text-body mb-4">
                  Visualize data trends and comparisons clearly with line graphs, bar charts, and pie charts.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('control')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="heading-small">Control Charts</h3>
                <p className="text-body mb-4">
                  Monitor process stability over time using statistical process control methods.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onNavigate?.('scatter')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h3 className="heading-small">Scatter Diagram</h3>
                <p className="text-body mb-4">
                  Determine relationships between two variables and analyze cause-effect correlations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="card-featured">
          <h2 className="heading-medium mb-4">About 7 QC Tools</h2>
          <div className="text-body text-muted">
            <p className="mb-4">
              Based on Dr. Kaoru Ishikawa's "Guide to Quality Control" (1976), these 7 fundamental tools provide a complete system for quality management and process improvement.
            </p>
            
            <div className="mb-6">
              <h3 className="heading-small mb-3">Core Methodologies</h3>
              <ul className="space-y-2 ml-6">
                <li className="text-body">
                  <strong>Histogram Analysis:</strong> Understanding data distribution and process capability
                </li>
                <li className="text-body">
                  <strong>Cause and Effect Diagrams:</strong> Systematic root cause analysis using fishbone charts
                </li>
                <li className="text-body">
                  <strong>Check Sheets:</strong> Structured data collection at the source
                </li>
                <li className="text-body">
                  <strong>Pareto Analysis:</strong> Identifying vital few problems (80/20 rule)
                </li>
                <li className="text-body">
                  <strong>Graphs and Charts:</strong> Visualizing trends and comparisons
                </li>
                <li className="text-body">
                  <strong>Control Charts:</strong> Statistical process monitoring (SPC)
                </li>
                <li className="text-body">
                  <strong>Scatter Diagrams:</strong> Analyzing variable relationships
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="heading-small mb-3">Ishikawa's Philosophy</h3>
              <p className="text-body mb-4">
                "The various QC techniques are tools for doing the job, not ends in themselves. 
                Quality control means understanding the current situation and implementing improvements based on data, not intuition."
              </p>
              <blockquote className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-lg my-4">
                <em className="text-body">
                  Focus on the vital few problems that yield the greatest improvement, rather than trying to solve everything at once.
                </em>
              </blockquote>
            </div>

          <div>
              <h3 className="heading-small mb-3">Excel Templates</h3>
              <p className="text-body mb-4">
                Download Excel templates with example data for each QC tool to get started quickly.
              </p>
              <a 
                href="/templates.xlsx" 
                download="templates.xlsx"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Excel Templates
              </a>
            </div>
          </div>
        </div>

        {/* Course Promotion Section */}
        <div className="mt-12">
          <div className="ka-promo-wrap">
            <div className="ka-promo-inner">
              {/* LEFT PANEL */}
              <div className="ka-left">
                <div className="ka-badge">⚡ 48-Hour Flash Sale</div>
                <h2 className="ka-headline">Scientific<br/>Problem<br/><span>Solving</span></h2>
                <p className="ka-sub">Master the 7 QC Tools used by quality leaders worldwide. Stop guessing — start solving with data.</p>
                <ul className="ka-features">
                  <li>7 Quality Control Tools — complete mastery</li>
                  <li>A3 Thinking & Root Cause Analysis</li>
                  <li>Excel templates, PDF tutorials & coaching</li>
                  <li>Lifetime access — learn at your own pace</li>
                  <li>Certificate by Kaizen Academy Australia</li>
                </ul>
                <div className="ka-instructor">
                  <div className="ka-instructor-icon">AR</div>
                  <div className="ka-instructor-text">
                    <strong>Ahmed Radwan</strong>
                    Lean Six Sigma Master Black Belt · 15+ years experience · 5,000+ learners
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="ka-right">
                <div>
                  <div className="ka-timer-label">⏳ Offer expires in</div>
                  <div className="ka-timer">
                    <div className="ka-timer-block">
                      <span className="ka-timer-num" id="ka-hours">48</span>
                      <span className="ka-timer-unit">Hours</span>
                    </div>
                    <div className="ka-timer-block">
                      <span className="ka-timer-num" id="ka-mins">00</span>
                      <span className="ka-timer-unit">Mins</span>
                    </div>
                    <div className="ka-timer-block">
                      <span className="ka-timer-num" id="ka-secs">00</span>
                      <span className="ka-timer-unit">Secs</span>
                    </div>
                  </div>

                  <div className="ka-pricing">
                    <div className="ka-original">Regular price: $180</div>
                    <div className="ka-price-row">
                      <div className="ka-price-now"><sup>$</sup>108</div>
                      <div className="ka-save-pill">Save 40%</div>
                    </div>
                  </div>

                  <div className="ka-code-box">
                    <div>
                      <span className="ka-code-label">Promo Code</span>
                      <span className="ka-code-value">KAIZEN40</span>
                    </div>
                    <button className="ka-copy-btn" onClick={(e) => {
                      const btn = e.currentTarget;
                      navigator.clipboard.writeText('KAIZEN40').then(() => {
                        btn.textContent = 'Copied!';
                        setTimeout(() => btn.textContent = 'Copy', 2000);
                      });
                    }}>Copy</button>
                  </div>

                  <a className="ka-cta" href="https://academy.continuousimprovement.education/p/en-home?coupon_code=kaizen40" target="_blank" rel="noopener noreferrer">
                    Claim 40% Off — Enrol Now →
                  </a>
                  <p className="ka-guarantee">🛡 <span>7-day money-back guarantee</span> · No risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
