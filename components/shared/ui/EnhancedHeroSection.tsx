'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Shield,
  Brain,
  Target,
  Play,
  ChevronRight,
  Users,
  Award,
  Zap
} from 'lucide-react';

export default function EnhancedHeroSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Real OpenAI GPT-4o-mini coaching"
    },
    {
      icon: TrendingUp,
      title: "Live Market Data",
      description: "Real-time financial information"
    },
    {
      icon: Shield,
      title: "Crisis Training",
      description: "Practice emergency scenarios"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-32 w-80 h-80 ${theme.status.info.bg.replace('/20', '/40')} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-32 w-80 h-80 ${theme.status.info.bg.replace('/20', '/40')} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000`}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Problem Badge */}
            <Badge variant="destructive" className="w-fit">
              🚨 64% of Americans can&apos;t pass a basic financial literacy test
            </Badge>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Master Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>
              <p className={`text-xl ${theme.textColors.secondary} leading-relaxed`}>
                Transform from financial novice to money master through AI-powered personalized coaching,
                interactive calculators, and real-world crisis scenarios.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                    <CardContent className="p-4 text-center">
                      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className={`text-xs ${theme.textColors.muted} mt-1`}>{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/chapter1">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Target className="w-5 h-5 mr-2" />
                  Contest Demo Tour
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className={`flex items-center space-x-6 text-sm ${theme.textColors.muted}`}>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ Active Learners</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>80% Success Rate</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>42% Average Improvement</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Preview */}
          <div className="lg:pl-8">
            <Card className={`shadow-2xl border-0 ${theme.backgrounds.glass}/80 backdrop-blur-sm`}>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                      Your Learning Journey
                    </h3>
                    <p className={`${theme.textColors.secondary}`}>
                      5 comprehensive chapters with real-world application
                    </p>
                  </div>

                  {/* Progress Preview */}
                  <div className="space-y-4">
                    {[
                      { name: "Money Psychology", progress: 100, color: theme.status.success.bg.replace('/20', '') },
                      { name: "Banking Fundamentals", progress: 80, color: theme.status.info.bg.replace('/20', '') },
                      { name: "Income & Career", progress: 60, color: theme.status.warning.bg.replace('/20', '') },
                      { name: "Credit & Debt", progress: 20, color: theme.backgrounds.disabled },
                      { name: "Emergency Funds", progress: 0, color: theme.backgrounds.disabled }
                    ].map((chapter, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{chapter.name}</span>
                          <span className={`${theme.textColors.muted}`}>{chapter.progress}%</span>
                        </div>
                        <div className={`w-full ${theme.backgrounds.cardDisabled} rounded-full h-2`}>
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${chapter.color}`}
                            style={{ width: `${chapter.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-blue-900">
                      🎯 80% mastery required to unlock next chapter
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
