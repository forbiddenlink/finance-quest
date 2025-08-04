'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Zap } from 'lucide-react';
import { theme } from '@/lib/theme';

interface EnhancedProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'rainbow';
  animated?: boolean;
  showMilestones?: boolean;
  milestones?: number[]; // Array of milestone percentages
  className?: string;
}

export default function EnhancedProgressBar({
  value,
  label,
  showPercentage = true,
  isLoading = false,
  size = 'md',
  variant = 'default',
  animated = true,
  showMilestones = false,
  milestones = [25, 50, 75, 100],
  className = ''
}: EnhancedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [recentlyCompleted, setRecentlyCompleted] = useState<number[]>([]);

  // Animate progress value change
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  // Check for milestone completions
  useEffect(() => {
    if (showMilestones) {
      const newCompletions = milestones.filter(
        milestone => value >= milestone && displayValue < milestone
      );
      
      if (newCompletions.length > 0) {
        setRecentlyCompleted(newCompletions);
        setTimeout(() => setRecentlyCompleted([]), 2000);
      }
    }
  }, [value, displayValue, milestones, showMilestones]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { height: 'h-2', text: 'text-xs' };
      case 'md':
        return { height: 'h-3', text: 'text-sm' };
      case 'lg':
        return { height: 'h-4', text: 'text-base' };
      default:
        return { height: 'h-3', text: 'text-sm' };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-green-600',
          glow: 'shadow-green-500/25',
          text: 'text-green-400'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
          glow: 'shadow-amber-500/25',
          text: 'text-amber-400'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-red-600',
          glow: 'shadow-red-500/25',
          text: 'text-red-400'
        };
      case 'rainbow':
        return {
          bg: 'bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500',
          glow: 'shadow-blue-500/25',
          text: 'text-blue-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          glow: 'shadow-blue-500/25',
          text: 'text-blue-400'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={`font-medium ${theme.textColors.primary} ${sizeClasses.text}`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <div className="flex items-center space-x-2">
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className={`w-4 h-4 ${variantClasses.text}`} />
                </motion.div>
              )}
              <span className={`font-semibold ${variantClasses.text} ${sizeClasses.text}`}>
                {Math.round(displayValue)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Track */}
        <div className={`w-full ${sizeClasses.height} ${theme.backgrounds.cardHover} rounded-full border ${theme.borderColors.muted}`}>
          {/* Progress Fill */}
          <motion.div
            className={`${sizeClasses.height} ${variantClasses.bg} rounded-full shadow-lg ${variantClasses.glow} relative overflow-hidden`}
            initial={{ width: 0 }}
            animate={{ width: `${displayValue}%` }}
            transition={{
              duration: animated ? 1.5 : 0,
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Animated Shine Effect */}
            {animated && displayValue > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            )}

            {/* Pulse Effect for Loading */}
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Milestone Markers */}
        {showMilestones && (
          <div className="absolute top-0 w-full flex justify-between">
            {milestones.map((milestone) => {
              const isCompleted = displayValue >= milestone;
              const isRecentlyCompleted = recentlyCompleted.includes(milestone);
              
              return (
                <motion.div
                  key={milestone}
                  className="relative"
                  style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isRecentlyCompleted ? [1, 1.5, 1] : 1,
                    y: isRecentlyCompleted ? [0, -8, 0] : 0
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      isCompleted
                        ? `${variantClasses.bg} border-white shadow-lg ${variantClasses.glow}`
                        : `bg-gray-600 border-gray-500`
                    } flex items-center justify-center transition-all duration-300`}
                  >
                    {isCompleted && (
                      <CheckCircle className="w-2 h-2 text-white" />
                    )}
                  </div>
                  
                  {/* Milestone Achievement Flash */}
                  {isRecentlyCompleted && (
                    <motion.div
                      className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8 }}
                    >
                      <Zap className={`w-6 h-6 ${variantClasses.text}`} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Milestone Achievement Notification */}
      {recentlyCompleted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-center p-2 ${theme.backgrounds.glass}/20 rounded-lg border ${theme.borderColors.primary}`}
        >
          <span className={`${sizeClasses.text} font-semibold ${variantClasses.text}`}>
            🎉 Milestone achieved: {recentlyCompleted[recentlyCompleted.length - 1]}%!
          </span>
        </motion.div>
      )}
    </div>
  );
}
