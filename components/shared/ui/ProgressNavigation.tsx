'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Home,
  BookOpen,
  Calculator,
  BarChart3,
  Target,
  CheckCircle,
  Lock,
  Star,
  AlertTriangle
} from 'lucide-react';

export default function ProgressNavigation() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userProgress = useProgressStore(state => state.userProgress);
  const getChapterProgress = useProgressStore(state => state.getChapterProgress);
  const isChapterUnlocked = useProgressStore(state => state.isChapterUnlocked);

  const totalQuizzesPassed = Object.values(userProgress.quizScores).filter(score => score >= 80).length;
  const calculatorsUsed = Object.keys(userProgress.calculatorUsage).length;
  const simulationsCompleted = Object.keys(userProgress.simulationResults || {}).length;
  const overallProgress = Math.round((userProgress.completedLessons.length / 15) * 100); // Assuming 15 total lessons

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      color: 'blue',
      isAvailable: true
    },
    {
      name: 'Chapter 1',
      href: '/chapter1',
      icon: BookOpen,
      color: 'green',
      isAvailable: true,
      progress: getChapterProgress(1)
    },
    {
      name: 'Chapter 2',
      href: '/chapter2',
      icon: BookOpen,
      color: 'purple',
      isAvailable: isChapterUnlocked(2),
      progress: getChapterProgress(2)
    },
    {
      name: 'Chapter 3',
      href: '/chapter3',
      icon: BookOpen,
      color: 'orange',
      isAvailable: isChapterUnlocked(3),
      progress: getChapterProgress(3)
    },
    {
      name: 'Calculators',
      href: '/calculators',
      icon: Calculator,
      color: 'cyan',
      isAvailable: true,
      badge: calculatorsUsed
    },
    {
      name: 'Crisis Sim',
      href: '/crisis-simulation',
      icon: AlertTriangle,
      color: 'red',
      isAvailable: userProgress.completedLessons.length >= 2,
      badge: simulationsCompleted
    },
    {
      name: 'Assessment',
      href: '/assessment',
      icon: Target,
      color: 'pink',
      isAvailable: userProgress.completedLessons.length >= 3,
      badge: totalQuizzesPassed
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: BarChart3,
      color: 'indigo',
      isAvailable: true
    }
  ];

  return (
    <nav className={`${theme.backgrounds.primary} shadow-2xl border-b ${theme.borderColors.muted} sticky top-0 z-50 backdrop-blur-lg`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo - True Left Alignment */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative group">
              <div className={`w-9 h-9 ${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105 hover:${theme.borderColors.primary}`}>
                {/* Subtle background glow */}
                <div className={`absolute inset-0 ${theme.status.warning.bg} opacity-5`}></div>
                
                {/* Clean financial symbol */}
                <svg viewBox="0 0 24 24" className={`w-5 h-5 ${theme.textColors.accent} relative z-10`} fill="none" stroke="currentColor" strokeWidth="2">
                  {/* Dollar sign with education element */}
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  {/* Learning progress arc */}
                  <path d="M8 3a9 9 0 0 1 8 8" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-base font-bold ${theme.textColors.accent} whitespace-nowrap`}>
                Finance Quest
              </h1>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center space-x-3 flex-1 justify-center mx-8">
            {/* Always show essential navigation */}
            <Link href="/">
              <button className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 ${
                isClient && pathname === '/' 
                  ? 'bg-blue-600/90 text-blue-100 shadow-sm' 
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-300'
              }`}>
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </Link>

            {/* Chapter navigation - responsive */}
            {navigationItems.slice(1, 4).map((item) => {
              const Icon = item.icon;
              const isActive = isClient && pathname === item.href;
              
              if (!item.isAvailable) return (
                <div key={item.name} className="px-3 py-2 rounded-lg text-xs text-slate-500 flex items-center space-x-1.5 opacity-50">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden md:inline text-xs">{item.name}</span>
                </div>
              );

              return (
                <Link key={item.name} href={item.href}>
                  <button className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 relative ${
                    isActive 
                      ? 'bg-amber-600/90 text-amber-100 shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
                    {item.progress === 100 && (
                      <CheckCircle className="w-2.5 h-2.5 text-current absolute -top-0.5 -right-0.5 bg-current rounded-full" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Right: Tools */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {navigationItems.slice(4).map((item) => {
              const Icon = item.icon;
              const isActive = isClient && pathname === item.href;
              
              if (!item.isAvailable) return null;

              // Don't show badge for calculators
              const shouldShowBadge = item.name !== 'Calculators' && item.badge && item.badge > 0;

              return (
                <Link key={item.name} href={item.href}>
                  <button className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 relative ${
                    isActive 
                      ? 'bg-blue-600/90 text-blue-100 shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">{item.name}</span>
                    {shouldShowBadge && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold text-xs leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Compact Progress Display */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative w-9 h-9 group flex-shrink-0">
              <svg className="w-9 h-9 transform -rotate-90 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${overallProgress}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    transition: 'stroke-dasharray 0.5s ease-in-out'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {overallProgress >= 80 ? (
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <span className="text-xs font-bold text-amber-400">{overallProgress}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className="xl:hidden border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="px-3 py-2">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
            {navigationItems.slice(4).filter(item => item.isAvailable).map((item) => {
              const Icon = item.icon;
              const isActive = isClient && pathname === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600/80 text-blue-100' 
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}>
                    <Icon className="w-3 h-3" />
                    <span>{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-amber-400/20 text-amber-300 text-xs px-1 rounded">{item.badge}</span>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
