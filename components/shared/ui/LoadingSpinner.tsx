'use client';

import { Loader2 } from 'lucide-react';
import { theme } from '@/lib/theme';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin ${theme.status.info.text}`} />
      {text && (
        <span className={`text-sm ${theme.textColors.secondary} animate-pulse`}>{text}</span>
      )}
    </div>
  );
}
