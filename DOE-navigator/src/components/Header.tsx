import React from 'react';

interface HeaderProps {
  currentStage: number;
  totalStages: number;
}

const Header: React.FC<HeaderProps> = ({ currentStage, totalStages }) => {
  const getProgressPercentage = () => {
    return (currentStage / totalStages) * 100;
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Left side - Logo and Brand */}
        <div className="header-brand">
          <img 
            src="http://practitioner.kaizenacademy.education/logo_round.png"
            alt="Kaizen Academy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.background = 'var(--kaizen-yellow)';
              target.style.content = 'KA';
            }}
          />
          <div className="brand-text">
            <div className="brand-name">KAIZEN ACADEMY</div>
            <div className="brand-sub">Continuous Improvement Education</div>
          </div>
        </div>

        {/* Center - App Title (Desktop only) */}
        <div className="header-center">
          <div className="app-title">DOE Navigator</div>
          <div className="app-subtitle">Design of Experiments — Guided by Montgomery</div>
        </div>

        {/* Right side - Badge */}
        <div className="header-right">
          <div className="powered-badge">Powered by Montgomery's DOE</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
    </header>
  );
};

export default Header;
