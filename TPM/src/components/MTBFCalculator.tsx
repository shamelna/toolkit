import React from 'react';
import { Clock } from 'lucide-react';

export default function MTBFCalculator() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg">
          <Clock className="w-6 h-6 text-green-800" />
        </div>
        <div>
          <h1 className="heading-large text-gray-800">MTBF Analysis</h1>
          <p className="text-gray-600">Mean Time Between Failures analysis for maintenance planning</p>
        </div>
      </div>

      <div className="card">
        <h2 className="heading-medium text-gray-800 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          MTBF analysis calculator is under development. This will include failure tracking, 
          trend analysis, and maintenance planning based on Nakajima's TPM methodology.
        </p>
      </div>
    </div>
  );
}
