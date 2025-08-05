'use client';

import React, { useState, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { theme } from '@/lib/theme';

interface GuidedTourProps {
  steps: Step[];
  runTour: boolean;
  onTourEnd: () => void;
  tourKey: string;
}

export default function GuidedTour({ steps, runTour, onTourEnd, tourKey }: GuidedTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setStepIndex(0);
      onTourEnd();
      // Store that this tour has been completed
      localStorage.setItem(`tour-completed-${tourKey}`, 'true');
    } else if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  }, [onTourEnd, tourKey]);

  // Custom styles for the tour
  const joyrideStyles = {
    options: {
      primaryColor: '#3B82F6', // Blue primary color
      backgroundColor: '#1E293B', // Dark background
      textColor: '#F1F5F9', // Light text
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      arrowColor: '#1E293B',
      zIndex: 10000,
    },
    tooltip: {
      backgroundColor: '#1E293B',
      borderRadius: '8px',
      color: '#F1F5F9',
      fontSize: '14px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    tooltipContainer: {
      textAlign: 'left' as const,
    },
    tooltipTitle: {
      color: '#3B82F6',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    tooltipContent: {
      lineHeight: '1.5',
      marginBottom: '12px',
    },
    buttonNext: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderRadius: '6px',
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    buttonBack: {
      backgroundColor: 'transparent',
      color: '#94A3B8',
      border: '1px solid #475569',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      marginRight: '8px',
      cursor: 'pointer',
    },
    buttonSkip: {
      backgroundColor: 'transparent',
      color: '#94A3B8',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      marginRight: '8px',
    },
    spotlight: {
      borderRadius: '4px',
    },
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      styles={joyrideStyles}
      callback={handleJoyrideCallback}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish Tour',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}

// Helper function to check if a tour has been completed
export const hasTourBeenCompleted = (tourKey: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`tour-completed-${tourKey}`) === 'true';
};

// Helper function to reset a tour
export const resetTour = (tourKey: string): void => {
  localStorage.removeItem(`tour-completed-${tourKey}`);
};
