import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Download, RotateCcw, Upload } from 'lucide-react';
import { CONTROL_CHART_CONSTANTS } from '../utils/statistics';
import ExportButton from './ExportButton';
import ToolHeader from './ToolHeader';
import KaizenPromo from './KaizenPromo';

interface ControlChartData {
  type: 'xbar-r' | 'xbar-s' | 'p' | 'pn' | 'u' | 'c';
  subgroups: Array<{
    subgroup: number;
    values: number[];
    n?: number;
    pn?: number;
    c?: number;
  }>;
}

interface ControlChartResult {
  data: Array<{
    subgroup: number;
    xbar?: number;
    r?: number;
    s?: number;
    p?: number;
    pn?: number;
    u?: number;
    c?: number;
    ucl?: number;
    lcl?: number;
    centerline?: number;
    xbarMin?: number;
    xbarMax?: number;
    rMin?: number;
    rMax?: number;
    // R chart specific control limits
    rUcl?: number;
    rLcl?: number;
    rCenterline?: number;
    // S chart specific control limits
    sMin?: number;
    sMax?: number;
    sUcl?: number;
    sLcl?: number;
    sCenterline?: number;
  }>;
  overallMean?: number;
  overallRange?: number;
  overallStdDev?: number;
  overallP?: number;
  overallU?: number;
  overallC?: number;
  interpretation: string;
  outOfControlPoints: number[];
  status: 'ok' | 'warn' | 'alert';
}

