'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { theme } from '@/lib/theme';
import {
  Calculator,
  PieChart,
  TrendingUp,
  CreditCard,
  Umbrella,
  Building,
  ArrowRight,
  Zap,
  Users,
  Clock
} from 'lucide-react';

export default function EnhancedCalculatorGrid() {
  const calculators = [
    {
      title: "Compound Interest",
      description: "See your money grow exponentially over time with the power of compound interest",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-50",
      href: "/calculators/compound-interest",
      features: ["Investment Growth", "Monthly Contributions", "Time Value of Money"],
      popularity: "Most Popular",
      usage: "2,847 uses this week",
      estimatedTime: "3 min"
    },
    {
      title: "Budget Builder",
      description: "Create a personalized budget using the proven 50/30/20 rule for financial success",
      icon: PieChart,
      color: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      href: "/calculators/budget-builder",
      features: ["50/30/20 Rule", "Income Analysis", "Spending Breakdown"],
      popularity: "Essential Tool",
      usage: "1,923 uses this week",
      estimatedTime: "5 min"
    },
    {
      title: "Debt Payoff",
      description: "Compare debt elimination strategies: avalanche vs snowball methods",
      icon: CreditCard,
      color: "from-red-500 to-pink-600",
      bgGradient: "from-red-50 to-pink-50",
      href: "/calculators/debt-payoff",
      features: ["Avalanche Method", "Snowball Method", "Interest Savings"],
      popularity: "Life Changer",
      usage: "1,654 uses this week",
      estimatedTime: "4 min"
    },
    {
      title: "Emergency Fund",
      description: "Calculate your ideal emergency fund size based on your unique situation",
      icon: Umbrella,
      color: "from-blue-500 to-slate-600",
      bgGradient: "from-blue-50 to-slate-50",
      href: "/calculators/emergency-fund",
      features: ["Risk Assessment", "Monthly Expenses", "Savings Goals"],
      popularity: "Safety First",
      usage: "1,432 uses this week",
      estimatedTime: "3 min"
    },
    {
      title: "Paycheck Analysis",
      description: "Break down your paycheck with taxes, deductions, and take-home calculations",
      icon: Calculator,
      color: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
      href: "/calculators/paycheck",
      features: ["Tax Breakdown", "Deductions", "Net Income"],
      popularity: "Career Essential",
      usage: "1,287 uses this week",
      estimatedTime: "2 min"
    },
    {
      title: "Mortgage Calculator",
      description: "Determine your home affordability and monthly payment breakdown",
      icon: Building,
      color: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50",
      href: "/calculators/mortgage",
      features: ["Monthly Payments", "Affordability", "Interest Analysis"],
      popularity: "Home Buyers",
      usage: "1,156 uses this week",
      estimatedTime: "4 min"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Calculator className="w-4 h-4 mr-2" />
          Professional Financial Tools
        </Badge>
        <h2 className={`text-4xl font-bold ${theme.textColors.primary}`}>
          Interactive Financial Calculators
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional-grade tools powered by Finance.js with real-time calculations and educational insights
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc, index) => {
          const Icon = calc.icon;

          return (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${calc.bgGradient} opacity-40 group-hover:opacity-60 transition-opacity`} />

              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${calc.color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      {calc.popularity}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <CardTitle className={`text-xl font-bold ${theme.textColors.primary} group-hover:text-blue-700 transition-colors`}>
                    {calc.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {calc.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  <h4 className={`text-sm font-semibold ${theme.textColors.secondary} flex items-center`}>
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    Key Features
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {calc.features.map((feature, fIndex) => (
                      <Badge key={fIndex} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {calc.usage}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {calc.estimatedTime}
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={calc.href}>
                  <Button
                    className={`w-full bg-gradient-to-r ${calc.color} hover:opacity-90 transition-opacity group-hover:shadow-lg`}
                  >
                    Try Calculator
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
              🎯 Educational Focus
            </h3>
            <p className="text-gray-600 mb-4">
              Each calculator includes detailed explanations, real-world examples, and personalized insights to enhance your financial learning.
            </p>
            <Link href="/calculators">
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                View All Calculators
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
