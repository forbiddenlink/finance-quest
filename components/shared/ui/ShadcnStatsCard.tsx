'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Info
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
  progress?: number;
  description?: string;
}

export default function ShadcnStatsCard() {
  const stats: StatItem[] = [
    {
      label: 'Learning Progress',
      value: '42%',
      icon: TrendingUp,
      color: 'blue',
      progress: 42,
      description: 'Average improvement in financial literacy scores'
    },
    {
      label: 'Active Learners',
      value: '10,000+',
      icon: Users,
      color: 'green',
      description: 'Students actively using Finance Quest'
    },
    {
      label: 'Lessons Available',
      value: '25',
      icon: BookOpen,
      color: 'purple',
      description: 'Interactive lessons across 5 chapters'
    },
    {
      label: 'Success Rate',
      value: '80%',
      icon: Award,
      color: 'orange',
      progress: 80,
      description: 'Students who complete the full curriculum'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: theme.status.info.bg.replace('/20', ''),
        text: theme.status.info.text,
        badge: theme.status.info.bg
      },
      green: {
        bg: theme.status.success.bg.replace('/20', ''),
        text: theme.status.success.text,
        badge: theme.status.success.bg
      },
      purple: {
        bg: theme.status.info.bg.replace('/20', ''),
        text: theme.status.info.text,
        badge: theme.status.info.bg
      },
      orange: {
        bg: theme.status.warning.bg.replace('/20', ''),
        text: theme.status.warning.text,
        badge: theme.status.warning.bg
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">Platform Impact</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Real results from Finance Quest&apos;s educational platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);

            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-md ${colors.bg} bg-opacity-10`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>

                      {stat.progress !== undefined && (
                        <div className="space-y-2">
                          <Progress value={stat.progress} className="h-2" />
                          <Badge variant="secondary" className={`text-xs ${colors.badge}`}>
                            {stat.progress}% Complete
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{stat.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Powered by AI-driven personalization and real-time market data
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline">OpenAI GPT-4o-mini</Badge>
            <Badge variant="outline">Next.js 15.4.4</Badge>
            <Badge variant="outline">Real Market Data</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
