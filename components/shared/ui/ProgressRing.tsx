'use client';

import { useEffect, useState } from 'react';
import { theme } from '@/lib/theme';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  animated = true,
  className = ''
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    // Disable animation in test environment to avoid act() warnings
    const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    
    if (animated && !isTestEnv) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const progressValue = Math.round(animatedProgress);
  
  const progressProps = {
    role: "progressbar" as const,
    "aria-label": `Progress: ${progressValue}%`,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": progressValue,
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      {...progressProps}
      data-testid="progress-ring"
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]"
        />
      </svg>
      
      {/* Percentage display */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${theme.textColors.secondary}`}>
            {progressValue}%
          </span>
        </div>
      )}
    </div>
  );
}
