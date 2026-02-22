import React from 'react';

const KaizenHeader = () => {
  return (
    <header className="ka-header">
      <div className="ka-header-inner">
        {/* Logo + Brand */}
        <a href="https://academy.continuousimprovement.education" className="ka-brand">
          <img 
            src="http://practitioner.kaizenacademy.education/logo_round.png" 
            alt="Kaizen Academy Logo" 
          />
          <div className="ka-brand-name">
            Kaizen Academy
            <span>Continuous Improvement</span>
          </div>
        </a>

        {/* Navigation */}
        <ul className="ka-nav">
          <li><a href="https://academy.continuousimprovement.education/p/toyota-production-system-and-lean-fundamentals1">TPS & Lean</a></li>
          <li><a href="https://academy.continuousimprovement.education/p/advanced-value-stream-mapping">Value Stream</a></li>
          <li><a href="https://academy.continuousimprovement.education/p/business-process-management">BPM</a></li>
          <li><a href="https://academy.continuousimprovement.education/p/en-home">Problem Solving</a></li>
          <li><a href="https://practitioner.kaizenacademy.education/" className="ka-btn">Get Certified</a></li>
        </ul>
      </div>
    </header>
  );
};

export default KaizenHeader;
