'use client';

import { ReactNode } from 'react';

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
    glass: 'bg-blue-500/10 border-blue-200'
  },
  green: {
    solid: 'bg-gradient-to-br from-blue-500 to-blue-600',
    border: 'bg-gradient-to-r from-blue-500 to-blue-600',
    glass: 'bg-green-500/10 border-green-200'
  },
  purple: {
    solid: 'bg-gradient-to-br from-blue-500 to-slate-600',
    border: 'bg-gradient-to-r from-blue-500 to-slate-600',
    glass: 'bg-blue-500/10 border-blue-200'
  },
  red: {
    solid: 'bg-gradient-to-br from-red-500 to-pink-600',
    border: 'bg-gradient-to-r from-red-500 to-pink-600',
    glass: 'bg-red-500/10 border-red-200'
  },
  yellow: {
    solid: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    border: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    glass: 'bg-yellow-500/10 border-yellow-200'
  },
  pink: {
    solid: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    border: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    glass: 'bg-yellow-500/10 border-yellow-200'
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
          <div className="bg-white rounded-lg h-full">
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
