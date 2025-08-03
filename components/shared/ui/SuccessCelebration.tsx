'use client';

import { useState, useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { CheckCircle, Trophy, Star } from 'lucide-react';
;
import { theme } from '@/lib/theme';

interface SuccessCelebrationProps {
  show: boolean;
  title: string;
  message: string;
  onComplete?: () => void;
  type?: 'achievement' | 'quiz' | 'lesson';
}

export default function SuccessCelebration({
  show,
  title,
  message,
  onComplete,
  type = 'achievement'
}: SuccessCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'quiz': return <CheckCircle className={`w-16 h-16 ${theme.status.info.text}`} />;
      case 'lesson': return <Star className={`w-16 h-16 ${theme.status.info.text}`} />;
      default: return <Trophy className={`w-16 h-16 ${theme.textColors.warning}`} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'quiz': return 'from-blue-400 to-blue-900';
      case 'lesson': return 'from-blue-400 to-slate-600';
      default: return 'from-yellow-400 to-orange-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-up">
      <div className="relative">
        {/* Confetti */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ConfettiExplosion
            particleCount={100}
            width={1600}
            colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']}
          />
        </div>

        {/* Success Card */}
        <div className={`bg-gradient-to-br ${getColors()} p-8 rounded-2xl shadow-2xl ${theme.textColors.primary} text-center animate-fade-in-up glass max-w-md mx-4`}>
          <div className="animate-float mb-4">
            {getIcon()}
          </div>

          <h2 className="text-2xl font-bold mb-2 animate-slide-in-right stagger-1">
            {title}
          </h2>

          <p className="text-lg opacity-90 animate-slide-in-right stagger-2">
            {message}
          </p>

          <div className="mt-6 space-y-2 animate-slide-in-right stagger-3">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${theme.textColors.secondary} animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="text-sm opacity-75 flex items-center gap-1 justify-center">
              Keep up the great work!
              <Star className="w-4 h-4" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
