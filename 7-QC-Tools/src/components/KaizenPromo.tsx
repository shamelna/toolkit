import React, { useState, useEffect } from 'react';

export default function KaizenPromo() {
  const [h, setH] = useState(48);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);

  useEffect(() => {
    const end = Date.now() + 48 * 60 * 60 * 1000;
    const id = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      setH(Math.floor(diff / 3600000));
      setM(Math.floor((diff % 3600000) / 60000));
      setS(Math.floor((diff % 60000) / 1000));
      if (diff === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
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
              <li>A3 Thinking &amp; Root Cause Analysis</li>
              <li>Excel templates, PDF tutorials &amp; coaching</li>
              <li>Lifetime access — learn at your own pace</li>
              <li>Certificate by Kaizen Academy Australia</li>
              <li>Accredited: Council for Six Sigma Certification</li>
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
                  <span className="ka-timer-num">{pad(h)}</span>
                  <span className="ka-timer-unit">Hours</span>
                </div>
                <div className="ka-timer-block">
                  <span className="ka-timer-num">{pad(m)}</span>
                  <span className="ka-timer-unit">Mins</span>
                </div>
                <div className="ka-timer-block">
                  <span className="ka-timer-num">{pad(s)}</span>
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
  );
}
