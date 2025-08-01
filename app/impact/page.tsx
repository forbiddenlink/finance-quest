'use client';

import ImpactVisualization from '@/components/demo/ImpactVisualization';
import { theme } from '@/lib/theme';

export default function ImpactPage() {
  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-4`}>
            Contest Impact Demonstration
          </h1>
          <p className={`${theme.typography.heading4} ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Real-time visualization of Finance Quest&apos;s measurable impact on financial literacy. 
            This dashboard demonstrates the quantifiable outcomes that address the 64% financial illiteracy crisis.
          </p>
        </div>
        
        <ImpactVisualization />
      </div>
    </div>
  );
}
