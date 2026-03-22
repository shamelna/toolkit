import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const KaizenHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'TPS & Lean', href: 'https://academy.continuousimprovement.education/p/toyota-production-system-and-lean-fundamentals1' },
    { label: 'Value Stream', href: 'https://academy.continuousimprovement.education/p/advanced-value-stream-mapping' },
    { label: 'BPM', href: 'https://academy.continuousimprovement.education/p/business-process-management' },
    { label: 'Problem Solving', href: 'https://academy.continuousimprovement.education/p/en-home' },
  ];

  return (
    <header className="ka-header">
      <div className="ka-header-inner">
        {/* Logo + Brand */}
        <div className="ka-brand">
          <img
            src="http://practitioner.kaizenacademy.education/logo_round.png"
            alt="Kaizen Academy Logo"
          />
          <div className="ka-brand-text">
            <div className="ka-brand-main">Kaizen Academy</div>
            <span className="ka-brand-sub">TPM Toolkit</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="ka-nav">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li>
            <a href="https://practitioner.kaizenacademy.education/" className="ka-btn">
              Get Certified
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="ka-hamburger"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen
            ? <X style={{ width: '20px', height: '20px' }} />
            : <Menu style={{ width: '20px', height: '20px' }} />
          }
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="ka-mobile-menu">
          <ul>
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://practitioner.kaizenacademy.education/"
                className="ka-mobile-cta"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Certified
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default KaizenHeader;
