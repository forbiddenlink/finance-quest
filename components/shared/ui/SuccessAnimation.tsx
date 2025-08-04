'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Trophy, Sparkles } from 'lucide-react';
import { theme } from '@/lib/theme';

interface SuccessAnimationProps {
  isVisible: boolean;
  type: 'lesson' | 'quiz' | 'chapter' | 'milestone';
  title: string;
  description?: string;
  onComplete?: () => void;
  duration?: number;
}

export default function SuccessAnimation({
  isVisible,
  type,
  title,
  description,
  onComplete,
  duration = 3000
}: SuccessAnimationProps) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'lesson':
        return CheckCircle;
      case 'quiz':
        return Star;
      case 'chapter':
        return Trophy;
      case 'milestone':
        return Sparkles;
      default:
        return CheckCircle;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'lesson':
        return 'from-green-500 to-green-600';
      case 'quiz':
        return 'from-blue-500 to-blue-600';
      case 'chapter':
        return 'from-amber-500 to-amber-600';
      case 'milestone':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  const Icon = getIcon();
  const colorGradient = getColor();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Particle Effects */}
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
                  initial={{
                    x: '50vw',
                    y: '50vh',
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}vw`,
                    y: `${50 + (Math.random() - 0.5) * 100}vh`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Success Card */}
          <motion.div
            initial={{ scale: 0, rotateZ: -180 }}
            animate={{ scale: 1, rotateZ: 0 }}
            exit={{ scale: 0, rotateZ: 180 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.8
            }}
            className={`relative ${theme.backgrounds.card} backdrop-blur-xl border ${theme.borderColors.primary} rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl`}
          >
            {/* Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 400
              }}
              className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center shadow-lg`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 500
                }}
              >
                <Icon className={`w-10 h-10 ${theme.textColors.primary}`} />
              </motion.div>
            </motion.div>

            {/* Success Message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-2xl font-bold ${theme.textColors.primary} mb-3`}
            >
              {title}
            </motion.h2>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={`${theme.textColors.secondary} text-sm leading-relaxed mb-6`}
              >
                {description}
              </motion.p>
            )}

            {/* Progress Pulse */}
            <motion.div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorGradient} opacity-20`}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.1, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Sparkle Effects */}
            <div className="absolute -top-2 -right-2">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className={`w-6 h-6 text-amber-400`} />
              </motion.div>
            </div>

            <div className="absolute -bottom-2 -left-2">
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
              >
                <Sparkles className={`w-4 h-4 text-blue-400`} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
