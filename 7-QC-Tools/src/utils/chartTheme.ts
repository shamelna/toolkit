// Chart theme and styling constants for Recharts

export const CHART_COLORS = {
  primary:    '#ffd559',   // yellow — main data series
  secondary:  '#1a1a1a',   // dark — secondary series
  accent:     '#ff6b35',   // orange — tertiary / cumulative line
  control:    '#dc2626',   // red — UCL/LCL/spec limit lines
  centerline: '#2a2a2a',   // grey — centerlines
  ok:         '#16a34a',   // green — in-control points
  warn:       '#d97706',   // amber — borderline points
  alert:      '#dc2626',   // red — out-of-control points
  grid:       '#e5e5e5',   // light grey — chart gridlines
  background: '#ffffff',   // white — chart background
};

export const CHART_STYLE = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 12,
};
