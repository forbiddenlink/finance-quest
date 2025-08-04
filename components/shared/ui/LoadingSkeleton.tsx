'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'calculator' | 'chart' | 'text' | 'avatar' | 'button';
  count?: number;
  showPulse?: boolean;
  showShimmer?: boolean;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'card',
  count = 1,
  showPulse = true,
  showShimmer = true,
  className = ''
}: LoadingSkeletonProps) {
  const pulseAnimation = showPulse ? {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
  } : {};

  const shimmerAnimation = showShimmer ? {
    animate: { x: ['-100%', '100%'] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
  } : {};

  const baseClasses = `${theme.backgrounds.glass} border ${theme.borderColors.muted} rounded-lg overflow-hidden relative`;

  const renderSkeleton = (index: number) => {
    switch (variant) {
      case 'card':
        return (
          <motion.div
            key={index}
            className={`${baseClasses} p-6 space-y-4`}
            {...pulseAnimation}
          >
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="w-3/4 h-4 bg-white/10 rounded" />
                <div className="w-1/2 h-3 bg-white/10 rounded" />
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <div className="w-full h-3 bg-white/10 rounded" />
              <div className="w-5/6 h-3 bg-white/10 rounded" />
              <div className="w-4/6 h-3 bg-white/10 rounded" />
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-4">
              <div className="w-20 h-8 bg-white/10 rounded" />
              <div className="w-24 h-8 bg-white/10 rounded-full" />
            </div>

            {/* Shimmer overlay */}
            {showShimmer && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                {...shimmerAnimation}
              />
            )}
          </motion.div>
        );

      case 'list':
        return (
          <motion.div
            key={index}
            className={`${baseClasses} p-4`}
            {...pulseAnimation}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-white/10 rounded" />
                <div className="w-1/2 h-3 bg-white/10 rounded" />
              </div>
              <div className="w-16 h-6 bg-white/10 rounded" />
            </div>

            {showShimmer && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                {...shimmerAnimation}
              />
            )}
          </motion.div>
        );

      case 'calculator':
        return (
          <motion.div
            key={index}
            className={`${baseClasses} p-6 space-y-6`}
            {...pulseAnimation}
          >
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="w-2/3 h-5 bg-white/10 rounded" />
                <div className="w-1/3 h-3 bg-white/10 rounded" />
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-1/3 h-3 bg-white/10 rounded" />
                    <div className="w-full h-10 bg-white/10 rounded-lg" />
                  </div>
                ))}
                <div className="w-full h-12 bg-white/10 rounded-lg" />
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                <div className="w-1/2 h-5 bg-white/10 rounded" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="w-1/3 h-4 bg-white/10 rounded" />
                      <div className="w-1/4 h-6 bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
                <div className="w-full h-32 bg-white/10 rounded-lg" />
              </div>
            </div>

            {showShimmer && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                {...shimmerAnimation}
              />
            )}
          </motion.div>
        );

      case 'chart':
        return (
          <motion.div
            key={index}
            className={`${baseClasses} p-6 space-y-4`}
            {...pulseAnimation}
          >
            <div className="w-1/3 h-5 bg-white/10 rounded" />
            <div className="relative h-64">
              {/* Chart bars */}
              <div className="absolute bottom-0 left-0 w-full flex items-end justify-between space-x-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/10 rounded-t"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      width: '10%'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white/10 rounded-full" />
                  <div className="w-16 h-3 bg-white/10 rounded" />
                </div>
              ))}
            </div>

            {showShimmer && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                {...shimmerAnimation}
              />
            )}
          </motion.div>
        );

      case 'text':
        return (
          <motion.div
            key={index}
            className={`space-y-3 ${className}`}
            {...pulseAnimation}
          >
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-5/6 h-4 bg-white/10 rounded" />
            <div className="w-4/6 h-4 bg-white/10 rounded" />
          </motion.div>
        );

      case 'avatar':
        return (
          <motion.div
            key={index}
            className={`flex items-center space-x-3 ${className}`}
            {...pulseAnimation}
          >
            <div className="w-12 h-12 bg-white/10 rounded-full" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-white/10 rounded" />
              <div className="w-16 h-3 bg-white/10 rounded" />
            </div>
          </motion.div>
        );

      case 'button':
        return (
          <motion.div
            key={index}
            className={`w-32 h-10 bg-white/10 rounded-lg ${className}`}
            {...pulseAnimation}
          />
        );

      default:
        return (
          <motion.div
            key={index}
            className={`${baseClasses} p-4 space-y-3`}
            {...pulseAnimation}
          >
            <div className="w-3/4 h-4 bg-white/10 rounded" />
            <div className="w-1/2 h-3 bg-white/10 rounded" />
            <div className="w-5/6 h-3 bg-white/10 rounded" />

            {showShimmer && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                {...shimmerAnimation}
              />
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => renderSkeleton(index))}
    </div>
  );
}
