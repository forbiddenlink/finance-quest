'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
;
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function InteractiveDashboardCards() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const cards = [
    {
      title: "Learning Impact",
      mainStat: "42%",
      description: "Average improvement in financial literacy scores",
      icon: TrendingUp,
      color: "from-slate-900 to-blue-900",
      bgColor: "from-slate-50 to-slate-100",
      details: [
        "Pre-test average: 58%",
        "Post-test average: 82%",
        "Completion rate: 89%",
        "Retention after 30 days: 94%"
      ],
      progress: 82
    },
    {
      title: "Active Community",
      mainStat: "10,000+",
      description: "Students actively using Finance Quest",
      icon: Users,
      color: "from-slate-900 to-blue-900",
      bgColor: "from-slate-50 to-slate-100",
      details: [
        "New users this month: 1,847",
        "Daily active users: 3,200",
        "Countries represented: 47",
        "Average session: 23 minutes"
      ],
      progress: 78
    },
    {
      title: "Comprehensive Curriculum",
      mainStat: "25",
      description: "Interactive lessons across 5 chapters",
      icon: BookOpen,
      color: "from-slate-900 to-blue-900",
      bgColor: "from-slate-50 to-slate-100",
      details: [
        "5 core chapters",
        "25 interactive lessons",
        "6 professional calculators",
        "5 crisis simulations"
      ],
      progress: 100
    },
    {
      title: "Success Rate",
      mainStat: "80%",
      description: "Students who complete the full curriculum",
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-yellow-50 to-yellow-100",
      details: [
        "Chapter 1 completion: 94%",
        "Chapter 2 completion: 87%",
        "Chapter 3 completion: 83%",
        "Full curriculum: 80%"
      ],
      progress: 80
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isExpanded = expandedCard === index;

        return (
          <Card
            key={index}
            className={`
              relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer
              ${isExpanded ? 'md:col-span-2 lg:col-span-2 shadow-lg' : 'hover:shadow-lg'}
            `}
            onClick={() => setExpandedCard(isExpanded ? null : index)}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-50`} />

            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} ${theme.textColors.primary}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${theme.textColors.primary}`}>{card.mainStat}</div>
                  <Progress value={card.progress} className="w-16 h-2 mt-1" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <div className="space-y-3">
                <div>
                  <CardTitle className={`text-lg font-semibold ${theme.textColors.primary} mb-1`}>
                    {card.title}
                  </CardTitle>
                  <p className={`text-sm ${theme.textColors.secondary} leading-relaxed`}>
                    {card.description}
                  </p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className={`flex items-center text-sm font-medium ${theme.textColors.secondary}`}>
                      <Zap className={`w-4 h-4 mr-2 ${theme.status.warning.text}`} />
                      Detailed Breakdown
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {card.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className={`flex items-center p-3 ${theme.backgrounds.glass}/70 rounded-lg border ${theme.borderColors.primary}`}
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r from-slate-900 to-violet-600 rounded-full mr-3 flex-shrink-0`} />
                          <span className={`text-sm ${theme.textColors.secondary}`}>{detail}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full mt-3 ${theme.status.info.text} hover:${theme.textColors.primary} hover:${theme.backgrounds.card}`}
                    >
                      View Full Analytics
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Expand/Collapse Indicator */}
                <div className="flex justify-center pt-2">
                  {isExpanded ? (
                    <ChevronUp className={`w-5 h-5 ${theme.textColors.muted}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 ${theme.textColors.muted}`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