export default function ControlCharts() {
  const [activeChart, setActiveChart] = useState<ControlChartData['type']>('xbar-r');
  const [data, setData] = useState<ControlChartData>({
    type: 'xbar-r',
    subgroups: []
  });

  const [result, setResult] = useState<ControlChartResult | null>(null);
  const [subgroupSize, setSubgroupSize] = useState(5);
  
  // Decision tree state
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(1);
  const [guideAnswers, setGuideAnswers] = useState<{dataType?: string; subgroupSize?: string; sampleSize?: string; defectType?: string}>({});

  const loadBookExample = (chartType: ControlChartData['type']) => {
    let exampleData: ControlChartData = { type: chartType, subgroups: [] };

    switch (chartType) {
      case 'xbar-r':
        exampleData.subgroups = [
          { subgroup: 1, values: [14.0, 12.6, 13.2, 13.1, 12.1] },
          { subgroup: 2, values: [13.2, 13.3, 12.7, 13.4, 12.1] },
          { subgroup: 3, values: [13.5, 12.8, 13.0, 12.8, 12.4] },
          { subgroup: 4, values: [13.8, 13.1, 12.9, 13.3, 12.6] },
          { subgroup: 5, values: [14.2, 13.6, 13.8, 13.2, 13.0] },
          { subgroup: 6, values: [13.1, 12.9, 13.4, 13.0, 12.7] },
          { subgroup: 7, values: [13.6, 13.2, 13.5, 13.1, 12.9] },
          { subgroup: 8, values: [13.3, 13.4, 13.0, 13.2, 12.8] },
          { subgroup: 9, values: [13.7, 13.1, 13.3, 13.5, 13.0] },
          { subgroup: 10, values: [13.4, 13.2, 13.6, 13.1, 12.9] }
        ];
        setSubgroupSize(5);
        break;

      case 'xbar-s':
        exampleData.subgroups = [
          { subgroup: 1,  values: [14.0, 12.6, 13.2, 13.1, 12.1, 13.4, 12.8] },
          { subgroup: 2,  values: [13.2, 13.3, 12.7, 13.4, 12.1, 13.0, 13.5] },
          { subgroup: 3,  values: [13.5, 12.8, 13.0, 12.8, 12.4, 13.2, 13.1] },
          { subgroup: 4,  values: [13.8, 13.1, 12.9, 13.3, 12.6, 13.6, 13.0] },
          { subgroup: 5,  values: [14.2, 13.6, 13.8, 13.2, 13.0, 13.9, 13.4] },
          { subgroup: 6,  values: [13.1, 12.9, 13.4, 13.0, 12.7, 13.3, 12.8] },
          { subgroup: 7,  values: [13.6, 13.2, 13.5, 13.1, 12.9, 13.7, 13.3] },
          { subgroup: 8,  values: [13.3, 13.4, 13.0, 13.2, 12.8, 13.1, 13.6] },
          { subgroup: 9,  values: [13.7, 13.1, 13.3, 13.5, 13.0, 13.8, 13.2] },
          { subgroup: 10, values: [13.4, 13.2, 13.6, 13.1, 12.9, 13.5, 13.0] }
        ];
        setSubgroupSize(7);
        break;

      case 'p':
        exampleData.subgroups = [
          { subgroup: 1, values: [], n: 115, pn: 15 },
          { subgroup: 2, values: [], n: 220, pn: 18 },
          { subgroup: 3, values: [], n: 210, pn: 23 },
          { subgroup: 4, values: [], n: 180, pn: 12 },
          { subgroup: 5, values: [], n: 195, pn: 16 },
          { subgroup: 6, values: [], n: 200, pn: 20 }
        ];
        break;

      case 'pn':
        exampleData.subgroups = [
          { subgroup: 1, values: [], n: 100, pn: 12 },
          { subgroup: 2, values: [], n: 100, pn: 15 },
          { subgroup: 3, values: [], n: 100, pn: 8 },
          { subgroup: 4, values: [], n: 100, pn: 10 },
          { subgroup: 5, values: [], n: 100, pn: 14 },
          { subgroup: 6, values: [], n: 100, pn: 9 }
        ];
        break;

      case 'u':
        exampleData.subgroups = [
          { subgroup: 1, values: [], n: 1, c: 4 },
          { subgroup: 2, values: [], n: 1, c: 5 },
          { subgroup: 3, values: [], n: 1, c: 3 },
          { subgroup: 4, values: [], n: 1, c: 6 },
          { subgroup: 5, values: [], n: 1, c: 2 },
          { subgroup: 6, values: [], n: 1, c: 4 }
        ];
        break;

      case 'c':
        exampleData.subgroups = [
          { subgroup: 1, values: [], n: 1, c: 7 },
          { subgroup: 2, values: [], n: 1, c: 5 },
          { subgroup: 3, values: [], n: 1, c: 9 },
          { subgroup: 4, values: [], n: 1, c: 6 },
          { subgroup: 5, values: [], n: 1, c: 8 },
          { subgroup: 6, values: [], n: 1, c: 4 }
        ];
        break;
    }

    setData(exampleData);
    setActiveChart(chartType);
  };

  // Decision Tree Guidance Functions
  const startGuidance = () => {
    setShowGuide(true);
    setGuideStep(1);
    setGuideAnswers({});
  };

  const resetGuidance = () => {
    setShowGuide(false);
    setGuideStep(1);
    setGuideAnswers({});
  };

  const handleGuideAnswer = (key: string, value: string) => {
    setGuideAnswers(prev => ({ ...prev, [key]: value }));
    setGuideStep(prev => prev + 1);
  };

  const getRecommendedChart = (): ControlChartData['type'] => {
    const { dataType, subgroupSize: sgSize, defectType } = guideAnswers;
    
    if (dataType === 'variable') {
      return sgSize === 'small' ? 'xbar-r' : 'xbar-s';
    } else if (dataType === 'attribute') {
      if (defectType === 'defective') {
        return sgSize === 'constant' ? 'pn' : 'p';
      } else {
        return sgSize === 'constant' ? 'c' : 'u';
      }
    }
    return 'xbar-r';
  };

  const applyGuidanceResult = () => {
    const recommendedChart = getRecommendedChart();
    setActiveChart(recommendedChart);
    loadBookExample(recommendedChart);
    setShowGuide(false);
    setGuideStep(1);
    setGuideAnswers({});
  };

  const clearData = () => {
    setData({ type: activeChart, subgroups: [] });
    setResult(null);
  };

  const calculateControlChart = () => {
    if (data.subgroups.length === 0) return;

    let chartData: ControlChartResult['data'] = [];
    let interpretation = '';
    let outOfControlPoints: number[] = [];
    let status: 'ok' | 'warn' | 'alert' = 'ok';

    switch (activeChart) {
      case 'xbar-r':
        const xbarData = data.subgroups.map(sg => {
          const mean = sg.values.reduce((sum, val) => sum + val, 0) / sg.values.length;
          const range = Math.max(...sg.values) - Math.min(...sg.values);
          return { subgroup: sg.subgroup, xbar: mean, r: range };
        });

        const overallMean = xbarData.reduce((sum, d) => sum + d.xbar, 0) / xbarData.length;
        const overallRange = xbarData.reduce((sum, d) => sum + d.r, 0) / xbarData.length;

        const constants = CONTROL_CHART_CONSTANTS[subgroupSize];
        const uclXbar = overallMean + constants.A2 * overallRange;
        const lclXbar = overallMean - constants.A2 * overallRange;
        const uclR = constants.D4 * overallRange;
        const lclR = constants.D3 * overallRange; // Will be 0 for small sample sizes

        // Calculate Y-axis ranges for better readability
        const xbarRange = uclXbar - lclXbar;
        const xbarMin = Math.min(lclXbar - (xbarRange * 0.1), Math.min(...xbarData.map(d => d.xbar)) - 0.5);
        const xbarMax = Math.max(uclXbar + (xbarRange * 0.1), Math.max(...xbarData.map(d => d.xbar)) + 0.5);

        const rRange = uclR - lclR;
        const rMin = Math.min(lclR - (rRange * 0.1), Math.min(...xbarData.map(d => d.r)) - 0.1);
        const rMax = Math.max(uclR + (rRange * 0.1), Math.max(...xbarData.map(d => d.r)) + 0.1);

        chartData = xbarData.map(d => ({
          subgroup: d.subgroup,
          xbar: d.xbar,
          r: d.r,
          ucl: uclXbar,
          lcl: lclXbar,
          centerline: overallMean,
          xbarMin,
          xbarMax,
          rMin,
          rMax,
          // R chart specific control limits
          rUcl: uclR,
          rLcl: lclR,
          rCenterline: overallRange
        }));

        // Check for out-of-control points
        outOfControlPoints = xbarData
          .filter(d => d.xbar > uclXbar || d.xbar < lclXbar)
          .map(d => d.subgroup);

        if (outOfControlPoints.length > 0) {
          interpretation = `Process is out of control. Points ${outOfControlPoints.join(', ')} exceed control limits.`;
          status = 'alert';
        } else {
          interpretation = 'Process appears to be in statistical control. Continue monitoring.';
          status = 'ok';
        }

        setResult({
          data: chartData,
          overallMean,
          overallRange,
          interpretation,
          outOfControlPoints,
          status
        });
        break;

      case 'xbar-s':
        const xbarSRawData = data.subgroups.map(sg => {
          const sgMean = sg.values.reduce((sum, val) => sum + val, 0) / sg.values.length;
          const sgVariance = sg.values.reduce((sum, val) => sum + Math.pow(val - sgMean, 2), 0) / (sg.values.length - 1);
          return { subgroup: sg.subgroup, xbar: sgMean, s: Math.sqrt(sgVariance) };
        });

        const xbarSMean = xbarSRawData.reduce((sum, d) => sum + d.xbar, 0) / xbarSRawData.length;
        const sBarMean = xbarSRawData.reduce((sum, d) => sum + d.s, 0) / xbarSRawData.length;
        const sConstantsVal = CONTROL_CHART_CONSTANTS[subgroupSize];
        const xbarSUcl = xbarSMean + sConstantsVal.A3 * sBarMean;
        const xbarSLcl = xbarSMean - sConstantsVal.A3 * sBarMean;
        
        // Calculate S chart control limits
        const sUcl = sBarMean + sConstantsVal.A3 * sBarMean;
        const sLcl = Math.max(0, sBarMean - sConstantsVal.A3 * sBarMean); // Prevent negative LCL
        const sCenterline = sBarMean;

        chartData = xbarSRawData.map(d => ({
          subgroup: d.subgroup,
          xbar: d.xbar,
          s: d.s,
          ucl: xbarSUcl,
          lcl: xbarSLcl,
          centerline: xbarSMean,
          sUcl: sUcl,
          sLcl: sLcl,
          sCenterline: sCenterline
        }));

        outOfControlPoints = xbarSRawData
          .filter(d => d.xbar > xbarSUcl || d.xbar < xbarSLcl)
          .map(d => d.subgroup);

        if (outOfControlPoints.length > 0) {
          interpretation = `Process is out of control. Points ${outOfControlPoints.join(', ')} exceed control limits.`;
          status = 'alert';
        } else {
          interpretation = 'Process appears to be in statistical control. Continue monitoring.';
          status = 'ok';
        }

        setResult({
          data: chartData,
          overallMean: xbarSMean,
          overallStdDev: sBarMean,
          interpretation,
          outOfControlPoints,
          status
        });
        break;

      case 'p':
        const pData = data.subgroups.map(sg => ({
          subgroup: sg.subgroup,
          p: sg.pn! / sg.n!,
          n: sg.n!
        }));

        const totalDefectives = pData.reduce((sum, d) => sum + d.p * d.n, 0);
        const totalItems = pData.reduce((sum, d) => sum + d.n, 0);
        const overallP = totalDefectives / totalItems;

        chartData = pData.map(d => {
          const sigma = Math.sqrt((overallP * (1 - overallP)) / d.n);
          const ucl = overallP + 3 * sigma;
          const lcl = Math.max(0, overallP - 3 * sigma);
          
          return {
            subgroup: d.subgroup,
            p: d.p,
            ucl,
            lcl,
            centerline: overallP
          };
        });

        outOfControlPoints = pData
          .filter(d => {
            const sigma = Math.sqrt((overallP * (1 - overallP)) / d.n);
            const ucl = overallP + 3 * sigma;
            const lcl = Math.max(0, overallP - 3 * sigma);
            return d.p > ucl || d.p < lcl;
          })
          .map(d => d.subgroup);

        if (outOfControlPoints.length > 0) {
          interpretation = `Process is out of control. Points ${outOfControlPoints.join(', ')} exceed control limits.`;
          status = 'alert';
        } else {
          interpretation = 'Process appears to be in statistical control. Continue monitoring.';
          status = 'ok';
        }

        setResult({
          data: chartData,
          overallP,
          interpretation,
          outOfControlPoints,
          status
        });
        break;

      case 'pn':
        const pnData = data.subgroups.map(sg => ({
          subgroup: sg.subgroup,
          pn: sg.pn!
        }));

        const totalPnDefectives = pnData.reduce((sum, d) => sum + d.pn, 0);
        const overallPn = totalPnDefectives / (pnData.length * 100); // n=100 for pn chart

        const pnSigma = Math.sqrt(100 * overallPn * (1 - overallPn));
        const uclPn = overallPn * 100 + 3 * pnSigma;
        const lclPn = Math.max(0, overallPn * 100 - 3 * pnSigma);

        chartData = pnData.map(d => ({
          subgroup: d.subgroup,
          pn: d.pn,
          ucl: uclPn,
          lcl: lclPn,
          centerline: overallPn * 100
        }));

        outOfControlPoints = pnData
          .filter(d => d.pn > uclPn || d.pn < lclPn)
          .map(d => d.subgroup);

        if (outOfControlPoints.length > 0) {
          interpretation = `Process is out of control. Points ${outOfControlPoints.join(', ')} exceed control limits.`;
          status = 'alert';
        } else {
          interpretation = 'Process appears to be in statistical control. Continue monitoring.';
          status = 'ok';
        }

        setResult({
          data: chartData,
          overallP: overallPn,
          interpretation,
          outOfControlPoints,
          status
        });
        break;

      case 'u':
        const uData = data.subgroups.map(sg => ({
          subgroup: sg.subgroup,
          u: sg.c! / sg.n!
        }));

        const totalDefects = data.subgroups.reduce((sum, sg) => sum + sg.c!, 0);
        const totalUnits = data.subgroups.reduce((sum, sg) => sum + sg.n!, 0);
        const overallU = totalDefects / totalUnits;

        chartData = uData.map(d => {
          const sigma = Math.sqrt(overallU / d.n);
          const ucl = overallU + 3 * sigma;
          const lcl = Math.max(0, overallU - 3 * sigma);
          
          return {
            subgroup: d.subgroup,
            u: d.u,
            ucl,
            lcl,
            centerline: overallU
          };
        });

        outOfControlPoints = uData
          .filter(d => {
            const sigma = Math.sqrt(overallU / d.n);
            const ucl = overallU + 3 * sigma;
            const lcl = Math.max(0, overallU - 3 * sigma);
            return d.u > ucl || d.u < lcl;
          })
          .map(d => d.subgroup);

        if (outOfControlPoints.length > 0) {
          interpretation = `Process is out of control. Points ${outOfControlPoints.join(', ')} exceed control limits.`;
          status = 'alert';
        } else {
          interpretation = 'Process appears to be in statistical control. Continue monitoring.';
          status = 'ok';
        }

        setResult({
          data: chartData,
          overallU,
          interpretation,
          outOfControlPoints,
          status
        });
        break;

      case 'c':
        const cData = data.subgroups.map(sg => ({
          subgroup: sg.subgroup,
          c: sg.c!
        }));

        const overallC = cData.reduce((sum, d) => sum + d.c, 0) / cData.length;
        const cSigma = Math.sqrt(overallC);
        const uclC = overallC + 3 * cSigma;
        const lclC = Math.max(0, overallC - 3 * cSigma);

        chartData = cData.map(d => ({
          subgroup: d.subgroup,
          c: d.c,
          ucl: uclC,
          lcl: lclC,
          centerline: overallC
        }));

        outOfControlPoints = cData
          .filter(d => d.c > uclC || d.c < lclC)
          .map(d => d.subgroup);

        if (outOfControlPoints.length > 0) {
          interpretation = `Process is out of control. Points ${outOfControlPoints.join(', ')} exceed control limits.`;
          status = 'alert';
        } else {
          interpretation = 'Process appears to be in statistical control. Continue monitoring.';
          status = 'ok';
        }

        setResult({
          data: chartData,
          overallC,
          interpretation,
          outOfControlPoints,
          status
        });
        break;
    }
  };

  useEffect(() => {
    calculateControlChart();
  }, [data, activeChart]);

  // Auto-load book example on initial mount
  useEffect(() => {
    loadBookExample('xbar-r');
  }, []);

  const addSubgroup = () => {
    const newSubgroup = data.subgroups.length + 1;
    
    switch (activeChart) {
      case 'xbar-r':
      case 'xbar-s':
        setData(prev => ({
          ...prev,
          subgroups: [...prev.subgroups, {
            subgroup: newSubgroup,
            values: new Array(subgroupSize).fill(0)
          }]
        }));
        break;
      case 'p':
        setData(prev => ({
          ...prev,
          subgroups: [...prev.subgroups, {
            subgroup: newSubgroup,
            values: [],
            n: 100,
            pn: 0
          }]
        }));
        break;
      case 'pn':
        setData(prev => ({
          ...prev,
          subgroups: [...prev.subgroups, {
            subgroup: newSubgroup,
            values: [],
            n: 100,
            pn: 0
          }]
        }));
        break;
      case 'u':
        setData(prev => ({
          ...prev,
          subgroups: [...prev.subgroups, {
            subgroup: newSubgroup,
            values: [],
            n: 1,
            c: 0
          }]
        }));
        break;
      case 'c':
        setData(prev => ({
          ...prev,
          subgroups: [...prev.subgroups, {
            subgroup: newSubgroup,
            values: [],
            n: 1,
            c: 0
          }]
        }));
        break;
    }
  };

  const updateSubgroup = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      subgroups: prev.subgroups.map((sg, i) => {
        if (i === index) {
          if (field.startsWith('value')) {
            const valueIndex = parseInt(field.split('_')[1]);
            const newValues = [...sg.values];
            newValues[valueIndex] = parseFloat(value) || 0;
            return { ...sg, values: newValues };
          } else if (field === 'n' || field === 'pn' || field === 'c') {
            return { ...sg, [field]: parseFloat(value) || 0 };
          }
        }
        return sg;
      })
    }));
  };

  const deleteSubgroup = (index: number) => {
    setData(prev => ({
      ...prev,
      subgroups: prev.subgroups.filter((_, i) => i !== index)
    }));
  };

  // Excel Paste Functionality
  const handleExcelPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Parse tab or comma separated values
    const rows = pastedText.trim().split(/\n|\r\n/).filter(row => row.trim());
    
    if (rows.length === 0) return;
    
    const newSubgroups: ControlChartData['subgroups'] = [];
    
    rows.forEach((row, index) => {
      const values = row.split(/\t|,/).map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
      
      if (values.length > 0) {
        switch (activeChart) {
          case 'xbar-r':
          case 'xbar-s':
            if (values.length >= 2) {
              newSubgroups.push({
                subgroup: index + 1,
                values: values.slice(0, subgroupSize)
              });
            }
            break;
          case 'p':
            if (values.length >= 2) {
              newSubgroups.push({
                subgroup: index + 1,
                values: [],
                n: values[0],
                pn: values[1]
              });
            }
            break;
          case 'pn':
            if (values.length >= 1) {
              newSubgroups.push({
                subgroup: index + 1,
                values: [],
                n: 100,
                pn: values[0]
              });
            }
            break;
          case 'u':
          case 'c':
            if (values.length >= 1) {
              newSubgroups.push({
                subgroup: index + 1,
                values: [],
                n: values[1] || 1,
                c: values[0]
              });
            }
            break;
        }
      }
    });
    
    if (newSubgroups.length > 0) {
      setData(prev => ({
        ...prev,
        subgroups: newSubgroups
      }));
      alert(`Successfully pasted ${newSubgroups.length} rows of data`);
    } else {
      alert('No valid data found. Please check your clipboard data format.');
    }
  };

  // Export Template
  const exportTemplate = () => {
    let headers: string[] = [];
    let sampleData: string[][] = [];
    
    switch (activeChart) {
      case 'xbar-r':
        headers = ['Subgroup', 'Value1', 'Value2', 'Value3', 'Value4', 'Value5'];
        sampleData = [
          ['1', '10.5', '11.2', '10.8', '11.0', '10.9'],
          ['2', '11.1', '10.7', '11.3', '10.9', '11.0'],
          ['3', '10.8', '11.0', '10.6', '11.2', '10.9']
        ];
        break;
      case 'xbar-s':
        headers = ['Subgroup', 'Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Value6', 'Value7'];
        sampleData = [
          ['1', '10.5', '11.2', '10.8', '11.0', '10.9', '11.1', '10.7'],
          ['2', '11.1', '10.7', '11.3', '10.9', '11.0', '10.8', '11.2']
        ];
        break;
      case 'p':
        headers = ['Subgroup', 'Sample_Size(n)', 'Defectives(pn)'];
        sampleData = [
          ['1', '100', '5'],
          ['2', '100', '8'],
          ['3', '100', '3']
        ];
        break;
      case 'pn':
        headers = ['Subgroup', 'Defectives'];
        sampleData = [
          ['1', '5'],
          ['2', '8'],
          ['3', '3']
        ];
        break;
      case 'u':
        headers = ['Subgroup', 'Defects', 'Units'];
        sampleData = [
          ['1', '4', '1'],
          ['2', '7', '1'],
          ['3', '2', '1']
        ];
        break;
      case 'c':
        headers = ['Subgroup', 'Defects'];
        sampleData = [
          ['1', '4'],
          ['2', '7'],
          ['3', '2']
        ];
        break;
    }
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeChart}_template.csv`;
    link.click();
  };

  // Import Data from CSV
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (!csvText) return;
      
      const rows = csvText.trim().split(/\n|\r\n/).slice(1); // Skip header
      const newSubgroups: ControlChartData['subgroups'] = [];
      
      rows.forEach((row, index) => {
        const values = row.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
        
        if (values.length > 0) {
          switch (activeChart) {
            case 'xbar-r':
            case 'xbar-s':
              if (values.length >= 2) {
                newSubgroups.push({
                  subgroup: index + 1,
                  values: values.slice(1, 1 + subgroupSize) // Skip subgroup number
                });
              }
              break;
            case 'p':
              if (values.length >= 3) {
                newSubgroups.push({
                  subgroup: index + 1,
                  values: [],
                  n: values[1],
                  pn: values[2]
                });
              }
              break;
            case 'pn':
              if (values.length >= 2) {
                newSubgroups.push({
                  subgroup: index + 1,
                  values: [],
                  n: 100,
                  pn: values[1]
                });
              }
              break;
            case 'u':
              if (values.length >= 3) {
                newSubgroups.push({
                  subgroup: index + 1,
                  values: [],
                  n: values[2],
                  c: values[1]
                });
              }
              break;
            case 'c':
              if (values.length >= 2) {
                newSubgroups.push({
                  subgroup: index + 1,
                  values: [],
                  n: 1,
                  c: values[1]
                });
              }
              break;
          }
        }
      });
      
      if (newSubgroups.length > 0) {
        setData(prev => ({
          ...prev,
          subgroups: newSubgroups
        }));
        alert(`Successfully imported ${newSubgroups.length} rows of data`);
      } else {
        alert('No valid data found in file. Please check the format.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const renderXbarRChart = () => (
    <div className="space-y-8">
      {/* X-bar Chart - Full Width */}
      <div className="card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h4 className="heading-small mb-4" style={{ color: '#1a1a1a' }}>X-bar Chart (Averages)</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={result?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="subgroup" tick={{ fontSize: 12 }} />
            <YAxis 
              domain={[
                (result?.data[0]?.lcl ?? 0) - 0.5, 
                (result?.data[0]?.ucl ?? 20) + 0.5
              ]} 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value: number) => value.toFixed(3)}
              allowDataOverflow={false}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="xbar" stroke="#ffd559" strokeWidth={2} name="X-bar" dot={{ r: 4 }} />
            <ReferenceLine y={result?.data[0]?.ucl} stroke="#dc2626" strokeDasharray="5 5" label={`UCL: ${result?.data[0]?.ucl?.toFixed(3)}`} />
            <ReferenceLine y={result?.data[0]?.lcl} stroke="#dc2626" strokeDasharray="5 5" label={`LCL: ${result?.data[0]?.lcl?.toFixed(3)}`} />
            <ReferenceLine y={result?.data[0]?.centerline} stroke="#2a2a2a" strokeDasharray="3 3" label={`CL: ${result?.data[0]?.centerline?.toFixed(3)}`} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* R Chart - Full Width */}
      <div className="card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h4 className="heading-small mb-4" style={{ color: '#1a1a1a' }}>R Chart (Range)</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={result?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="subgroup" tick={{ fontSize: 12 }} />
            <YAxis 
              domain={[
                (result?.data[0]?.rLcl ?? 0) - 0.2, 
                (result?.data[0]?.rUcl ?? 5) + 0.5
              ]} 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value: number) => value.toFixed(3)}
              allowDataOverflow={false}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="r" stroke="#1a1a1a" strokeWidth={2} name="Range" dot={{ r: 4 }} />
            <ReferenceLine y={result?.data[0]?.rUcl} stroke="#dc2626" strokeDasharray="5 5" label={`UCL: ${result?.data[0]?.rUcl?.toFixed(3)}`} />
            {/* Only show LCL if it's greater than 0 */}
            {(result?.data[0]?.rLcl ?? 0) > 0 && (
              <ReferenceLine y={result?.data[0]?.rLcl} stroke="#dc2626" strokeDasharray="5 5" label={`LCL: ${result?.data[0]?.rLcl?.toFixed(3)}`} />
            )}
            <ReferenceLine y={result?.data[0]?.rCenterline} stroke="#2a2a2a" strokeDasharray="3 3" label={`CL: ${result?.data[0]?.rCenterline?.toFixed(3)}`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderXbarSChart = () => (
    <div className="space-y-8">
      {/* X-bar Chart - Full Width */}
      <div className="card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h4 className="heading-small mb-4" style={{ color: '#1a1a1a' }}>X-bar Chart (Averages)</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={result?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="subgroup" tick={{ fontSize: 12 }} />
            <YAxis 
              domain={[
                (result?.data[0]?.lcl ?? 0) - 0.5, 
                (result?.data[0]?.ucl ?? 20) + 0.5
              ]} 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value: number) => value.toFixed(3)}
              allowDataOverflow={false}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="xbar" stroke="#ffd559" strokeWidth={2} name="X-bar" dot={{ r: 4 }} />
            <ReferenceLine y={result?.data[0]?.ucl} stroke="#dc2626" strokeDasharray="5 5" label={`UCL: ${result?.data[0]?.ucl?.toFixed(3)}`} />
            <ReferenceLine y={result?.data[0]?.lcl} stroke="#dc2626" strokeDasharray="5 5" label={`LCL: ${result?.data[0]?.lcl?.toFixed(3)}`} />
            <ReferenceLine y={result?.data[0]?.centerline} stroke="#2a2a2a" strokeDasharray="3 3" label={`CL: ${result?.data[0]?.centerline?.toFixed(3)}`} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* S Chart - Full Width */}
      <div className="card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h4 className="heading-small mb-4" style={{ color: '#1a1a1a' }}>S Chart (Standard Deviation)</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={result?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="subgroup" tick={{ fontSize: 12 }} />
            <YAxis 
              domain={[
                (result?.data[0]?.sLcl ?? 0) - 0.2, 
                (result?.data[0]?.sUcl ?? 5) + 0.5
              ]} 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value: number) => value.toFixed(3)}
              allowDataOverflow={false}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="s" stroke="#ffd559" strokeWidth={2} name="S" dot={{ r: 4 }} />
            <ReferenceLine y={result?.data[0]?.sUcl} stroke="#dc2626" strokeDasharray="5 5" label={`UCL: ${result?.data[0]?.sUcl?.toFixed(3)}`} />
            <ReferenceLine y={result?.data[0]?.sLcl} stroke="#dc2626" strokeDasharray="5 5" label={`LCL: ${result?.data[0]?.sLcl?.toFixed(3)}`} />
            <ReferenceLine y={result?.data[0]?.sCenterline} stroke="#2a2a2a" strokeDasharray="3 3" label={`CL: ${result?.data[0]?.sCenterline?.toFixed(3)}`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAttributeChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={result?.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="subgroup" tick={{ fontSize: 12 }} />
        <YAxis 
              domain={[
                (result?.data[0]?.lcl ?? 0) - 0.1, 
                (result?.data[0]?.ucl ?? 10) + 0.2
              ]} 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value: number) => activeChart === 'p' || activeChart === 'u' ? value.toFixed(4) : value.toFixed(3)}
              allowDataOverflow={false}
            />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={activeChart === 'p' ? 'p' : activeChart === 'pn' ? 'pn' : activeChart === 'u' ? 'u' : 'c'} 
          stroke="#ffd559" 
          strokeWidth={2} 
          name={activeChart.toUpperCase()} 
          dot={{ r: 4 }} 
        />
        <ReferenceLine y={result?.data[0]?.ucl} stroke="#dc2626" strokeDasharray="5 5" label={`UCL: ${result?.data[0]?.ucl?.toFixed(3)}`} />
        <ReferenceLine y={result?.data[0]?.lcl} stroke="#dc2626" strokeDasharray="5 5" label={`LCL: ${result?.data[0]?.lcl?.toFixed(3)}`} />
        <ReferenceLine y={result?.data[0]?.centerline} stroke="#2a2a2a" strokeDasharray="3 3" label={`CL: ${result?.data[0]?.centerline?.toFixed(3)}`} />
      </LineChart>
    </ResponsiveContainer>
  );

  const chartTypes = [
    { id: 'xbar-r', name: 'X-bar & R Chart', description: 'Variables data, small subgroups' },
    { id: 'xbar-s', name: 'X-bar & S Chart', description: 'Variables data, large subgroups' },
    { id: 'p', name: 'P Chart', description: 'Proportion defective, variable n' },
    { id: 'pn', name: 'pn Chart', description: 'Number defective, constant n' },
    { id: 'u', name: 'u Chart', description: 'Defects per unit, variable n' },
    { id: 'c', name: 'c Chart', description: 'Defects per unit, constant n' }
  ];

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="06"
          title="CONTROL CHARTS"
          subtitle="Monitor process stability over time using statistical process control (SPC) methods"
        />

        {/* Instructions */}
        <div className="card mb-6">
          <h4 className="heading-small mb-3" style={{ color: '#1a1a1a' }}>📈 How to Use Control Charts</h4>
          <div className="grid-3" style={{ gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>1</span>
              <span className="text-small" style={{ color: '#666' }}>Select the appropriate chart type based on your data (variables vs attributes)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>2</span>
              <span className="text-small" style={{ color: '#666' }}>Enter subgroup data over time to establish control limits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ffd559', fontWeight: 'bold', fontSize: '14px' }}>3</span>
              <span className="text-small" style={{ color: '#666' }}>Monitor for out-of-control points and investigate special causes</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4" style={{ justifyContent: 'center' }}>
            <button onClick={() => loadBookExample(activeChart)} className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
              <Upload className="w-3 h-3 mr-2" />
              Try Example
            </button>
          </div>
        </div>

        {/* Chart Type Selection */}
        <div className="mb-8">
          {/* Decision Tree Guide Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={startGuidance}
              className="btn-primary"
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              <Activity className="w-5 h-5 mr-2" />
              Guide Me: Which Chart Should I Use?
            </button>
          </div>

          {/* Decision Tree Wizard */}
          {showGuide && (
            <div className="card mb-6" style={{ background: '#f8f9fa', border: '2px solid #ffd559' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-small" style={{ color: '#1a1a1a' }}>
                  Step {guideStep} of 3: Chart Selection Guide
                </h3>
                <button onClick={resetGuidance} className="btn-ghost" style={{ fontSize: '12px' }}>
                  ✕ Close
                </button>
              </div>

              {guideStep === 1 && (
                <div>
                  <p className="text-body mb-4">What type of data are you collecting?</p>
                  <div className="grid-2 gap-4">
                    <button
                      onClick={() => handleGuideAnswer('dataType', 'variable')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">📏 Variable Data</h4>
                      <p className="text-small text-muted">Continuous measurements (length, weight, temperature, time)</p>
                    </button>
                    <button
                      onClick={() => handleGuideAnswer('dataType', 'attribute')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">✓ Attribute Data</h4>
                      <p className="text-small text-muted">Count data (defects, pass/fail, good/bad)</p>
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 2 && guideAnswers.dataType === 'variable' && (
                <div>
                  <p className="text-body mb-4">What is your subgroup sample size?</p>
                  <div className="grid-2 gap-4">
                    <button
                      onClick={() => handleGuideAnswer('subgroupSize', 'small')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">Small (n ≤ 10)</h4>
                      <p className="text-small text-muted">Use X-bar & R Chart - recommended for 2-10 samples per subgroup</p>
                    </button>
                    <button
                      onClick={() => handleGuideAnswer('subgroupSize', 'large')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">Large (n &gt; 10)</h4>
                      <p className="text-small text-muted">Use X-bar & S Chart - better for larger subgroups with standard deviation</p>
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 2 && guideAnswers.dataType === 'attribute' && (
                <div>
                  <p className="text-body mb-4">What are you counting?</p>
                  <div className="grid-2 gap-4">
                    <button
                      onClick={() => handleGuideAnswer('defectType', 'defective')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">Defective Items</h4>
                      <p className="text-small text-muted">Items that are good or bad (pass/fail)</p>
                    </button>
                    <button
                      onClick={() => handleGuideAnswer('defectType', 'defect')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">Defects per Unit</h4>
                      <p className="text-small text-muted">Number of flaws per item (multiple defects possible per unit)</p>
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 3 && guideAnswers.dataType === 'attribute' && guideAnswers.defectType === 'defective' && (
                <div>
                  <p className="text-body mb-4">Is your sample size constant?</p>
                  <div className="grid-2 gap-4">
                    <button
                      onClick={() => handleGuideAnswer('sampleSize', 'constant')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">✓ Constant Sample Size</h4>
                      <p className="text-small text-muted">Same number of units inspected each time - use pn Chart</p>
                    </button>
                    <button
                      onClick={() => handleGuideAnswer('sampleSize', 'variable')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">✗ Variable Sample Size</h4>
                      <p className="text-small text-muted">Different amounts inspected each time - use p Chart</p>
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 3 && guideAnswers.dataType === 'attribute' && guideAnswers.defectType === 'defect' && (
                <div>
                  <p className="text-body mb-4">Is the area of opportunity constant?</p>
                  <div className="grid-2 gap-4">
                    <button
                      onClick={() => handleGuideAnswer('sampleSize', 'constant')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">✓ Constant Area</h4>
                      <p className="text-small text-muted">Same size/area inspected each time - use c Chart</p>
                    </button>
                    <button
                      onClick={() => handleGuideAnswer('sampleSize', 'variable')}
                      className="card cursor-pointer hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="heading-small mb-2">✗ Variable Area</h4>
                      <p className="text-small text-muted">Different sizes inspected - use u Chart (per unit)</p>
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 4 && (
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h4 className="heading-medium mb-2">
                    Recommended: {chartTypes.find(t => t.id === getRecommendedChart())?.name}
                  </h4>
                  <p className="text-body text-muted mb-4">
                    {chartTypes.find(t => t.id === getRecommendedChart())?.description}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={applyGuidanceResult} className="btn-primary">
                      <Upload className="w-4 h-4 mr-2" />
                      Load This Chart
                    </button>
                    <button onClick={resetGuidance} className="btn-ghost">
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid-3">
            {chartTypes.map(type => (
              <div
                key={type.id}
                className={`card cursor-pointer transition-all ${
                  activeChart === type.id ? 'ring-2 ring-yellow-500' : ''
                }`}
                onClick={() => setActiveChart(type.id as ControlChartData['type'])}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-yellow-600" />
                  <h3 className="heading-small">{type.name}</h3>
                </div>
                <p className="text-small text-muted">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${(activeChart === 'xbar-r' || activeChart === 'xbar-s') ? 'tool-body-full-width' : 'tool-body'}`}>
          {/* Input Panel */}
          <div className="input-panel">
            <div className="card">
              <h2 className="heading-medium mb-4">
                {chartTypes.find(t => t.id === activeChart)?.name} Data
              </h2>
              
              <div className="flex gap-3 mb-6">
                <button onClick={() => loadBookExample(activeChart)} className="btn-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Load Book Example
                </button>
                <button onClick={clearData} className="btn-ghost">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Data
                </button>
              </div>

              {/* Excel/Data Import Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-bold mb-3 text-gray-700">📊 Quick Data Import</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button onClick={exportTemplate} className="btn-secondary" style={{ fontSize: '12px', padding: '8px 12px' }}>
                    <Download className="w-3 h-3 mr-1" />
                    Download Template
                  </button>
                  <label className="btn-secondary cursor-pointer" style={{ fontSize: '12px', padding: '8px 12px' }}>
                    <Upload className="w-3 h-3 mr-1" />
                    Import CSV
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
                <div 
                  className="p-3 border-2 border-dashed border-gray-300 rounded text-center cursor-pointer hover:border-yellow-400 transition-colors"
                  onPaste={handleExcelPaste}
                  tabIndex={0}
                >
                  <p className="text-xs text-gray-500">
                    💡 <strong>Tip:</strong> Copy data from Excel and paste here (Ctrl+V)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports tab-separated or comma-separated values
                  </p>
                </div>
              </div>

              {(activeChart === 'xbar-r' || activeChart === 'xbar-s') && (
                <div className="mb-4">
                  <label className="block text-small font-bold mb-2">
                    Subgroup Size (n)
                  </label>
                  <select
                    value={subgroupSize}
                    onChange={(e) => setSubgroupSize(parseInt(e.target.value))}
                    className="input"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="heading-small">Subgroups</h3>
                  <button onClick={addSubgroup} className="btn-ghost">
                    Add Subgroup
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">SG</th>
                        {(activeChart === 'xbar-r' || activeChart === 'xbar-s') && (
                          <>
                            {Array.from({ length: subgroupSize }, (_, i) => (
                              <th key={i} className="p-2 text-center">V{i + 1}</th>
                            ))}
                          </>
                        )}
                        {(activeChart === 'p' || activeChart === 'pn') && (
                          <>
                            <th className="p-2 text-center">n</th>
                            <th className="p-2 text-center">pn</th>
                          </>
                        )}
                        {(activeChart === 'u' || activeChart === 'c') && (
                          <th className="p-2 text-center">c</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.subgroups.map((sg, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{sg.subgroup}</td>
                          {(activeChart === 'xbar-r' || activeChart === 'xbar-s') && (
                            <>
                              {sg.values.map((value, valueIndex) => (
                                <td key={valueIndex} className="p-2">
                                  <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => updateSubgroup(index, `value_${valueIndex}`, e.target.value)}
                                    className="w-16 p-1 text-center border rounded"
                                    step="0.1"
                                  />
                                </td>
                              ))}
                            </>
                          )}
                          {(activeChart === 'p' || activeChart === 'pn') && (
                            <>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={sg.n}
                                  onChange={(e) => updateSubgroup(index, 'n', e.target.value)}
                                  className="w-16 p-1 text-center border rounded"
                                  min="1"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={sg.pn}
                                  onChange={(e) => updateSubgroup(index, 'pn', e.target.value)}
                                  className="w-16 p-1 text-center border rounded"
                                  min="0"
                                />
                              </td>
                            </>
                          )}
                          {(activeChart === 'u' || activeChart === 'c') && (
                            <td className="p-2">
                              <input
                                type="number"
                                value={sg.c}
                                onChange={(e) => updateSubgroup(index, 'c', e.target.value)}
                                className="w-16 p-1 text-center border rounded"
                                min="0"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="chart-panel">
            <div className="card" id="control-chart">
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-small">
                  {chartTypes.find(t => t.id === activeChart)?.name}
                </h3>
                {result && (
                  <ExportButton
                    chartData={{
                      elementId: 'control-chart',
                      title: 'Control Chart Analysis',
                      description: `${chartTypes.find(t => t.id === activeChart)?.name} showing process control status with UCL/LCL limits`
                    }}
                    dataExport={{
                      data: result.data.map(point => ({
                        subgroup: point.subgroup,
                        value: point.xbar || point.p || point.u || point.c || 0,
                        ucl: point.ucl,
                        lcl: point.lcl,
                        centerline: point.centerline,
                        status: result.outOfControlPoints.includes(point.subgroup) ? 'Out of Control' : 'In Control'
                      })),
                      headers: ['subgroup', 'value', 'ucl', 'lcl', 'centerline', 'status'],
                      sheetName: 'Control Chart Data'
                    }}
                    reportData={{
                      title: `Control Chart Analysis Report — ${chartTypes.find(t => t.id === activeChart)?.name}`,
                      toolName: 'Control Charts (SPC) — Tool 06 of 7 QC Tools',
                      date: new Date().toLocaleDateString(),
                      data: {
                        sections: [
                          {
                            heading: 'Chart Configuration',
                            stats: {
                              'Chart Type': chartTypes.find(t => t.id === activeChart)?.name || activeChart,
                              'Total Subgroups': data.subgroups.length,
                              'Process Status': result.status === 'ok' ? '✓ IN CONTROL' : result.status === 'warn' ? '⚠ WARNING' : '✗ OUT OF CONTROL',
                              'Out-of-Control Points': result.outOfControlPoints.length,
                            }
                          },
                          {
                            heading: 'Control Limits & Calculations',
                            content: (
                              <div className="space-y-4">
                                {/* Control Limits Values */}
                                <div className="bg-yellow-50 p-4 rounded">
                                  <h5 className="font-bold text-sm mb-2" style={{ color: '#1a1a1a' }}>Control Limits (3 decimal places)</h5>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {(result.data[0]?.ucl !== undefined) && <div><strong>Upper Control Limit (UCL):</strong> {result.data[0]?.ucl?.toFixed(3) || 'N/A'}</div>}
                                    {(result.data[0]?.centerline !== undefined) && <div><strong>Centreline (CL):</strong> {result.data[0]?.centerline?.toFixed(3) || 'N/A'}</div>}
                                    {(result.data[0]?.lcl !== undefined) && <div><strong>Lower Control Limit (LCL):</strong> {result.data[0]?.lcl?.toFixed(3) || 'N/A'}</div>}
                                    {(result.data[0]?.rUcl !== undefined) && <div><strong>R Chart UCL:</strong> {result.data[0]?.rUcl?.toFixed(3) || 'N/A'}</div>}
                                    {(result.data[0]?.rLcl !== undefined) && <div><strong>R Chart LCL:</strong> {result.data[0]?.rLcl?.toFixed(3) || 'N/A'}</div>}
                                    {(result.data[0]?.sUcl !== undefined) && <div><strong>S Chart UCL:</strong> {result.data[0]?.sUcl?.toFixed(3) || 'N/A'}</div>}
                                    {(result.data[0]?.sLcl !== undefined) && <div><strong>S Chart LCL:</strong> {result.data[0]?.sLcl?.toFixed(3) || 'N/A'}</div>}
                                  </div>
                                </div>
                                
                                {/* Formulas Section */}
                                <div className="bg-gray-50 p-4 rounded">
                                  <h5 className="font-bold text-sm mb-2" style={{ color: '#1a1a1a' }}>Calculation Formulas</h5>
                                  {activeChart === 'xbar-r' && (
                                    <div className="text-xs space-y-1">
                                      <div><strong>X̄ = ΣX̄/k</strong> (Overall Average)</div>
                                      <div><strong>R̄ = ΣR/k</strong> (Average Range)</div>
                                      <div><strong>UCL(X̄) = X̄ + A₂R̄</strong></div>
                                      <div><strong>LCL(X̄) = X̄ - A₂R̄</strong></div>
                                      <div><strong>UCL(R) = D₄R̄</strong></div>
                                      <div><strong>LCL(R) = D₃R̄</strong></div>
                                      <div className="mt-2 text-blue-600"><strong>Constants (n={subgroupSize}):</strong> A₂={CONTROL_CHART_CONSTANTS[subgroupSize]?.A2}, D₃={CONTROL_CHART_CONSTANTS[subgroupSize]?.D3}, D₄={CONTROL_CHART_CONSTANTS[subgroupSize]?.D4}</div>
                                    </div>
                                  )}
                                  {activeChart === 'xbar-s' && (
                                    <div className="text-xs space-y-1">
                                      <div><strong>X̄ = ΣX̄/k</strong> (Overall Average)</div>
                                      <div><strong>S̄ = ΣS/k</strong> (Average Standard Deviation)</div>
                                      <div><strong>UCL(X̄) = X̄ + A₃S̄</strong></div>
                                      <div><strong>LCL(X̄) = X̄ - A₃S̄</strong></div>
                                      <div><strong>UCL(S) = S̄ + A₃S̄</strong></div>
                                      <div><strong>LCL(S) = S̄ - A₃S̄</strong></div>
                                      <div className="mt-2 text-blue-600"><strong>Constants (n={subgroupSize}):</strong> A₃={CONTROL_CHART_CONSTANTS[subgroupSize]?.A3}</div>
                                    </div>
                                  )}
                                  {activeChart === 'p' && (
                                    <div className="text-xs space-y-1">
                                      <div><strong>p̄ = Σ(pn)/Σn</strong> (Overall Proportion)</div>
                                      <div><strong>σ = √[p̄(1-p̄)/n]</strong> (Standard Deviation)</div>
                                      <div><strong>UCL = p̄ + 3σ</strong></div>
                                      <div><strong>LCL = max(0, p̄ - 3σ)</strong></div>
                                    </div>
                                  )}
                                  {activeChart === 'pn' && (
                                    <div className="text-xs space-y-1">
                                      <div><strong>p̄ = Σ(pn)/(k×n)</strong> (Overall Proportion)</div>
                                      <div><strong>σ = √[n×p̄(1-p̄)]</strong> (Standard Deviation)</div>
                                      <div><strong>UCL = p̄×n + 3σ</strong></div>
                                      <div><strong>LCL = max(0, p̄×n - 3σ)</strong></div>
                                    </div>
                                  )}
                                  {activeChart === 'u' && (
                                    <div className="text-xs space-y-1">
                                      <div><strong>ū = Σ(c)/Σn</strong> (Average Defects per Unit)</div>
                                      <div><strong>σ = √[ū/n]</strong> (Standard Deviation)</div>
                                      <div><strong>UCL = ū + 3σ</strong></div>
                                      <div><strong>LCL = max(0, ū - 3σ)</strong></div>
                                    </div>
                                  )}
                                  {activeChart === 'c' && (
                                    <div className="text-xs space-y-1">
                                      <div><strong>c̄ = Σc/k</strong> (Average Defects per Unit)</div>
                                      <div><strong>σ = √c̄</strong> (Standard Deviation)</div>
                                      <div><strong>UCL = c̄ + 3√c̄</strong></div>
                                      <div><strong>LCL = max(0, c̄ - 3√c̄)</strong></div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Calculated Values */}
                                <div className="bg-blue-50 p-4 rounded">
                                  <h5 className="font-bold text-sm mb-2" style={{ color: '#1a1a1a' }}>Calculated Values</h5>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {(result.overallMean !== undefined) && <div><strong>Overall Mean:</strong> {result.overallMean.toFixed(3)}</div>}
                                    {(result.overallRange !== undefined) && <div><strong>Overall Range:</strong> {result.overallRange.toFixed(3)}</div>}
                                    {(result.overallStdDev !== undefined) && <div><strong>Overall Std Dev:</strong> {result.overallStdDev.toFixed(3)}</div>}
                                    {(result.overallP !== undefined) && <div><strong>Overall Proportion:</strong> {result.overallP.toFixed(4)}</div>}
                                    {(result.overallU !== undefined) && <div><strong>Overall Defects/Unit:</strong> {result.overallU.toFixed(4)}</div>}
                                    {(result.overallC !== undefined) && <div><strong>Overall Defects:</strong> {result.overallC.toFixed(3)}</div>}
                                  </div>
                                </div>
                              </div>
                            )
                          },
                          {
                            heading: 'Process Interpretation',
                            text: result.interpretation
                          },
                          ...(result.outOfControlPoints.length > 0 ? [{
                            heading: 'Out-of-Control Points — Requires Investigation',
                            list: result.outOfControlPoints.map(pt => `Subgroup ${pt} — point outside control limits`)
                          }] : []),
                          {
                            heading: "Ishikawa's Control Chart Rules",
                            list: [
                              'Point beyond control limits → Special cause present — investigate immediately',
                              'Run of 7+ points on one side of centreline → Process shift has occurred',
                              'Run of 7+ points trending up or down → Systematic drift — identify cause',
                              '2 out of 3 consecutive points near control limits → Unusual variation',
                              '4 out of 5 points significantly off-centre → Investigate process conditions',
                              'Periodic / cyclical pattern → Cyclical assignable cause present'
                            ]
                          }
                        ]
                      },
                      charts: [{
                        elementId: 'control-chart',
                        title: `${chartTypes.find(t => t.id === activeChart)?.name}`,
                        description: `SPC control chart — ${result.outOfControlPoints.length} out-of-control point(s). Status: ${result.status === 'ok' ? 'IN CONTROL' : result.status === 'warn' ? 'WARNING' : 'OUT OF CONTROL'}`
                      }],
                      summary: `${chartTypes.find(t => t.id === activeChart)?.name} analysis of ${data.subgroups.length} subgroups. Process is ${result.status === 'ok' ? 'IN CONTROL' : result.status === 'warn' ? 'showing WARNING signs' : 'OUT OF CONTROL'}. ${result.outOfControlPoints.length > 0 ? `Subgroups ${result.outOfControlPoints.join(', ')} indicate special causes.` : 'No special causes detected — process is stable.'}`,
                      recommendations: result.outOfControlPoints.length > 0 ? [
                        `Urgently investigate special causes in subgroups: ${result.outOfControlPoints.join(', ')}`,
                        'Use Fishbone (Cause & Effect) diagram to identify root causes of out-of-control points',
                        'Implement corrective actions to eliminate assignable variation',
                        'Recalculate control limits after verified process stabilisation',
                        'Increase sampling frequency during investigation period'
                      ] : [
                        'Continue monitoring process with current control limits',
                        'Document process conditions that maintain statistical control',
                        'Implement preventive maintenance to sustain process stability',
                        'Investigate common cause variation for further capability improvement'
                      ]
                    }}
                  />
                )}
              </div>
              
              {result ? (
                <>
                  {activeChart === 'xbar-r'
                    ? renderXbarRChart()
                    : activeChart === 'xbar-s'
                    ? renderXbarSChart()
                    : renderAttributeChart()}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted">Enter data to see control chart analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interpretation Panel */}
        {result && (
          <div className="interpretation-panel card-featured">
            <h3 className="heading-medium mb-4">Control Chart Interpretation</h3>
            <div className="text-body text-muted">
              <div className={`mb-4 p-4 rounded-lg ${
                result.status === 'ok' ? 'bg-green-50' : 
                result.status === 'warn' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge-${result.status}`}>
                    {result.status === 'ok' ? 'In Control' : 
                     result.status === 'warn' ? 'Warning' : 'Out of Control'}
                  </span>
                </div>
                <p>{result.interpretation}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <h4 className="heading-small mb-2">Ishikawa's Control Chart Rules</h4>
                <ul className="space-y-1 ml-6 text-small">
                  <li>Point beyond control limits → Special cause present</li>
                  <li>Run of 7+ points on one side → Process shift</li>
                  <li>Run of 7+ points trending → Systematic drift</li>
                  <li>2 out of 3 points near limits → Unusual variation</li>
                  <li>4 out of 5 points significantly off-center → Investigate</li>
                  <li>Periodic pattern → Cyclical cause</li>
                </ul>
              </div>

              {/* Control Limits & Calculations Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="heading-small mb-4">Control Limits & Calculations</h4>
                <div className="space-y-4">
                  {/* Control Limits Values */}
                  <div className="bg-yellow-50 p-4 rounded">
                    <h5 className="font-bold text-sm mb-2" style={{ color: '#1a1a1a' }}>Control Limits (3 decimal places)</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {(result.data[0]?.ucl !== undefined) && <div><strong>Upper Control Limit (UCL):</strong> {result.data[0]?.ucl?.toFixed(3) || 'N/A'}</div>}
                      {(result.data[0]?.centerline !== undefined) && <div><strong>Centreline (CL):</strong> {result.data[0]?.centerline?.toFixed(3) || 'N/A'}</div>}
                      {(result.data[0]?.lcl !== undefined) && <div><strong>Lower Control Limit (LCL):</strong> {result.data[0]?.lcl?.toFixed(3) || 'N/A'}</div>}
                      {(result.data[0]?.rUcl !== undefined) && <div><strong>R Chart UCL:</strong> {result.data[0]?.rUcl?.toFixed(3) || 'N/A'}</div>}
                      {(result.data[0]?.rLcl !== undefined) && <div><strong>R Chart LCL:</strong> {result.data[0]?.rLcl?.toFixed(3) || 'N/A'}</div>}
                      {(result.data[0]?.sUcl !== undefined) && <div><strong>S Chart UCL:</strong> {result.data[0]?.sUcl?.toFixed(3) || 'N/A'}</div>}
                      {(result.data[0]?.sLcl !== undefined) && <div><strong>S Chart LCL:</strong> {result.data[0]?.sLcl?.toFixed(3) || 'N/A'}</div>}
                    </div>
                  </div>
                  
                  {/* Formulas Section */}
                  <div className="bg-gray-50 p-4 rounded">
                    <h5 className="font-bold text-sm mb-2" style={{ color: '#1a1a1a' }}>Calculation Formulas</h5>
                    {activeChart === 'xbar-r' && (
                      <div className="text-xs space-y-1">
                        <div><strong>X̄ = ΣX̄/k</strong> (Overall Average)</div>
                        <div><strong>R̄ = ΣR/k</strong> (Average Range)</div>
                        <div><strong>UCL(X̄) = X̄ + A₂R̄</strong></div>
                        <div><strong>LCL(X̄) = X̄ - A₂R̄</strong></div>
                        <div><strong>UCL(R) = D₄R̄</strong></div>
                        <div><strong>LCL(R) = D₃R̄</strong></div>
                        <div className="mt-2 text-blue-600"><strong>Constants (n={subgroupSize}):</strong> A₂={CONTROL_CHART_CONSTANTS[subgroupSize]?.A2}, D₃={CONTROL_CHART_CONSTANTS[subgroupSize]?.D3}, D₄={CONTROL_CHART_CONSTANTS[subgroupSize]?.D4}</div>
                      </div>
                    )}
                    {activeChart === 'xbar-s' && (
                      <div className="text-xs space-y-1">
                        <div><strong>X̄ = ΣX̄/k</strong> (Overall Average)</div>
                        <div><strong>S̄ = ΣS/k</strong> (Average Standard Deviation)</div>
                        <div><strong>UCL(X̄) = X̄ + A₃S̄</strong></div>
                        <div><strong>LCL(X̄) = X̄ - A₃S̄</strong></div>
                        <div><strong>UCL(S) = S̄ + A₃S̄</strong></div>
                        <div><strong>LCL(S) = S̄ - A₃S̄</strong></div>
                        <div className="mt-2 text-blue-600"><strong>Constants (n={subgroupSize}):</strong> A₃={CONTROL_CHART_CONSTANTS[subgroupSize]?.A3}</div>
                      </div>
                    )}
                    {activeChart === 'p' && (
                      <div className="text-xs space-y-1">
                        <div><strong>p̄ = Σ(pn)/Σn</strong> (Overall Proportion)</div>
                        <div><strong>σ = √[p̄(1-p̄)/n]</strong> (Standard Deviation)</div>
                        <div><strong>UCL = p̄ + 3σ</strong></div>
                        <div><strong>LCL = max(0, p̄ - 3σ)</strong></div>
                      </div>
                    )}
                    {activeChart === 'pn' && (
                      <div className="text-xs space-y-1">
                        <div><strong>p̄ = Σ(pn)/(k×n)</strong> (Overall Proportion)</div>
                        <div><strong>σ = √[n×p̄(1-p̄)]</strong> (Standard Deviation)</div>
                        <div><strong>UCL = p̄×n + 3σ</strong></div>
                        <div><strong>LCL = max(0, p̄×n - 3σ)</strong></div>
                      </div>
                    )}
                    {activeChart === 'u' && (
                      <div className="text-xs space-y-1">
                        <div><strong>ū = Σ(c)/Σn</strong> (Average Defects per Unit)</div>
                        <div><strong>σ = √[ū/n]</strong> (Standard Deviation)</div>
                        <div><strong>UCL = ū + 3σ</strong></div>
                        <div><strong>LCL = max(0, ū - 3σ)</strong></div>
                      </div>
                    )}
                    {activeChart === 'c' && (
                      <div className="text-xs space-y-1">
                        <div><strong>c̄ = Σc/k</strong> (Average Defects per Unit)</div>
                        <div><strong>σ = √c̄</strong> (Standard Deviation)</div>
                        <div><strong>UCL = c̄ + 3√c̄</strong></div>
                        <div><strong>LCL = max(0, c̄ - 3√c̄)</strong></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Calculated Values */}
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-bold text-sm mb-2" style={{ color: '#1a1a1a' }}>Calculated Values</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {(result.overallMean !== undefined) && <div><strong>Overall Mean:</strong> {result.overallMean.toFixed(3)}</div>}
                      {(result.overallRange !== undefined) && <div><strong>Overall Range:</strong> {result.overallRange.toFixed(3)}</div>}
                      {(result.overallStdDev !== undefined) && <div><strong>Overall Std Dev:</strong> {result.overallStdDev.toFixed(3)}</div>}
                      {(result.overallP !== undefined) && <div><strong>Overall Proportion:</strong> {result.overallP.toFixed(4)}</div>}
                      {(result.overallU !== undefined) && <div><strong>Overall Defects/Unit:</strong> {result.overallU.toFixed(4)}</div>}
                      {(result.overallC !== undefined) && <div><strong>Overall Defects:</strong> {result.overallC.toFixed(3)}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-2 gap-4">
                <div>
                  <h4 className="heading-small mb-2">Process Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-small">Out of Control Points:</span>
                      <span className="font-bold">{result.outOfControlPoints.length}</span>
                    </div>
                    {result.outOfControlPoints.length > 0 && (
                      <div className="text-small text-red-600">
                        Points: {result.outOfControlPoints.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="heading-small mb-2">Next Steps</h4>
                  <ul className="space-y-1 ml-6 text-small">
                    <li>Investigate special causes</li>
                    <li>Eliminate assignable variation</li>
                    <li>Monitor common causes</li>
                    <li>Continue process improvement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <KaizenPromo />
      </div>
    </div>
  );
}
