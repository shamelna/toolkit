// TPM Calculations based on Seiichi Nakajima's TPM methodology
// Source: TPM_KPI_Guide.md and TPM literature

export interface OEEData {
  workingHours: number; // Total working hours per day
  plannedDowntime: number; // Planned downtime in minutes
  stoppageLosses: number; // Unplanned downtime (breakdowns + setup + adjustment)
  output: number; // Total output per day
  qualityRate: number; // Quality rate as percentage (0-100)
  idealCycleTime: number; // Ideal cycle time per item
  actualCycleTime: number; // Actual cycle time per item
}

export interface OEResult {
  loadingTime: number;
  operatingTime: number;
  availability: number;
  operatingSpeedRate: number;
  netOperatingRate: number;
  performanceEfficiency: number;
  oee: number;
  utilizationRate: number;
  teep: number;
  worldClassTarget: {
    availability: number;
    performanceEfficiency: number;
    qualityRate: number;
    oee: number;
  };
  status: 'excellent' | 'good' | 'adequate' | 'inadequate';
  interpretation: string;
  recommendations: string[];
}

export interface ReliabilityData {
  totalOperatingTime: number; // Total operating time in minutes
  numberOfFailures: number; // Number of failures
  totalRepairTime: number; // Total repair time in minutes
  numberOfFailedUnits?: number; // For MTTF (non-repairable items)
}

export interface ReliabilityResult {
  mtbf: number; // Mean Time Between Failures
  mttr: number; // Mean Time To Repair
  mttf?: number; // Mean Time To Failure
  failureRate: number; // Failure rate (failures per hour)
  equipmentReliability: number; // Equipment reliability percentage
  breakdownFrequency: number; // Breakdowns per period
  worldClassTargets: {
    breakdownFrequency: number; // < 1 per month
    mtbfTarget: number; // World-class MTBF target
    mttrTarget: number; // World-class MTTR target
  };
  status: 'excellent' | 'good' | 'adequate' | 'inadequate';
  interpretation: string;
  recommendations: string[];
}

// OEE Calculations
export function calculateOEE(data: OEEData): OEResult {
  // Calculate loading time (total available time - planned downtime)
  const loadingTime = data.workingHours * 60 - data.plannedDowntime;
  
  // Calculate operating time (loading time - stoppage losses)
  const operatingTime = loadingTime - data.stoppageLosses;
  
  // Calculate availability
  const availability = (operatingTime / loadingTime) * 100;
  
  // Calculate operating speed rate
  const operatingSpeedRate = (data.idealCycleTime / data.actualCycleTime) * 100;
  
  // Calculate net operating rate
  const netOperatingRate = ((data.output * data.actualCycleTime) / operatingTime) * 100;
  
  // Calculate performance efficiency
  const performanceEfficiency = (operatingSpeedRate * netOperatingRate) / 100;
  
  // Calculate OEE
  const oee = (availability * performanceEfficiency * data.qualityRate) / 100;
  
  // Calculate utilization rate
  const totalCalendarTime = data.workingHours * 60; // Assuming daily calculation
  const utilizationRate = (loadingTime / totalCalendarTime) * 100;
  
  // Calculate TEEP
  const teep = (oee * utilizationRate) / 100;
  
  // Determine status based on world-class targets
  let status: 'excellent' | 'good' | 'adequate' | 'inadequate';
  if (oee >= 85) status = 'excellent';
  else if (oee >= 75) status = 'good';
  else if (oee >= 65) status = 'adequate';
  else status = 'inadequate';
  
  // Generate interpretation
  const interpretation = generateOEEInterpretation(oee, availability, performanceEfficiency, data.qualityRate);
  
  // Generate recommendations
  const recommendations = generateOEERecommendations(availability, performanceEfficiency, data.qualityRate);
  
  return {
    loadingTime,
    operatingTime,
    availability,
    operatingSpeedRate,
    netOperatingRate,
    performanceEfficiency,
    oee,
    utilizationRate,
    teep,
    worldClassTarget: {
      availability: 90,
      performanceEfficiency: 95,
      qualityRate: 99,
      oee: 85
    },
    status,
    interpretation,
    recommendations
  };
}

// Reliability Calculations
export function calculateReliability(data: ReliabilityData): ReliabilityResult {
  // Calculate MTBF
  const mtbf = data.totalOperatingTime / data.numberOfFailures;
  
  // Calculate MTTR
  const mttr = data.totalRepairTime / data.numberOfFailures;
  
  // Calculate MTTF (if failed units data provided)
  let mttf: number | undefined;
  if (data.numberOfFailedUnits) {
    mttf = data.totalOperatingTime / data.numberOfFailedUnits;
  }
  
  // Calculate failure rate (failures per hour)
  const failureRate = data.numberOfFailures / (data.totalOperatingTime / 60);
  
  // Calculate equipment reliability
  const equipmentReliability = (mtbf / (mtbf + mttr)) * 100;
  
  // Calculate breakdown frequency (per month, assuming 30 days)
  const breakdownFrequency = (data.numberOfFailures * 30) / (data.totalOperatingTime / (24 * 60));
  
  // Determine status
  let status: 'excellent' | 'good' | 'adequate' | 'inadequate';
  if (breakdownFrequency < 1 && mttr < 30) status = 'excellent';
  else if (breakdownFrequency < 2 && mttr < 60) status = 'good';
  else if (breakdownFrequency < 5 && mttr < 120) status = 'adequate';
  else status = 'inadequate';
  
  // Generate interpretation
  const interpretation = generateReliabilityInterpretation(mtbf, mttr, breakdownFrequency, equipmentReliability);
  
  // Generate recommendations
  const recommendations = generateReliabilityRecommendations(mtbf, mttr, breakdownFrequency);
  
  return {
    mtbf,
    mttr,
    mttf,
    failureRate,
    equipmentReliability,
    breakdownFrequency,
    worldClassTargets: {
      breakdownFrequency: 1, // < 1 per month
      mtbfTarget: 1000, // 1000+ hours
      mttrTarget: 30 // < 30 minutes
    },
    status,
    interpretation,
    recommendations
  };
}

