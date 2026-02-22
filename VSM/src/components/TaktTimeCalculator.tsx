import React, { useState, useEffect } from 'react';
import { Clock, Calculator, Info, TrendingUp, Zap } from 'lucide-react';

interface TaktTimeResult {
  availableWorkingTime: number;
  customerDemandPerShift: number;
  taktTime: number;
  taktTimeFormatted: string;
}

interface ExampleData {
  name: string;
  totalShiftTime: number;
  breakTime: number;
  monthlyDemand: number;
  workingDaysPerMonth: number;
  shiftsPerDay: number;
}

const examples: ExampleData[] = [
  {
    name: 'Generic Example',
    totalShiftTime: 27000,
    breakTime: 0,
    monthlyDemand: 9100,
    workingDaysPerMonth: 20,
    shiftsPerDay: 1,
  },
  {
    name: 'ACME Stamping',
    totalShiftTime: 28800,
    breakTime: 1200,
    monthlyDemand: 18400,
    workingDaysPerMonth: 20,
    shiftsPerDay: 2,
  },
  {
    name: 'TWI Industries',
    totalShiftTime: 28800,
    breakTime: 1800,
    monthlyDemand: 24000,
    workingDaysPerMonth: 20,
    shiftsPerDay: 2,
  },
];

export default function TaktTimeCalculator() {
  const [totalShiftTime, setTotalShiftTime] = useState<string>('28800');
  const [breakTime, setBreakTime] = useState<string>('1200');
  const [monthlyDemand, setMonthlyDemand] = useState<string>('18400');
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<string>('20');
  const [shiftsPerDay, setShiftsPerDay] = useState<string>('2');
  const [result, setResult] = useState<TaktTimeResult | null>(null);

  const calculateTaktTime = () => {
    const totalShift = parseFloat(totalShiftTime) || 0;
    const breaks = parseFloat(breakTime) || 0;
    const monthly = parseFloat(monthlyDemand) || 0;
    const workingDays = parseFloat(workingDaysPerMonth) || 1;
    const shifts = parseFloat(shiftsPerDay) || 1;

    const availableWorkingTime = totalShift - breaks;
    const dailyDemand = monthly / workingDays;
    const demandPerShift = dailyDemand / shifts;
    const taktTime = availableWorkingTime / demandPerShift;

    setResult({
      availableWorkingTime,
      customerDemandPerShift: demandPerShift,
      taktTime,
      taktTimeFormatted: taktTime.toFixed(2),
    });
  };

  const loadExample = (example: ExampleData) => {
    setTotalShiftTime(example.totalShiftTime.toString());
    setBreakTime(example.breakTime.toString());
    setMonthlyDemand(example.monthlyDemand.toString());
    setWorkingDaysPerMonth(example.workingDaysPerMonth.toString());
    setShiftsPerDay(example.shiftsPerDay.toString());
  };

  useEffect(() => {
    calculateTaktTime();
  }, []);

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Clock className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">Takt Time Calculator</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Calculate production pace needed to meet customer demand
          </p>
          <div className="text-small text-muted mt-2">
            Formula: Takt Time = Available Working Time ÷ Customer Demand per Shift
          </div>
          <div className="text-small text-muted mt-1">
            Book Reference: "VSM Guide"
          </div>
        </div>

        {/* Examples Section */}
        <div className="card-elevated mb-8">
          <h2 className="heading-medium mb-6 flex items-center">
            <Info className="w-6 h-6 mr-3" style={{ color: '#2196F3' }} />
            Quick Examples
          </h2>
          <div className="grid-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example)}
                className="card"
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
              >
                <h3 className="heading-small mb-2">{example.name}</h3>
                <div className="text-small text-muted space-y-1">
                  <div>Shift Time: {example.totalShiftTime}s</div>
                  <div>Break Time: {example.breakTime}s</div>
                  <div>Monthly Demand: {example.monthlyDemand.toLocaleString()} pcs</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid-2">
          {/* Input Section */}
          <div className="card">
            <h2 className="heading-medium mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-3" style={{ color: '#4CAF50' }} />
              Input Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-small font-bold mb-2">
                  Total Shift Time (seconds)
                </label>
                <input
                  type="number"
                  value={totalShiftTime}
                  onChange={(e) => setTotalShiftTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 28800 (8 hours × 3600 sec/hr)"
                />
                <p className="text-small text-muted mt-1">
                  Example: 8 hours × 3,600 sec/hr = 28,800 seconds
                </p>
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Break Time (seconds)
                </label>
                <input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 1200 (2 × 10 min × 60 sec)"
                />
                <p className="text-small text-muted mt-1">
                  Example: 2 breaks × 10 min × 60 sec/min = 1,200 seconds
                </p>
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Monthly Customer Demand (pieces)
                </label>
                <input
                  type="number"
                  value={monthlyDemand}
                  onChange={(e) => setMonthlyDemand(e.target.value)}
                  className="input"
                  placeholder="e.g., 18400"
                />
                <p className="text-small text-muted mt-1">
                  Total customer demand per month
                </p>
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Working Days per Month
                </label>
                <input
                  type="number"
                  value={workingDaysPerMonth}
                  onChange={(e) => setWorkingDaysPerMonth(e.target.value)}
                  className="input"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Number of Shifts per Day
                </label>
                <input
                  type="number"
                  value={shiftsPerDay}
                  onChange={(e) => setShiftsPerDay(e.target.value)}
                  className="input"
                  placeholder="e.g., 2"
                />
                <p className="text-small text-muted mt-1">
                  Given — two-shift operation
                </p>
              </div>

              <button
                onClick={calculateTaktTime}
                className="btn-primary w-full"
              >
                <Zap className="w-5 h-5 mr-2" />
                Calculate Takt Time
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="card">
            <h2 className="heading-medium mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#DC2626' }} />
              Calculation Results
            </h2>

            {result ? (
              <div className="space-y-6">
                {/* Intermediate Calculations */}
                <div className="space-y-3">
                  <h3 className="heading-small">Step-by-Step Calculation:</h3>
                  
                  <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-small font-bold">Available Working Time:</span>
                      <span className="font-mono font-bold" style={{ color: '#1a1a1a' }}>
                        {result.availableWorkingTime.toLocaleString()} seconds
                      </span>
                    </div>
                    <div className="text-small text-muted">
                      {parseFloat(totalShiftTime) || 0} - {parseFloat(breakTime) || 0} = {result.availableWorkingTime.toString()}
                    </div>
                  </div>

                  <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-small font-bold">Daily Customer Demand:</span>
                      <span className="font-mono font-bold" style={{ color: '#1a1a1a' }}>
                        {Math.round(result.customerDemandPerShift * parseFloat(shiftsPerDay || '1'))} pcs/day
                      </span>
                    </div>
                    <div className="text-small text-muted">
                      {parseFloat(monthlyDemand) || 0} ÷ {parseFloat(workingDaysPerMonth) || 1} = {Math.round(result.customerDemandPerShift * parseFloat(shiftsPerDay || '1')).toString()}
                    </div>
                  </div>

                  <div className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-small font-bold">Customer Demand per Shift:</span>
                      <span className="font-mono font-bold" style={{ color: '#1a1a1a' }}>
                        {result.customerDemandPerShift.toFixed(1)} pcs/shift
                      </span>
                    </div>
                    <div className="text-small text-muted">
                      {Math.round(result.customerDemandPerShift * parseFloat(shiftsPerDay || '1'))} ÷ {parseFloat(shiftsPerDay) || 1} = {result.customerDemandPerShift.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Final Result */}
                <div className="card" style={{ 
                  background: 'rgba(255, 213, 89, 0.1)', 
                  border: '2px solid #ffd559',
                  textAlign: 'center'
                }}>
                  <h3 className="heading-medium mb-3" style={{ color: '#1a1a1a' }}>Takt Time Result:</h3>
                  <div className="text-center">
                    <div className="heading-display" style={{ fontSize: '48px', color: '#1a1a1a' }}>
                      {result.taktTimeFormatted}
                    </div>
                    <div className="text-body mt-1">seconds per piece</div>
                    <div className="text-small text-muted mt-2">
                      ≈ {Math.round(result.taktTime)} seconds per piece
                    </div>
                  </div>
                  <div className="mt-4 text-small">
                    <strong>Formula:</strong> {result.availableWorkingTime.toLocaleString()} ÷ {result.customerDemandPerShift.toFixed(1)} = {result.taktTimeFormatted} seconds
                  </div>
                </div>

                {/* Interpretation */}
                <div className="card" style={{ 
                  background: '#f8f9fa', 
                  border: '1px solid #2196F3'
                }}>
                  <h4 className="heading-small mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" style={{ color: '#2196F3' }} />
                    What this means:
                  </h4>
                  <p className="text-body text-muted">
                    Your production process must complete one unit every {result.taktTimeFormatted} seconds 
                    to meet customer demand. Any process taking longer than this time will create delays.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter your parameters and click "Calculate Takt Time" to see results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
