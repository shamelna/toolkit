import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-main">

      {/* Brand */}
      <div className="footer-brand">
        <div className="footer-logo-row">
          <img
            src="http://practitioner.kaizenacademy.education/logo_round.png"
            alt="Kaizen Academy"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.background = 'var(--yellow)';
            }}
          />
          <div className="footer-logo-text">
            <div className="brand-name">Kaizen Academy</div>
            <div className="brand-sub">Continuous Improvement</div>
          </div>
        </div>
        <p className="footer-tagline">
          Advancing Continuous Improvement professionals worldwide through
          practical, evidence-based education.
        </p>
        <div className="footer-cert">
          <span>🇦🇺</span> Certificates by Kaizen Academy Australia
        </div>
        <p className="footer-col p" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Built on Douglas C. Montgomery's{' '}
          <em>Design and Analysis of Experiments</em> (Wiley).
        </p>
      </div>

      {/* Courses */}
      <div className="footer-col">
        <h3 className="footer-col-heading">Our Courses</h3>
        {[
          ['Scientific Problem Solving',            'https://academy.continuousimprovement.education/p/en-home'],
          ['Business Process Management',           'https://academy.continuousimprovement.education/p/business-process-management'],
          ['Value Stream Mapping',                  'https://academy.continuousimprovement.education/p/advanced-value-stream-mapping'],
          ['Toyota Production System & Lean',       'https://academy.continuousimprovement.education/p/toyota-production-system-and-lean-fundamentals1'],
          ['Lean Practitioner Certification',       'https://academy.continuousimprovement.education/p/certified-lean-practitioner-training-bundle'],
        ].map(([label, href]) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
        ))}
      </div>

      {/* Connect */}
      <div className="footer-col">
        <h3 className="footer-col-heading">Connect</h3>
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/company/theciacademy"
            target="_blank" rel="noopener noreferrer"
            className="social-link" aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@ContinuousImprovementAcademy"
            target="_blank" rel="noopener noreferrer"
            className="social-link" aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        <p className="footer-col p" style={{ marginTop: 8 }}>
          Questions? Reach us at{' '}
          <a href="mailto:hello@kaizenacademy.education" style={{ color: 'var(--yellow)' }}>
            hello@kaizenacademy.education
          </a>
        </p>
      </div>

    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Kaizen Academy Australia. All rights reserved.</p>
      <p>DOE Navigator — Built for Lean Six Sigma Practitioners</p>
    </div>
  </footer>
);

export default Footer;
