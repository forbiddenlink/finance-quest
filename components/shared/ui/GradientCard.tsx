'use client';

import { ReactNode } from 'react';
import { theme } from '@/lib/theme';

interface GradientCardProps {
  children: ReactNode;
  gradient?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'pink';
  variant?: 'solid' | 'border' | 'glass';
  hover?: boolean;
  className?: string;
}

const gradients = {
  blue: {
    solid: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    border: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    glass: `${theme.backgrounds.card} ${theme.borderColors.accent}`
  },
  green: {
    solid: 'bg-gradient-to-br from-blue-500 to-blue-600',
    border: 'bg-gradient-to-r from-blue-500 to-blue-600',
    glass: `${theme.status.success.bg} ${theme.status.success.border}`
  },
  purple: {
    solid: 'bg-gradient-to-br from-blue-500 to-slate-600',
    border: 'bg-gradient-to-r from-blue-500 to-slate-600',
    glass: `${theme.backgrounds.card} ${theme.borderColors.accent}`
  },
  red: {
    solid: 'bg-gradient-to-br from-red-500 to-pink-600',
    border: 'bg-gradient-to-r from-red-500 to-pink-600',
    glass: `${theme.status.error.bg} ${theme.status.error.border}`
  },
  yellow: {
    solid: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    border: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    glass: `${theme.status.warning.bg} ${theme.status.warning.border}`
  },
  pink: {
    solid: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    border: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    glass: `${theme.status.warning.bg} ${theme.status.warning.border}`
  }
};

export default function GradientCard({
  children,
  gradient = 'blue',
  variant = 'solid',
  hover = true,
  className = ''
}: GradientCardProps) {
  const baseClasses = 'rounded-xl shadow-lg transition-all duration-300';
  const hoverClasses = hover ? 'card-hover' : '';

  if (variant === 'border') {
    return (
      <div className={`relative ${baseClasses} ${hoverClasses} ${className}`}>
        <div className={`absolute inset-0 ${gradients[gradient].border} rounded-xl p-[2px]`}>
          <div className={`${theme.backgrounds.card} rounded-lg h-full`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'glass') {
    return (
      <div className={`${baseClasses} ${gradients[gradient].glass} backdrop-blur-sm border ${hoverClasses} ${className}`}>
        {children}
      </div>
    );
  }

  // Solid variant
  return (
    <div className={`${baseClasses} ${gradients[gradient].solid} text-white ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
