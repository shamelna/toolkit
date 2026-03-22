import React from 'react';

interface HeaderProps {
  currentStage: number;
  totalStages: number;
  pct: number;
}

const Header: React.FC<HeaderProps> = ({ currentStage, totalStages, pct }) => (
  <header className="header">
    <div className="header-inner">

      {/* Brand */}
      <a
        href="https://academy.continuousimprovement.education"
        target="_blank"
        rel="noopener noreferrer"
        className="header-brand"
        aria-label="Kaizen Academy"
      >
        <img
          src="http://practitioner.kaizenacademy.education/logo_round.png"
          alt="Kaizen Academy"
          onError={(e) => {
            const el = e.currentTarget;
            el.style.background = 'var(--yellow)';
            el.style.content = 'KA';
          }}
        />
        <div>
          <div className="brand-name">Kaizen Academy</div>
          <div className="brand-sub">Continuous Improvement Education</div>
        </div>
      </a>

      {/* Centre title */}
      <div className="header-center">
        <div className="app-title">DOE Navigator</div>
        <div className="app-subtitle">Design of Experiments — guided by Montgomery</div>
      </div>

      {/* Stage counter */}
      <div className="header-right">
        <div className="header-stage-info">
          Stage <strong>{currentStage}</strong> of {totalStages}
        </div>
      </div>

    </div>

    {/* Progress stripe */}
    <div className="header-progress">
      <div className="header-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  </header>
);

export default Header;
