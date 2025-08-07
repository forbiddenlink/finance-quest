'use client';

import React from 'react';

interface BusinessFinanceLessonProps {
  onComplete?: () => void;
}

const BusinessFinanceLessonSimple: React.FC<BusinessFinanceLessonProps> = ({ onComplete }) => {
  return (
    <div>
      <h1>Business Finance Lesson</h1>
      <p>This is a test component</p>
      <button onClick={onComplete}>Complete</button>
    </div>
  );
};

export default BusinessFinanceLessonSimple;
