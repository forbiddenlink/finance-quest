'use client';

import BeforeAfterAssessment from '@/components/demo/BeforeAfterAssessment';

export default function AssessmentPage() {
  return (
    <BeforeAfterAssessment 
      isDemo={true}
      onComplete={(results) => {
        console.log('Assessment results:', results);
        // Could save results to context or localStorage for demo purposes
      }}
    />
  );
}
