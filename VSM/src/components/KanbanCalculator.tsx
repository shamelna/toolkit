import React, { useState, useEffect } from 'react';
import { TrendingUp, Calculator, Package, Clock, Info, Layers } from 'lucide-react';

interface KanbanResult {
  kanbanPerShift: number;
  pitch: number;
  columnsInLevelingBox: number;
  timeLeftForChangeovers: number;
  maxChangeoversPerDay: number;
  batchSize: number;
  coToRunRatio: number;
}

export default function KanbanCalculator() {
  const [taktTime, setTaktTime] = useState<string>('60');
  const [demandPerShift, setDemandPerShift] = useState<string>('460');
  const [containerQuantity, setContainerQuantity] = useState<string>('20');
  const [packOutQuantity, setPackOutQuantity] = useState<string>('20');
  const [availableTime, setAvailableTime] = useState<string>('27600');
  const [dailyRunTime, setDailyRunTime] = useState<string>('26100');
  const [changeoverDuration, setChangeoverDuration] = useState<string>('900');
  const [batchCycleTime, setBatchCycleTime] = useState<string>('1');
  const [changeoverTime, setChangeoverTime] = useState<string>('3600');
  const [result, setResult] = useState<KanbanResult | null>(null);

  const calculateKanban = () => {
    const takt = parseFloat(taktTime) || 1;
    const demand = parseFloat(demandPerShift) || 1;
    const container = parseFloat(containerQuantity) || 1;
    const packOut = parseFloat(packOutQuantity) || 1;
    const available = parseFloat(availableTime) || 1;
    const runTime = parseFloat(dailyRunTime) || 1;
    const cODuration = parseFloat(changeoverDuration) || 1;
    const cycleTime = parseFloat(batchCycleTime) || 1;
    const cOTime = parseFloat(changeoverTime) || 1;

    // Calculate kanban per shift
    const kanbanPerShift = demand / container;

    // Calculate pitch
    const pitch = takt * packOut;

    // Calculate columns in leveling box
    const columnsInLevelingBox = available / pitch;

    // Calculate time left for changeovers
    const timeLeftForChangeovers = available - runTime;

    // Calculate max changeovers per day
    const maxChangeoversPerDay = timeLeftForChangeovers / cODuration;

    // Calculate batch size (EPE = 1 day)
    const batchSize = (cOTime / (maxChangeoversPerDay * cycleTime)) * runTime;

    // Calculate C/O-to-Run ratio
    const coToRunRatio = cOTime / (batchSize * cycleTime);

    setResult({
      kanbanPerShift,
      pitch,
      columnsInLevelingBox,
      timeLeftForChangeovers,
      maxChangeoversPerDay,
      batchSize,
      coToRunRatio,
    });
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateKanban();
  }, [taktTime, demandPerShift, containerQuantity, packOutQuantity, availableTime, dailyRunTime, changeoverDuration, batchCycleTime, changeoverTime]);

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Layers className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">Kanban & Leveling Calculator</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Design pull systems and production leveling
          </p>
          <div className="text-small text-muted mt-2">
            Book Reference: "VSM Guide"
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
                  Takt Time (seconds per piece)
                </label>
                <input
                  type="number"
                  value={taktTime}
                  onChange={(e) => setTaktTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 60"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Demand per Shift (pieces)
                </label>
                <input
                  type="number"
                  value={demandPerShift}
                  onChange={(e) => setDemandPerShift(e.target.value)}
                  className="input"
                  placeholder="e.g., 460"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Container Quantity (pieces)
                </label>
                <input
                  type="number"
                  value={containerQuantity}
                  onChange={(e) => setContainerQuantity(e.target.value)}
                  className="input"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Pack-Out Quantity (pieces)
                </label>
                <input
                  type="number"
                  value={packOutQuantity}
                  onChange={(e) => setPackOutQuantity(e.target.value)}
                  className="input"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Available Time per Shift (seconds)
                </label>
                <input
                  type="number"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 27,600"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Daily Run Time (seconds)
                </label>
                <input
                  type="number"
                  value={dailyRunTime}
                  onChange={(e) => setDailyRunTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 26,100"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Changeover Duration (seconds)
                </label>
                <input
                  type="number"
                  value={changeoverDuration}
                  onChange={(e) => setChangeoverDuration(e.target.value)}
                  className="input"
                  placeholder="e.g., 900"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Batch Cycle Time (seconds)
                </label>
                <input
                  type="number"
                  value={batchCycleTime}
                  onChange={(e) => setBatchCycleTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 1"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Changeover Time (seconds)
                </label>
                <input
                  type="number"
                  value={changeoverTime}
                  onChange={(e) => setChangeoverTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 3,600"
                />
              </div>

              <button
                onClick={calculateKanban}
                className="btn-primary w-full"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Kanban Metrics
              </button>
            </div>
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
              {/* Key Metrics */}
              <div className="grid-3" style={{ gap: '20px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Kanban per Shift</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.kanbanPerShift.toFixed(1)}
                  </div>
                  <div className="text-small text-muted">kanban</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Pitch</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.pitch.toFixed(0)}
                  </div>
                  <div className="text-small text-muted">seconds</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Leveling Box Columns</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.columnsInLevelingBox.toFixed(0)}
                  </div>
                  <div className="text-small text-muted">columns</div>
                </div>
              </div>

              {/* Time Analysis */}
              <div className="grid-2" style={{ gap: '20px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Time Left for C/O</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.timeLeftForChangeovers.toFixed(0)}
                  </div>
                  <div className="text-small text-muted">seconds</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Max C/O per Day</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.maxChangeoversPerDay.toFixed(1)}
                  </div>
                  <div className="text-small text-muted">changeovers</div>
                </div>
              </div>

              {/* Batch Analysis */}
              <div className="grid-2" style={{ gap: '20px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Batch Size (EPE=1)</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.batchSize.toFixed(0)}
                  </div>
                  <div className="text-small text-muted">pieces/day</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">C/O-to-Run Ratio</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.coToRunRatio.toFixed(1)}:1
                  </div>
                  <div className="text-small text-muted">impractical</div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="card" style={{ 
                background: 'rgba(255, 213, 89, 0.1)', 
                border: '2px solid #ffd559',
                textAlign: 'center'
              }}>
                <h3 className="heading-medium mb-3" style={{ color: '#1a1a1a' }}>Kanban System Analysis</h3>
                <div className="text-center">
                  <div className="text-body text-muted">
                    <p className="mb-2">
                      <strong>Kanban per Shift:</strong> You need {result.kanbanPerShift.toFixed(1)} kanban cards per shift.
                    </p>
                    <p className="mb-2">
                      <strong>Pitch:</strong> Withdraw {parseFloat(packOutQuantity) || 0} pieces every {result.pitch.toFixed(0)} seconds.
                    </p>
                    <p className="mb-2">
                      <strong>Leveling Box:</strong> Use {result.columnsInLevelingBox.toFixed(0)} time slots for production leveling.
                    </p>
                    <p className="mb-2">
                      <strong>Changeover Capacity:</strong> You have {result.timeLeftForChangeovers.toFixed(0)} seconds for changeovers, allowing {result.maxChangeoversPerDay.toFixed(1)} changeovers per day.
                    </p>
                    <p>
                      <strong>Batch Size:</strong> For EPE of 1 day, produce {result.batchSize.toFixed(0)} pieces per day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter your parameters to see kanban calculations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
