'use client';

import React from 'react';
import Link from 'next/link';
import { useProgressStore } from '@/lib/store/progressStore';
import { 
  Home, 
  BookOpen, 
  Calculator, 
  BarChart3, 
  Trophy, 
  Target,
  CheckCircle,
  Lock,
  Star,
  Zap
} from 'lucide-react';

export default function ProgressNavigation() {
  const userProgress = useProgressStore(state => state.userProgress);
  const getChapterProgress = useProgressStore(state => state.getChapterProgress);
  const isChapterUnlocked = useProgressStore(state => state.isChapterUnlocked);

  const totalQuizzesPassed = Object.values(userProgress.quizScores).filter(score => score >= 80).length;
  const calculatorsUsed = Object.keys(userProgress.calculatorUsage).length;
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
      name: 'Assessment',
      href: '/assessment',
      icon: Target,
      color: 'red',
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
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Finance Quest</h1>
              <p className="text-xs text-gray-500">Your Financial Learning Journey</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const colorClasses = {
                blue: 'text-blue-600 bg-blue-50 border-blue-200',
                green: 'text-green-600 bg-green-50 border-green-200',
                purple: 'text-purple-600 bg-purple-50 border-purple-200',
                orange: 'text-orange-600 bg-orange-50 border-orange-200',
                cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
                red: 'text-red-600 bg-red-50 border-red-200',
                indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
              };

              const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={`
                      relative px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                      ${item.isAvailable 
                        ? `hover:shadow-md hover:scale-105 cursor-pointer ${
                            isActive ? colorClasses[item.color as keyof typeof colorClasses] : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`
                        : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      {item.isAvailable ? (
                        <Icon className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>{item.name}</span>
                      
                      {/* Progress indicator */}
                      {item.progress !== undefined && item.progress > 0 && (
                        <div className="flex items-center space-x-1">
                          {item.progress === 100 ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-${item.color}-500 transition-all duration-300`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Badge for counters */}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`bg-${item.color}-500 text-white text-xs px-1.5 py-0.5 rounded-full`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Overall Progress Display */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Overall Progress</p>
              <p className="text-xs text-gray-500">{overallProgress}% Complete</p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${overallProgress}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {overallProgress >= 80 ? (
                  <Star className="w-6 h-6 text-yellow-500" />
                ) : overallProgress >= 50 ? (
                  <Trophy className="w-5 h-5 text-blue-500" />
                ) : (
                  <span className="text-xs font-bold text-gray-600">{overallProgress}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-3 space-y-2">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${item.isAvailable 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {item.isAvailable ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  <span className="font-medium">{item.name}</span>
                  {item.progress !== undefined && item.progress > 0 && (
                    <span className="text-xs text-gray-500">({item.progress}%)</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
