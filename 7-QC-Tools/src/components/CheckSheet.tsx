import React, { useState } from 'react';
import { CheckCircle, Download, RotateCcw, Upload, TrendingUp, Table, MapPin, FileCheck, GitBranch } from 'lucide-react';
import ToolHeader from './ToolHeader';
import ExportButton from './ExportButton';
import KaizenPromo from './KaizenPromo';

interface CheckSheetData {
  type: 'distribution' | 'defective' | 'location' | 'cause' | 'confirmation';
  data: any;
}

interface DefectiveItemData {
  defects: Record<string, Record<string, number>>;
  days: string[];
  defectTypes: string[];
}

interface DistributionData {
  ranges: Array<{
    range: string;
    min: number;
    max: number;
    tally: string;
    count: number;
  }>;
  values: number[];
}

interface LocationData {
  width: number;
  height: number;
  zones: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    defects: number;
  }>;
  defects: Array<{ x: number; y: number }>;
}

export default function CheckSheet() {
  const [activeType, setActiveType] = useState<CheckSheetData['type']>('defective');
  const [defectiveData, setDefectiveData] = useState<DefectiveItemData>({
    defects: {
      'Surface scratch': { 'Mon': 12, 'Tue': 15, 'Wed': 8, 'Thu': 10, 'Fri': 11 },
      'Dimensional error': { 'Mon': 5, 'Tue': 7, 'Wed': 6, 'Thu': 4, 'Fri': 8 },
      'Void': { 'Mon': 3, 'Tue': 2, 'Wed': 4, 'Thu': 3, 'Fri': 2 },
      'Crack': { 'Mon': 1, 'Tue': 2, 'Wed': 1, 'Thu': 2, 'Fri': 1 },
      'Other': { 'Mon': 2, 'Tue': 1, 'Wed': 3, 'Thu': 1, 'Fri': 2 }
    },
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    defectTypes: ['Surface scratch', 'Dimensional error', 'Void', 'Crack', 'Other']
  });

  const [distributionData, setDistributionData] = useState<DistributionData>({
    ranges: [
      { range: '3.40-3.42', min: 3.40, max: 3.42, tally: '', count: 0 },
      { range: '3.42-3.44', min: 3.42, max: 3.44, tally: '', count: 0 },
      { range: '3.44-3.46', min: 3.44, max: 3.46, tally: '', count: 0 },
      { range: '3.46-3.48', min: 3.46, max: 3.48, tally: '', count: 0 },
      { range: '3.48-3.50', min: 3.48, max: 3.50, tally: '', count: 0 },
      { range: '3.50-3.52', min: 3.50, max: 3.52, tally: '', count: 0 },
      { range: '3.52-3.54', min: 3.52, max: 3.54, tally: '', count: 0 },
      { range: '3.54-3.56', min: 3.54, max: 3.56, tally: '', count: 0 },
      { range: '3.56-3.58', min: 3.56, max: 3.58, tally: '', count: 0 },
      { range: '3.58-3.60', min: 3.58, max: 3.60, tally: '', count: 0 }
    ],
    values: []
  });

  const [locationData, setLocationData] = useState<LocationData>({
    width: 400,
    height: 300,
    zones: [
      { id: 'q1', x: 0, y: 0, width: 200, height: 150, defects: 0 },
      { id: 'q2', x: 200, y: 0, width: 200, height: 150, defects: 0 },
      { id: 'q3', x: 0, y: 150, width: 200, height: 150, defects: 0 },
      { id: 'q4', x: 200, y: 150, width: 200, height: 150, defects: 0 }
    ],
    defects: []
  });

  const [causeData, setCauseData] = useState({
    matrix: {
      'Man': { 'Surface scratch': 8, 'Dimensional error': 3, 'Void': 1, 'Crack': 0 },
      'Machine': { 'Surface scratch': 12, 'Dimensional error': 15, 'Void': 8, 'Crack': 2 },
      'Material': { 'Surface scratch': 5, 'Dimensional error': 4, 'Void': 6, 'Crack': 1 },
      'Method': { 'Surface scratch': 18, 'Dimensional error': 6, 'Void': 2, 'Crack': 0 },
      'Measurement': { 'Surface scratch': 2, 'Dimensional error': 8, 'Void': 1, 'Crack': 1 }
    },
    causes: ['Man', 'Machine', 'Material', 'Method', 'Measurement'],
    effects: ['Surface scratch', 'Dimensional error', 'Void', 'Crack']
  });

  const [confirmationData, setConfirmationData] = useState({
    items: [
      { id: '1', check: 'Machine startup completed', status: 'pass' as const },
      { id: '2', check: 'Safety guards in place', status: 'pass' as const },
      { id: '3', check: 'Raw material verified', status: 'fail' as const },
      { id: '4', check: 'Tools calibrated', status: 'pass' as const },
      { id: '5', check: 'Work area clean', status: 'na' as const },
      { id: '6', check: 'Operator trained', status: 'pass' as const }
    ]
  });

  const loadBookExample = () => {
    // Load Ishikawa's book examples
    setDefectiveData({
      defects: {
        'Surface scratch': { 'Mon': 12, 'Tue': 15, 'Wed': 8, 'Thu': 10, 'Fri': 11 },
        'Dimensional error': { 'Mon': 5, 'Tue': 7, 'Wed': 6, 'Thu': 4, 'Fri': 8 },
        'Void': { 'Mon': 3, 'Tue': 2, 'Wed': 4, 'Thu': 3, 'Fri': 2 },
        'Crack': { 'Mon': 1, 'Tue': 2, 'Wed': 1, 'Thu': 2, 'Fri': 1 },
        'Other': { 'Mon': 2, 'Tue': 1, 'Wed': 3, 'Thu': 1, 'Fri': 2 }
      },
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      defectTypes: ['Surface scratch', 'Dimensional error', 'Void', 'Crack', 'Other']
    });
  };

  const clearData = () => {
    setDefectiveData({
      defects: {},
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      defectTypes: ['Surface scratch', 'Dimensional error', 'Void', 'Crack', 'Other']
    });
    setDistributionData({
      ranges: distributionData.ranges.map(range => ({ ...range, tally: '', count: 0 })),
      values: []
    });
    setLocationData({
      ...locationData,
      zones: locationData.zones.map(zone => ({ ...zone, defects: 0 })),
      defects: []
    });
  };

  const updateDefectiveCell = (defect: string, day: string, value: number) => {
    setDefectiveData(prev => ({
      ...prev,
      defects: {
        ...prev.defects,
        [defect]: {
          ...prev.defects[defect],
          [day]: value
        }
      }
    }));
  };

  const updateDistributionValue = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const range = distributionData.ranges.find(r => num >= r.min && num < r.max);
      if (range) {
        setDistributionData(prev => ({
          ...prev,
          ranges: prev.ranges.map(r => 
            r.range === range.range 
              ? { ...r, count: r.count + 1, tally: r.tally + '|' }
              : r
          ),
          values: [...prev.values, num]
        }));
      }
    }
  };

  const handleLocationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const zone = locationData.zones.find(z => 
      x >= z.x && x < z.x + z.width && y >= z.y && y < z.y + z.height
    );
    
    if (zone) {
      setLocationData(prev => ({
        ...prev,
        zones: prev.zones.map(z => 
          z.id === zone.id ? { ...z, defects: z.defects + 1 } : z
        ),
        defects: [...prev.defects, { x, y }]
      }));
    }
  };

  const updateConfirmationStatus = (id: string, status: 'pass' | 'fail' | 'na') => {
    setConfirmationData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, status } : item
      )
    }));
  };

  const renderDefectiveItemSheet = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header">
              <th className="p-3 text-left">Defect Type</th>
              {defectiveData.days.map(day => (
                <th key={day} className="p-3 text-center">{day}</th>
              ))}
              <th className="p-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {defectiveData.defectTypes.map(defect => {
              const total = defectiveData.days.reduce((sum, day) => 
                sum + (defectiveData.defects[defect]?.[day] || 0), 0
              );
              return (
                <tr key={defect} className="border-b">
                  <td className="p-3 font-medium">{defect}</td>
                  {defectiveData.days.map(day => (
                    <td key={day} className="p-3 text-center">
                      <input
                        type="number"
                        value={defectiveData.defects[defect]?.[day] || 0}
                        onChange={(e) => updateDefectiveCell(defect, day, parseInt(e.target.value) || 0)}
                        className="w-16 p-1 text-center border rounded"
                        min="0"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold">{total}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-bold">
              <td className="p-3">Total</td>
              {defectiveData.days.map(day => {
                const dayTotal = defectiveData.defectTypes.reduce((sum, defect) => 
                  sum + (defectiveData.defects[defect]?.[day] || 0), 0
                );
                return (
                  <td key={day} className="p-3 text-center">{dayTotal}</td>
                );
              })}
              <td className="p-3 text-center">
                {defectiveData.defectTypes.reduce((sum, defect) => 
                  sum + defectiveData.days.reduce((daySum, day) => 
                    daySum + (defectiveData.defects[defect]?.[day] || 0), 0
                  ), 0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDistributionSheet = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-small font-bold mb-2">
          Enter Measurement Values
        </label>
        <input
          type="text"
          placeholder="Enter values (e.g., 3.45, 3.52, 3.48)"
          className="input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              updateDistributionValue((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <p className="text-xs text-muted mt-1">Press Enter to add each value</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header">
              <th className="p-3 text-left">Range</th>
              <th className="p-3 text-center">Tally</th>
              <th className="p-3 text-center">Count</th>
            </tr>
          </thead>
          <tbody>
            {distributionData.ranges.map(range => (
              <tr key={range.range} className="border-b">
                <td className="p-3">{range.range}</td>
                <td className="p-3 text-center font-mono">{range.tally}</td>
                <td className="p-3 text-center font-bold">{range.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLocationSheet = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-small mb-3">Click on the product shape to mark defect locations:</p>
        <div 
          className="relative bg-white border-2 border-gray-300 rounded cursor-crosshair"
          style={{ width: `${locationData.width}px`, height: `${locationData.height}px` }}
          onClick={handleLocationClick}
        >
          {/* Zone dividers */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <div className="absolute top-0 bottom-0 left-1/2 border-l border-gray-300" />
          </div>
          
          {/* Zone labels */}
          {locationData.zones.map(zone => (
            <div key={zone.id} className="absolute text-xs text-gray-500" 
                 style={{ left: zone.x + 10, top: zone.y + 10 }}>
              Q{zone.id.slice(-1)} ({zone.defects})
            </div>
          ))}
          
          {/* Defect points */}
          {locationData.defects.map((defect, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{ left: defect.x - 4, top: defect.y - 4 }}
            />
          ))}
        </div>
      </div>

      <div className="grid-2 gap-4">
        {locationData.zones.map(zone => (
          <div key={zone.id} className="card p-3">
            <div className="flex justify-between items-center">
              <span className="text-small font-bold">Zone {zone.id.slice(-1)}</span>
              <span className="badge-warn">{zone.defects} defects</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCauseSheet = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header">
              <th className="p-3 text-left">Cause</th>
              {causeData.effects.map(effect => (
                <th key={effect} className="p-3 text-center">{effect}</th>
              ))}
              <th className="p-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {causeData.causes.map(cause => {
              const total = causeData.effects.reduce((sum, effect) => 
                sum + (causeData.matrix[cause]?.[effect] || 0), 0
              );
              return (
                <tr key={cause} className="border-b">
                  <td className="p-3 font-medium">{cause}</td>
                  {causeData.effects.map(effect => (
                    <td key={effect} className="p-3 text-center">
                      <input
                        type="number"
                        value={causeData.matrix[cause]?.[effect] || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setCauseData(prev => ({
                            ...prev,
                            matrix: {
                              ...prev.matrix,
                              [cause]: {
                                ...prev.matrix[cause],
                                [effect]: value
                              }
                            }
                          }));
                        }}
                        className="w-16 p-1 text-center border rounded"
                        min="0"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderConfirmationSheet = () => (
    <div className="space-y-4">
      {confirmationData.items.map(item => (
        <div key={item.id} className="flex items-center justify-between p-3 border rounded">
          <span className="text-body">{item.check}</span>
          <div className="flex gap-2">
            <button
              onClick={() => updateConfirmationStatus(item.id, 'pass')}
              className={`px-3 py-1 rounded text-small font-medium ${
                item.status === 'pass' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ✓ Pass
            </button>
            <button
              onClick={() => updateConfirmationStatus(item.id, 'fail')}
              className={`px-3 py-1 rounded text-small font-medium ${
                item.status === 'fail' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ✗ Fail
            </button>
            <button
              onClick={() => updateConfirmationStatus(item.id, 'na')}
              className={`px-3 py-1 rounded text-small font-medium ${
                item.status === 'na' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              — N/A
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const checkSheetTypes = [
    { id: 'defective', name: 'Defective Item Check Sheet', icon: Table, description: 'Track defect types by time period' },
    { id: 'distribution', name: 'Process Distribution Check Sheet', icon: TrendingUp, description: 'Record measurement values in ranges' },
    { id: 'location', name: 'Defect Location Check Sheet', icon: MapPin, description: 'Mark defect locations on product' },
    { id: 'cause', name: 'Defect Cause Check Sheet', icon: GitBranch, description: 'Matrix of causes vs defect types' },
    { id: 'confirmation', name: 'Checkup Confirmation Check Sheet', icon: FileCheck, description: 'Process verification checklist' }
  ];

  return (
    <div className="section section-light">
      <div className="container">
        <ToolHeader
          number="03"
          title="CHECK SHEET"
          subtitle="Structured form for collecting and categorizing data at the point of occurrence"
        />

        {/* Check Sheet Type Selection */}
        <div className="mb-8">
          <div className="grid-3">
            {checkSheetTypes.map(type => (
              <div
                key={type.id}
                className={`card cursor-pointer transition-all ${
                  activeType === type.id ? 'ring-2 ring-yellow-500' : ''
                }`}
                onClick={() => setActiveType(type.id as CheckSheetData['type'])}
              >
                <div className="flex items-center gap-3 mb-3">
                  <type.icon className="w-6 h-6 text-yellow-600" />
                  <h3 className="heading-small">{type.name}</h3>
                </div>
                <p className="text-small text-muted">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-body">
          {/* Input Panel */}
          <div className="input-panel">
            <div className="card">
              <h2 className="heading-medium mb-4">
                {checkSheetTypes.find(t => t.id === activeType)?.name}
              </h2>
              
              <div className="flex gap-3 mb-6">
                <button onClick={loadBookExample} className="btn-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Load Book Example
                </button>
                <button onClick={clearData} className="btn-ghost">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Data
                </button>
              </div>

              {activeType === 'defective' && renderDefectiveItemSheet()}
              {activeType === 'distribution' && renderDistributionSheet()}
              {activeType === 'location' && renderLocationSheet()}
              {activeType === 'cause' && renderCauseSheet()}
              {activeType === 'confirmation' && renderConfirmationSheet()}
            </div>
          </div>

          {/* Chart Panel */}
          <div className="chart-panel">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-small mb-0">Check Sheet Analysis</h3>
                <ExportButton
                  dataExport={{
                    data: activeType === 'defective'
                      ? defectiveData.defectTypes.map(defect => {
                          const row: any = { 'Defect Type': defect };
                          defectiveData.days.forEach(day => { row[day] = defectiveData.defects[defect]?.[day] || 0; });
                          row['Total'] = defectiveData.days.reduce((s, d) => s + (defectiveData.defects[defect]?.[d] || 0), 0);
                          return row;
                        })
                      : activeType === 'cause'
                      ? causeData.causes.map(cause => {
                          const row: any = { 'Cause': cause };
                          causeData.effects.forEach(e => { row[e] = causeData.matrix[cause]?.[e] || 0; });
                          row['Total'] = causeData.effects.reduce((s, e) => s + (causeData.matrix[cause]?.[e] || 0), 0);
                          return row;
                        })
                      : confirmationData.items.map(i => ({ Check: i.check, Status: i.status.toUpperCase() })),
                    sheetName: `CheckSheet-${activeType}`
                  }}
                  reportData={{
                    title: `Check Sheet Analysis Report — ${checkSheetTypes.find(t => t.id === activeType)?.name}`,
                    toolName: 'Check Sheet — Tool 03 of the 7 QC Tools',
                    date: new Date().toLocaleDateString(),
                    data: {
                      sections: [
                        {
                          heading: 'Sheet Type & Purpose',
                          stats: {
                            'Active Sheet Type': checkSheetTypes.find(t => t.id === activeType)?.name || activeType,
                            'Description': checkSheetTypes.find(t => t.id === activeType)?.description || '',
                          }
                        },
                        ...(activeType === 'defective' ? [{
                          heading: 'Defective Item Summary',
                          table: {
                            headers: ['Defect Type', ...defectiveData.days, 'Total'],
                            rows: defectiveData.defectTypes.map(defect => [
                              defect,
                              ...defectiveData.days.map(d => defectiveData.defects[defect]?.[d] || 0),
                              defectiveData.days.reduce((s, d) => s + (defectiveData.defects[defect]?.[d] || 0), 0)
                            ])
                          }
                        }] : []),
                        ...(activeType === 'cause' ? [{
                          heading: 'Cause vs Effect Matrix',
                          table: {
                            headers: ['Cause', ...causeData.effects, 'Total'],
                            rows: causeData.causes.map(cause => [
                              cause,
                              ...causeData.effects.map(e => causeData.matrix[cause]?.[e] || 0),
                              causeData.effects.reduce((s, e) => s + (causeData.matrix[cause]?.[e] || 0), 0)
                            ])
                          }
                        }] : []),
                        ...(activeType === 'confirmation' ? [{
                          heading: 'Confirmation Results',
                          stats: {
                            'Total Items': confirmationData.items.length,
                            'Passed': confirmationData.items.filter(i => i.status === 'pass').length,
                            'Failed': confirmationData.items.filter(i => i.status === 'fail').length,
                            'N/A': confirmationData.items.filter(i => i.status === 'na').length,
                            'Pass Rate': ((confirmationData.items.filter(i => i.status === 'pass').length / confirmationData.items.length) * 100).toFixed(1) + '%'
                          }
                        }, {
                          heading: 'Checklist Detail',
                          list: confirmationData.items.map(i => `[${i.status.toUpperCase()}] ${i.check}`)
                        }] : []),
                        {
                          heading: 'Methodology Note',
                          text: "According to Ishikawa: 'Check sheets are simple devices for collecting data at the source. They should be designed to be easy to use and to provide immediate visual feedback.' Collected data should be analysed using Pareto charts to identify the most significant issues."
                        }
                      ]
                    },
                    summary: `Check sheet analysis using ${checkSheetTypes.find(t => t.id === activeType)?.name}. Data collected per Ishikawa's structured data collection methodology.`,
                    recommendations: [
                      'Analyse collected data with Pareto chart to identify the vital few issues',
                      'Investigate highest-frequency defects using Fishbone (Cause & Effect) diagram',
                      'Review and update check sheet design regularly based on findings',
                      'Train team members on consistent data collection methods',
                      'Use data to drive targeted corrective and preventive actions'
                    ]
                  }}
                />
              </div>
              
              {activeType === 'defective' && (
                <div className="space-y-4">
                  <h4 className="heading-small">Defect Summary</h4>
                  {defectiveData.defectTypes.map(defect => {
                    const total = defectiveData.days.reduce((sum, day) => 
                      sum + (defectiveData.defects[defect]?.[day] || 0), 0
                    );
                    return (
                      <div key={defect} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-body">{defect}</span>
                        <span className="badge-warn">{total} total</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeType === 'distribution' && (
                <div className="space-y-4">
                  <h4 className="heading-small">Distribution Summary</h4>
                  <div className="text-center py-8">
                    <p className="text-muted">Enter measurement values to see distribution</p>
                    <p className="text-small text-muted mt-2">
                      Total values recorded: {distributionData.values.length}
                    </p>
                  </div>
                </div>
              )}

              {activeType === 'location' && (
                <div className="space-y-4">
                  <h4 className="heading-small">Location Analysis</h4>
                  <div className="text-center py-8">
                    <p className="text-muted">Click on the product shape to mark defects</p>
                    <p className="text-small text-muted mt-2">
                      Total defects: {locationData.defects.length}
                    </p>
                  </div>
                </div>
              )}

              {activeType === 'cause' && (
                <div className="space-y-4">
                  <h4 className="heading-small">Cause Analysis</h4>
                  {causeData.causes.map(cause => {
                    const total = causeData.effects.reduce((sum, effect) => 
                      sum + (causeData.matrix[cause]?.[effect] || 0), 0
                    );
                    return (
                      <div key={cause} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-body">{cause}</span>
                        <span className="badge-warn">{total} total</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeType === 'confirmation' && (
                <div className="space-y-4">
                  <h4 className="heading-small">Check Results</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-small">Passed:</span>
                      <span className="badge-ok">
                        {confirmationData.items.filter(i => i.status === 'pass').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-small">Failed:</span>
                      <span className="badge-alert">
                        {confirmationData.items.filter(i => i.status === 'fail').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-small">N/A:</span>
                      <span className="badge-warn">
                        {confirmationData.items.filter(i => i.status === 'na').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interpretation Panel */}
        <div className="interpretation-panel card-featured">
          <h3 className="heading-medium mb-4">Check Sheet Methodology</h3>
          <div className="text-body text-muted">
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <h4 className="heading-small mb-2">Ishikawa's Guidance</h4>
              <p className="text-small">
                "Check sheets are simple devices for collecting data at the source. 
                They should be designed to be easy to use and to provide immediate visual feedback."
              </p>
            </div>

            <div className="grid-2 gap-4">
              <div>
                <h4 className="heading-small mb-2">Key Principles</h4>
                <ul className="space-y-1 ml-6">
                  <li className="text-body">Collect data at the point of occurrence</li>
                  <li className="text-body">Design for ease of use</li>
                  <li className="text-body">Provide immediate visual feedback</li>
                  <li className="text-body">Minimize writing and calculation</li>
                </ul>
              </div>
              <div>
                <h4 className="heading-small mb-2">Best Practices</h4>
                <ul className="space-y-1 ml-6">
                  <li className="text-body">Train users on proper completion</li>
                  <li className="text-body">Review and update regularly</li>
                  <li className="text-body">Use consistent terminology</li>
                  <li className="text-body">Include clear instructions</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="heading-small mb-2">Next Steps</h4>
              <p className="text-small">
                Analyze the collected data using Pareto charts to identify the most significant issues. 
                Use the insights to prioritize improvement efforts.
              </p>
            </div>
          </div>
        </div>

        <KaizenPromo />
      </div>
    </div>
  );
}
