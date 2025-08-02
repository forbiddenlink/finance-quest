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
    solid: 'bg-gradient-to-br from-blue-500 to-blue-600',
    border: 'bg-gradient-to-r from-blue-500 to-blue-600',
    glass: `${theme.status.info.bg} border-blue-500/20`
  },
  green: {
    solid: 'bg-gradient-to-br from-green-500 to-green-600',
    border: 'bg-gradient-to-r from-green-500 to-green-600',
    glass: `${theme.status.success.bg} border-green-500/20`
  },
  purple: {
    solid: 'bg-gradient-to-br from-purple-500 to-purple-600',
    border: 'bg-gradient-to-r from-purple-500 to-purple-600',
    glass: `${theme.backgrounds.card} border-purple-500/20`
  },
  red: {
    solid: 'bg-gradient-to-br from-red-500 to-red-600',
    border: 'bg-gradient-to-r from-red-500 to-red-600',
    glass: `${theme.status.error.bg} border-red-500/20`
  },
  yellow: {
    solid: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    border: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    glass: `${theme.status.warning.bg} border-amber-500/20`
  },
  pink: {
    solid: 'bg-gradient-to-br from-pink-500 to-pink-600',
    border: 'bg-gradient-to-r from-pink-500 to-pink-600',
    glass: `${theme.backgrounds.card} border-pink-500/20`
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