// Helper functions for interpretations and recommendations
function generateOEEInterpretation(oee: number, availability: number, performance: number, quality: number): string {
  if (oee >= 85) {
    return `Excellent OEE of ${oee.toFixed(1)}%. Your equipment is performing at world-class levels with availability (${availability.toFixed(1)}%), performance (${performance.toFixed(1)}%), and quality (${quality.toFixed(1)}%) all meeting or exceeding targets.`;
  } else if (oee >= 75) {
    return `Good OEE of ${oee.toFixed(1)}%. Performance is strong but there are opportunities for improvement to reach world-class levels of 85%.`;
  } else if (oee >= 65) {
    return `Adequate OEE of ${oee.toFixed(1)}%. There are significant improvement opportunities in equipment effectiveness.`;
  } else {
    return `Inadequate OEE of ${oee.toFixed(1)}%. Immediate attention required to address major equipment losses and improve overall effectiveness.`;
  }
}

function generateOEERecommendations(availability: number, performance: number, quality: number): string[] {
  const recommendations: string[] = [];
  
  if (availability < 90) {
    recommendations.push('Focus on reducing breakdown losses through preventive maintenance');
    recommendations.push('Optimize setup and adjustment times to improve availability');
  }
  
  if (performance < 95) {
    recommendations.push('Address speed losses by optimizing equipment settings');
    recommendations.push('Reduce minor stoppages and idling through operator training');
  }
  
  if (quality < 99) {
    recommendations.push('Implement quality control measures to reduce defects');
    recommendations.push('Address startup losses through standardized procedures');
  }
  
  if (availability >= 90 && performance >= 95 && quality >= 99) {
    recommendations.push('Maintain current performance through continuous monitoring');
    recommendations.push('Focus on advanced improvement techniques for further gains');
  }
  
  return recommendations;
}

function generateReliabilityInterpretation(mtbf: number, mttr: number, breakdownFreq: number, reliability: number): string {
  if (breakdownFreq < 1 && mttr < 30) {
    return `Excellent reliability performance with MTBF of ${mtbf.toFixed(0)} hours, MTTR of ${mttr.toFixed(0)} minutes, and equipment reliability of ${reliability.toFixed(1)}%. Breakdown frequency of ${breakdownFreq.toFixed(1)} per month meets world-class standards.`;
  } else if (breakdownFreq < 2 && mttr < 60) {
    return `Good reliability performance with room for improvement. MTBF of ${mtbf.toFixed(0)} hours and breakdown frequency of ${breakdownFreq.toFixed(1)} per month.`;
  } else if (breakdownFreq < 5 && mttr < 120) {
    return `Adequate reliability but significant improvement opportunities exist. Focus on reducing both breakdown frequency and repair times.`;
  } else {
    return `Inadequate reliability performance requiring immediate attention. High breakdown frequency and long repair times are impacting production.`;
  }
}

function generateReliabilityRecommendations(mtbf: number, mttr: number, breakdownFreq: number): string[] {
  const recommendations: string[] = [];
  
  if (breakdownFreq > 1) {
    recommendations.push('Implement preventive maintenance program to reduce breakdown frequency');
    recommendations.push('Conduct root cause analysis for recurring failures');
  }
  
  if (mttr > 30) {
    recommendations.push('Improve maintenance response time and repair procedures');
    recommendations.push('Ensure critical spare parts availability');
    recommendations.push('Train maintenance team on quick repair techniques');
  }
  
  if (mtbf < 500) {
    recommendations.push('Review equipment design for reliability improvements');
    recommendations.push('Consider equipment replacement for chronic failures');
  }
  
  if (breakdownFreq < 1 && mttr < 30) {
    recommendations.push('Maintain current preventive maintenance schedule');
    recommendations.push('Focus on predictive maintenance for further improvements');
  }
  
  return recommendations;
}

// Utility functions for data validation
export function validateOEEData(data: OEEData): string[] {
  const errors: string[] = [];
  
  if (data.workingHours <= 0) errors.push('Working hours must be greater than 0');
  if (data.plannedDowntime < 0) errors.push('Planned downtime cannot be negative');
  if (data.stoppageLosses < 0) errors.push('Stoppage losses cannot be negative');
  if (data.output <= 0) errors.push('Output must be greater than 0');
  if (data.qualityRate < 0 || data.qualityRate > 100) errors.push('Quality rate must be between 0 and 100');
  if (data.idealCycleTime <= 0) errors.push('Ideal cycle time must be greater than 0');
  if (data.actualCycleTime <= 0) errors.push('Actual cycle time must be greater than 0');
  if (data.plannedDowntime >= data.workingHours * 60) errors.push('Planned downtime cannot exceed working hours');
  
  return errors;
}

export function validateReliabilityData(data: ReliabilityData): string[] {
  const errors: string[] = [];
  
  if (data.totalOperatingTime <= 0) errors.push('Total operating time must be greater than 0');
  if (data.numberOfFailures <= 0) errors.push('Number of failures must be greater than 0');
  if (data.totalRepairTime < 0) errors.push('Total repair time cannot be negative');
  if (data.numberOfFailedUnits && data.numberOfFailedUnits <= 0) errors.push('Number of failed units must be greater than 0');
  
  return errors;
}
