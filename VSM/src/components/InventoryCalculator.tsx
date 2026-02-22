import React, { useState, useEffect } from 'react';
import { Package, Clock, TrendingUp, Calculator, Info } from 'lucide-react';

interface InventoryResult {
  inventoryDays: number;
  productionLeadTime: number;
  inventoryTurns: number;
  vaRatio: number;
}

interface InventorySegment {
  name: string;
  waitTime: number;
  processTime: number;
  inventoryQuantity?: number;
}

export default function InventoryCalculator() {
  const [dailyDemand, setDailyDemand] = useState<string>('920');
  const [inventoryQuantity, setInventoryQuantity] = useState<string>('7000');
  const [workingDaysPerYear, setWorkingDaysPerYear] = useState<string>('240');
  const [vaTime, setVaTime] = useState<string>('188');
  const [segments, setSegments] = useState<InventorySegment[]>([
    { name: 'Raw Materials', waitTime: 5, processTime: 0 },
    { name: 'Coils', waitTime: 0, processTime: 0, inventoryQuantity: 7000 },
    { name: 'Stamped Parts', waitTime: 0, processTime: 0, inventoryQuantity: 7000 },
    { name: 'Weld/Assembly WIP', waitTime: 6.5, processTime: 0 },
    { name: 'Finished Goods', waitTime: 4.5, processTime: 0 },
  ]);
  const [result, setResult] = useState<InventoryResult | null>(null);

  const calculateInventory = () => {
    const daily = parseFloat(dailyDemand) || 1;
    const inventory = parseFloat(inventoryQuantity) || 0;
    const workingDays = parseFloat(workingDaysPerYear) || 240;
    const va = parseFloat(vaTime) || 0;

    // Calculate inventory in days
    const inventoryDays = inventory / daily;

    // Calculate production lead time (sum of all wait times)
    const productionLeadTime = segments.reduce((sum, segment) => sum + segment.waitTime, 0);

    // Calculate inventory turns
    const inventoryTurns = workingDays / productionLeadTime;

    // Calculate VA ratio
    const leadTimeSeconds = productionLeadTime * 86400; // Convert days to seconds
    const vaRatio = va / leadTimeSeconds;

    setResult({
      inventoryDays,
      productionLeadTime,
      inventoryTurns,
      vaRatio,
    });
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateInventory();
  }, [dailyDemand, inventoryQuantity, workingDaysPerYear, vaTime, segments]);

  const updateSegment = (index: number, field: keyof InventorySegment, value: string | number) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments, [field]: value };
    setSegments(newSegments);
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Package className="w-12 h-12" style={{ color: '#ffd559' }} />
            <h1 className="heading-large">Inventory & Lead Time Calculator</h1>
          </div>
          <p className="text-body text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Analyze inventory levels and production lead times
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
                  Daily Customer Demand (pieces)
                </label>
                <input
                  type="number"
                  value={dailyDemand}
                  onChange={(e) => setDailyDemand(e.target.value)}
                  className="input"
                  placeholder="e.g., 920"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Total Inventory Quantity (pieces)
                </label>
                <input
                  type="number"
                  value={inventoryQuantity}
                  onChange={(e) => setInventoryQuantity(e.target.value)}
                  className="input"
                  placeholder="e.g., 7000"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Working Days per Year
                </label>
                <input
                  type="number"
                  value={workingDaysPerYear}
                  onChange={(e) => setWorkingDaysPerYear(e.target.value)}
                  className="input"
                  placeholder="e.g., 240"
                />
              </div>

              <div>
                <label className="block text-small font-bold mb-2">
                  Total VA Processing Time (seconds)
                </label>
                <input
                  type="number"
                  value={vaTime}
                  onChange={(e) => setVaTime(e.target.value)}
                  className="input"
                  placeholder="e.g., 188"
                />
              </div>

              <button
                onClick={calculateInventory}
                className="btn-primary w-full"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Inventory Metrics
              </button>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="card">
            <h2 className="heading-medium mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3" style={{ color: '#2196F3' }} />
              Production Timeline
            </h2>
            
            <div className="space-y-3">
              {segments.map((segment, index) => (
                <div key={index} className="card" style={{ background: '#f8f9fa', border: '1px solid #e5e5e5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 className="text-small font-bold" style={{ flex: 1 }}>{segment.name}</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={segment.waitTime}
                        onChange={(e) => updateSegment(index, 'waitTime', parseFloat(e.target.value) || 0)}
                        className="input"
                        placeholder="Days"
                        style={{ width: '80px' }}
                      />
                      <input
                        type="number"
                        value={segment.processTime}
                        onChange={(e) => updateSegment(index, 'processTime', parseFloat(e.target.value) || 0)}
                        className="input"
                        placeholder="Seconds"
                        style={{ width: '80px' }}
                      />
                      {segment.inventoryQuantity !== undefined && (
                        <input
                          type="number"
                          value={segment.inventoryQuantity}
                          onChange={(e) => updateSegment(index, 'inventoryQuantity', parseFloat(e.target.value) || 0)}
                          className="input"
                          placeholder="Qty"
                          style={{ width: '80px' }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-small text-muted">
                    Wait Time: {segment.waitTime} days | Process Time: {segment.processTime} sec
                    {segment.inventoryQuantity !== undefined && ` | Inventory: ${segment.inventoryQuantity} pcs`}
                  </div>
                </div>
              ))}
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
                  <h3 className="heading-small mb-2">Inventory Days</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.inventoryDays.toFixed(1)}
                  </div>
                  <div className="text-small text-muted">days</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Production Lead Time</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.productionLeadTime.toFixed(1)}
                  </div>
                  <div className="text-small text-muted">days</div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 className="heading-small mb-2">Inventory Turns</h3>
                  <div className="heading-display" style={{ fontSize: '32px', color: '#1a1a1a' }}>
                    {result.inventoryTurns.toFixed(1)}
                  </div>
                  <div className="text-small text-muted">per year</div>
                </div>
              </div>

              {/* VA Ratio */}
              <div className="card" style={{ 
                background: 'rgba(255, 213, 89, 0.1)', 
                border: '2px solid #ffd559',
                textAlign: 'center'
              }}>
                <h3 className="heading-medium mb-3" style={{ color: '#1a1a1a' }}>Value-Added Ratio</h3>
                <div className="text-center">
                  <div className="heading-display" style={{ fontSize: '48px', color: '#1a1a1a' }}>
                    {(result.vaRatio * 100).toFixed(3)}%
                  </div>
                  <div className="text-small mt-2">
                    {parseFloat(vaTime) || 0} sec ÷ ({result.productionLeadTime.toFixed(1)} days × 86,400 sec/day)
                  </div>
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
                <div className="text-body text-muted">
                  <p className="mb-2">
                    <strong>Inventory Days:</strong> You have {result.inventoryDays.toFixed(1)} days of inventory on hand.
                  </p>
                  <p className="mb-2">
                    <strong>Production Lead Time:</strong> It takes {result.productionLeadTime.toFixed(1)} days from raw material to finished goods.
                  </p>
                  <p className="mb-2">
                    <strong>Inventory Turns:</strong> Your inventory turns over {result.inventoryTurns.toFixed(1)} times per year.
                  </p>
                  <p>
                    <strong>VA Ratio:</strong> Only {(result.vaRatio * 100).toFixed(3)}% of your total lead time is value-added processing.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter your parameters to see inventory calculations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
