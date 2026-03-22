import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function PerformanceAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-800" />
        </div>
        <div>
          <h1 className="heading-large text-gray-800">Performance Analysis</h1>
          <p className="text-gray-600">Equipment performance efficiency and utilization rate analysis</p>
        </div>
      </div>

      <div className="card">
        <h2 className="heading-medium text-gray-800 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Performance analysis calculator is under development. This will include performance efficiency, 
          utilization rate, speed losses, and capacity analysis based on Nakajima's TPM methodology.
        </p>
      </div>
    </div>
  );
}
