import React from 'react';
import { Activity } from 'lucide-react';

export default function ReliabilityMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Activity className="w-6 h-6 text-blue-800" />
        </div>
        <div>
          <h1 className="heading-large text-gray-800">Reliability Metrics</h1>
          <p className="text-gray-600">Equipment reliability analysis including MTBF, MTTR, and failure rate</p>
        </div>
      </div>

      <div className="card">
        <h2 className="heading-medium text-gray-800 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Reliability metrics calculator is under development. This will include MTBF, MTTR, 
          failure rate, and equipment reliability calculations based on Nakajima's TPM methodology.
        </p>
      </div>
    </div>
  );
}
