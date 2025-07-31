'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Zap,
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
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">Finance Quest</h1>
              <p className="text-xs text-gray-500 whitespace-nowrap">Learning Journey</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isClient && pathname === item.href;

              const getButtonStyle = () => {
                if (!item.isAvailable) {
                  return "bg-gray-100 text-gray-400 cursor-not-allowed";
                }
                if (isActive) {
                  const colorMap = {
                    blue: "bg-blue-100 text-blue-700 border-blue-200",
                    green: "bg-green-100 text-green-700 border-green-200",
                    purple: "bg-purple-100 text-purple-700 border-purple-200",
                    orange: "bg-orange-100 text-orange-700 border-orange-200",
                    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
                    red: "bg-red-100 text-red-700 border-red-200",
                    pink: "bg-pink-100 text-pink-700 border-pink-200",
                    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200"
                  };
                  return colorMap[item.color as keyof typeof colorMap] || "bg-gray-100 text-gray-700";
                }
                return "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
              };

              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`
                      relative px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                      ${getButtonStyle()}
                      ${!item.isAvailable && 'pointer-events-none opacity-60'}
                      ${isActive ? 'shadow-sm border' : 'border-transparent hover:border-gray-200'}
                    `}
                    disabled={!item.isAvailable}
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
                            <div className="w-8 h-1">
                              <Progress value={item.progress} className="h-1" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Badge for counters */}
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Overall Progress Display */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="text-right hidden xl:block">
              <p className="text-sm font-medium text-gray-900">Progress</p>
              <p className="text-xs text-gray-500">{overallProgress}%</p>
            </div>
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
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
                  <Star className="w-5 h-5 text-yellow-500" />
                ) : overallProgress >= 50 ? (
                  <Trophy className="w-4 h-4 text-blue-500" />
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
            const isActive = isClient && pathname === item.href;

            const getMobileButtonStyle = () => {
              if (!item.isAvailable) {
                return "bg-gray-100 text-gray-400";
              }
              if (isActive) {
                const colorMap = {
                  blue: "bg-blue-100 text-blue-700",
                  green: "bg-green-100 text-green-700",
                  purple: "bg-purple-100 text-purple-700",
                  orange: "bg-orange-100 text-orange-700"
                };
                return colorMap[item.color as keyof typeof colorMap] || "bg-gray-100 text-gray-700";
              }
              return "text-gray-700 hover:bg-gray-100";
            };

            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${getMobileButtonStyle()}
                    ${!item.isAvailable && 'cursor-not-allowed opacity-60'}
                  `}
                  disabled={!item.isAvailable}
                >
                  <div className="flex items-center space-x-3 w-full">
                    {item.isAvailable ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    <span className="font-medium flex-1 text-left">{item.name}</span>
                    {item.progress !== undefined && item.progress > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {item.progress}%
                      </Badge>
                    )}
                  </div>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
