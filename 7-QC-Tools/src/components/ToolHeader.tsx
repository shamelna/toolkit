import React from 'react';

interface ToolHeaderProps {
  number?: string;
  title: string;
  subtitle: string;
}

export default function ToolHeader({ number, title, subtitle }: ToolHeaderProps) {
  return (
    <div className="tool-header">
      {number && <div className="tool-number">{number}</div>}
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px,5vw,48px)', letterSpacing: '3px', color: '#ffffff', margin: 0, position: 'relative', zIndex: 1 }}>
        {title}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', lineHeight: '1.5', maxWidth: '650px', margin: '8px 0 0 0', position: 'relative', zIndex: 1 }}>
        {subtitle}
      </p>
    </div>
  );
}
