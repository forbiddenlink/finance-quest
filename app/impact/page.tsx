'use client';

import ImpactVisualization from '@/components/demo/ImpactVisualization';

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Contest Impact Demonstration
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Real-time visualization of Finance Quest&apos;s measurable impact on financial literacy. 
            This dashboard demonstrates the quantifiable outcomes that address the 64% financial illiteracy crisis.
          </p>
        </div>
        
        <ImpactVisualization />
      </div>
    </div>
  );
}
