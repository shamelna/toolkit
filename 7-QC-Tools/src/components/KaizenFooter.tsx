import React from 'react';

const KaizenFooter = () => {
  return (
    <footer className="ka-footer">
      <div className="ka-footer-inner">
        {/* Grid */}
        <div className="ka-footer-grid">
          {/* Brand column */}
          <div className="ka-footer-brand">
            <a href="https://academy.continuousimprovement.education">
              <img 
                src="http://practitioner.kaizenacademy.education/logo_round.png" 
                alt="Kaizen Academy Logo" 
              />
              <div className="ka-footer-brand-name">
                Kaizen Academy
                <span>Continuous Improvement</span>
              </div>
            </a>
            <p className="ka-footer-tagline">
              Practical lean & continuous improvement training for professionals worldwide.
            </p>
            {/* Social */}
            <div className="ka-social">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/theciacademy" 
                aria-label="LinkedIn" 
                target="_blank" 
                rel="noopener"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.22 0z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@ContinuousImprovementAcademy" 
                aria-label="YouTube" 
                target="_blank" 
                rel="noopener"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.45A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 .05 12a31.6 31.6 0 0 0 .45 5.81 3.02 3.02 0 0 0 2.12 2.14C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.45a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 23.95 12a31.6 31.6 0 0 0-.45-5.81zM9.75 15.52V8.48L15.82 12l-6.07 3.52z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Courses column */}
          <div className="ka-footer-col">
            <h4>Courses</h4>
            <ul>
              <li><a href="https://academy.continuousimprovement.education/p/toyota-production-system-and-lean-fundamentals1?coupon_code=kaizen20">TPS & Lean Fundamentals</a></li>
              <li><a href="https://academy.continuousimprovement.education/p/advanced-value-stream-mapping?coupon_code=kaizen20">Value Stream Mapping</a></li>
              <li><a href="https://academy.continuousimprovement.education/p/business-process-management?coupon_code=kaizen20">Business Process Management</a></li>
              <li><a href="https://academy.continuousimprovement.education/p/en-home?coupon_code=kaizen20">Scientific Problem Solving</a></li>
            </ul>
          </div>

          {/* Certification column */}
          <div className="ka-footer-col">
            <h4>Certification</h4>
            <ul>
              <li><a href="https://practitioner.kaizenacademy.education/">Lean Practitioner Program</a></li>
              <li><a href="https://practitioner.kaizenacademy.education/">Get Certified</a></li>
            </ul>
          </div>

          {/* Connect column */}
          <div className="ka-footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://www.linkedin.com/company/theciacademy" target="_blank" rel="noopener">LinkedIn</a></li>
              <li><a href="https://www.youtube.com/@ContinuousImprovementAcademy" target="_blank" rel="noopener">YouTube</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="ka-footer-divider" />

        {/* Bottom bar */}
        <div className="ka-footer-bottom">
          <p>&copy; 2025 Kaizen Academy · Continuous Improvement Academy. All rights reserved.</p>
          <div className="ka-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default KaizenFooter;
