// Statistical calculation utilities for QC Tools

export interface HistogramData {
  values: number[];
  lsl: number;
  usl: number;
}

export interface ControlChartConstants {
  n: number;
  A2: number;
  A3: number;
  B3: number;
  B4: number;
  D3: number;
  D4: number;
}

// Control chart constants from Ishikawa Table 2.3
export const CONTROL_CHART_CONSTANTS: Record<number, ControlChartConstants> = {
  2: { n: 2, A2: 1.880, A3: 2.659, B3: 0, B4: 3.267, D3: 0, D4: 3.267 },
  3: { n: 3, A2: 1.023, A3: 1.954, B3: 0, B4: 2.568, D3: 0, D4: 2.574 },
  4: { n: 4, A2: 0.729, A3: 1.628, B3: 0, B4: 2.282, D3: 0, D4: 2.282 },
  5: { n: 5, A2: 0.577, A3: 1.427, B3: 0, B4: 2.115, D3: 0, D4: 2.115 },
  6: { n: 6, A2: 0.483, A3: 1.287, B3: 0, B4: 2.004, D3: 0, D4: 2.004 },
  7: { n: 7, A2: 0.419, A3: 1.182, B3: 0, B4: 1.913, D3: 0, D4: 1.913 },
  8: { n: 8, A2: 0.373, A3: 1.099, B3: 0, B4: 1.864, D3: 0, D4: 1.864 },
  9: { n: 9, A2: 0.337, A3: 1.032, B3: 0, B4: 1.816, D3: 0, D4: 1.816 },
  10: { n: 10, A2: 0.308, A3: 0.975, B3: 0, B4: 1.777, D3: 0, D4: 1.777 }
};

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
