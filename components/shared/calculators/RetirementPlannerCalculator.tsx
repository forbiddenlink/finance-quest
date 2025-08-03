'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PiggyBank, Target, Calendar, DollarSign, TrendingUp, Shield } from 'lucide-react';

interface RetirementScenario {
  age: number;
  balance: number;
  monthlyContribution: number;
  employerMatch: number;
  totalContributions: number;
  totalInterest: number;
}

interface RetirementResults {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  monthlyRetirementIncome: number;
  yearlyData: RetirementScenario[];
  isOnTrack: boolean;
  shortfall: number;
  recommendedContribution: number;
}

export default function RetirementPlannerCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  // Input states
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('67');
  const [currentBalance, setCurrentBalance] = useState<string>('25000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500');
  const [employerMatch, setEmployerMatch] = useState<string>('3');
  const [currentIncome, setCurrentIncome] = useState<string>('75000');
  const [expectedReturn, setExpectedReturn] = useState<string>('7');
  const [inflationRate, setInflationRate] = useState<string>('3');
  const [desiredReplacement, setDesiredReplacement] = useState<string>('80');
  
  // Results state
  const [results, setResults] = useState<RetirementResults | null>(null);

  useEffect(() => {
    recordCalculatorUsage('retirement-planner');
  }, [recordCalculatorUsage]);

  const calculateRetirement = () => {
    const currentAgeNum = parseInt(currentAge);
    const retirementAgeNum = parseInt(retirementAge);
    const currentBalanceNum = parseFloat(currentBalance) || 0;
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0;
    const employerMatchNum = parseFloat(employerMatch) || 0;
    const currentIncomeNum = parseFloat(currentIncome) || 0;
    const expectedReturnNum = parseFloat(expectedReturn) / 100 || 0.07;
    const inflationRateNum = parseFloat(inflationRate) / 100 || 0.03;
    const desiredReplacementNum = parseFloat(desiredReplacement) / 100 || 0.8;

    if (retirementAgeNum <= currentAgeNum) {
      alert('Retirement age must be greater than current age');
      return;
    }

    const yearsToRetirement = retirementAgeNum - currentAgeNum;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = expectedReturnNum / 12;
    
    // Calculate employer match (assuming it's a percentage of contribution)
    const monthlyEmployerMatch = (monthlyContributionNum * employerMatchNum) / 100;
    const totalMonthlyContribution = monthlyContributionNum + monthlyEmployerMatch;

    // Calculate future value with compound interest
    let balance = currentBalanceNum;
    const yearlyData: RetirementScenario[] = [];
    let totalContributions = currentBalanceNum;

    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAgeNum + year;
      
      if (year > 0) {
        // Add monthly contributions for the year
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyReturn) + totalMonthlyContribution;
          totalContributions += totalMonthlyContribution;
        }
      }

      yearlyData.push({
        age,
        balance: Math.round(balance),
        monthlyContribution: monthlyContributionNum,
        employerMatch: monthlyEmployerMatch,
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(balance - totalContributions)
      });
    }

    const finalBalance = balance;
    const totalInterest = finalBalance - totalContributions;

    // Calculate retirement income using 4% rule
    const monthlyRetirementIncome = (finalBalance * 0.04) / 12;

    // Calculate desired retirement income (adjusted for inflation)
    const futureIncome = currentIncomeNum * Math.pow(1 + inflationRateNum, yearsToRetirement);
    const desiredMonthlyIncome = (futureIncome * desiredReplacementNum) / 12;

    // Check if on track
    const isOnTrack = monthlyRetirementIncome >= desiredMonthlyIncome;
    const shortfall = Math.max(0, desiredMonthlyIncome - monthlyRetirementIncome);

    // Calculate recommended contribution if not on track
    let recommendedContribution = monthlyContributionNum;
    if (!isOnTrack) {
      // Calculate needed final balance
      const neededBalance = desiredMonthlyIncome * 12 / 0.04;
      
      // Work backwards to find required monthly contribution
      // Using future value of annuity formula: FV = PMT * [((1 + r)^n - 1) / r]
      const futureValueFactor = (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;
      const currentBalanceFutureValue = currentBalanceNum * Math.pow(1 + monthlyReturn, monthsToRetirement);
      const neededFromContributions = neededBalance - currentBalanceFutureValue;
      
      recommendedContribution = neededFromContributions / futureValueFactor;
      recommendedContribution = Math.max(0, recommendedContribution - monthlyEmployerMatch);
    }

    setResults({
      finalBalance,
      totalContributions,
      totalInterest,
      monthlyRetirementIncome,
      yearlyData,
      isOnTrack,
      shortfall: shortfall * 12, // Annual shortfall
      recommendedContribution
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrackColor = (isOnTrack: boolean) => {
    return isOnTrack ? theme.status.success.text : theme.status.error.text;
  };

  const getTrackBgColor = (isOnTrack: boolean) => {
    return isOnTrack ? '${theme.status.success.bg}' : '${theme.status.error.bg}';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>Retirement Planner</h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Plan your retirement with confidence. Calculate how much you need to save, project your future balance, 
          and get personalized recommendations to reach your retirement goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${theme.textColors.primary}`}>
              <PiggyBank className={`w-5 h-5 ${theme.status.warning.text}`} />
              Retirement Planning Inputs
            </CardTitle>
            <CardDescription className={theme.textColors.secondary}>
              Enter your current situation and retirement goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  Current Age
                </label>
                <Input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Retirement Age
                </label>
                <Input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  placeholder="67"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Current Balance ($)
                </label>
                <Input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Monthly Contribution ($)
                </label>
                <Input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Employer Match (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={employerMatch}
                  onChange={(e) => setEmployerMatch(e.target.value)}
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Current Income ($)
                </label>
                <Input
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(e.target.value)}
                  placeholder="75000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Expected Return (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Inflation Rate (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                Income Replacement (%)
              </label>
              <Input
                type="number"
                step="1"
                value={desiredReplacement}
                onChange={(e) => setDesiredReplacement(e.target.value)}
                placeholder="80"
              />
              <p className="text-xs ${theme.textColors.muted} mt-1">
                Percentage of pre-retirement income needed in retirement
              </p>
            </div>

            <Button onClick={calculateRetirement} className="w-full">
              Calculate Retirement Plan
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${theme.textColors.accent}`} />
              Retirement Projection
            </CardTitle>
            <CardDescription>
              Your retirement outlook and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 ${theme.status.info.bg} rounded-lg">
                    <div className={`${theme.typography.heading2} ${theme.status.info.text}`}>
                      {formatCurrency(results.finalBalance)}
                    </div>
                    <div className="text-sm ${theme.textColors.secondary}">Retirement Balance</div>
                  </div>
                  <div className="text-center p-4 ${theme.status.success.bg} rounded-lg">
                    <div className={`${theme.typography.heading2} ${theme.status.success.text}`}>
                      {formatCurrency(results.monthlyRetirementIncome)}
                    </div>
                    <div className="text-sm ${theme.textColors.secondary}">Monthly Income</div>
                  </div>
                </div>

                {/* On Track Status */}
                <div className={`p-4 rounded-lg ${getTrackBgColor(results.isOnTrack)}`}>
                  <div className="flex items-center justify-between">
                    <div className={`${theme.typography.heading4} ${getTrackColor(results.isOnTrack)}`}>
                      {results.isOnTrack ? '✅ On Track!' : '⚠️ Needs Adjustment'}
                    </div>
                    {!results.isOnTrack && (
                      <div className="text-sm ${theme.textColors.secondary}">
                        Shortfall: {formatCurrency(results.shortfall)}/year
                      </div>
                    )}
                  </div>
                  {!results.isOnTrack && (
                    <div className="mt-2 text-sm ${theme.textColors.primary}">
                      <strong>Recommended:</strong> Increase monthly contribution to{' '}
                      <span className={`font-semibold ${theme.status.info.text}`}>
                        {formatCurrency(results.recommendedContribution)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="${theme.textColors.secondary}">Total Contributions:</span>
                    <div className="font-semibold">{formatCurrency(results.totalContributions)}</div>
                  </div>
                  <div>
                    <span className="${theme.textColors.secondary}">Interest Earned:</span>
                    <div className="font-semibold">{formatCurrency(results.totalInterest)}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Retirement Readiness</span>
                    <span>{results.isOnTrack ? '100%' : Math.round((results.monthlyRetirementIncome / (results.monthlyRetirementIncome + results.shortfall/12)) * 100)}%</span>
                  </div>
                  <Progress 
                    value={results.isOnTrack ? 100 : (results.monthlyRetirementIncome / (results.monthlyRetirementIncome + results.shortfall/12)) * 100} 
                    className="h-3"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 ${theme.textColors.muted}">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter your information to see your retirement projection</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${theme.status.success.text}`} />
                Retirement Savings Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="age" tick={{ fill: "#94a3b8" }} />
                  <YAxis tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`} tick={{ fill: "#94a3b8" }} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Age ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalContributions"
                    stackId="1"
                    stroke="#60a5fa"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Contributions"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalInterest"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Investment Growth"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Contribution Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className={`w-5 h-5 ${theme.status.info.text}`} />
                Contribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 ${theme.status.info.bg} rounded-lg">
                  <span className="${theme.textColors.primary}">Your Contribution</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(monthlyContribution))}/month</span>
                </div>
                <div className="flex justify-between items-center p-3 ${theme.status.success.bg} rounded-lg">
                  <span className="${theme.textColors.primary}">Employer Match</span>
                  <span className="font-semibold">{formatCurrency((parseFloat(monthlyContribution) * parseFloat(employerMatch)) / 100)}/month</span>
                </div>
                <div className={`flex justify-between items-center p-3 ${theme.status.info.bg} rounded-lg`}>
                  <span className="${theme.textColors.primary}">Total Monthly</span>
                  <span className={`font-semibold ${theme.textColors.accent}`}>
                    {formatCurrency(parseFloat(monthlyContribution) + (parseFloat(monthlyContribution) * parseFloat(employerMatch)) / 100)}/month
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 ${theme.status.warning.bg} rounded-lg">
                  <span className="${theme.textColors.primary}">Annual Total</span>
                  <span className={`font-semibold ${theme.status.warning.text}`}>
                    {formatCurrency((parseFloat(monthlyContribution) + (parseFloat(monthlyContribution) * parseFloat(employerMatch)) / 100) * 12)}/year
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Educational Content */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <h3 className="${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2">
            <Shield className={`w-5 h-5 ${theme.status.info.text}`} />
            Retirement Planning Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium ${theme.textColors.primary} mb-2">The Power of Time</h4>
              <p className="${theme.textColors.primary}">
                Starting early is the most powerful factor in retirement savings. Even small 
                contributions in your 20s and 30s can grow dramatically due to compound interest.
              </p>
            </div>
            <div>
              <h4 className="font-medium ${theme.textColors.primary} mb-2">Employer Match</h4>
              <p className="${theme.textColors.primary}">
                Always contribute enough to get your full employer match - it&apos;s free money! 
                A 50% match on 6% contribution gives you an immediate 50% return.
              </p>
            </div>
            <div>
              <h4 className="font-medium ${theme.textColors.primary} mb-2">4% Withdrawal Rule</h4>
              <p className="${theme.textColors.primary}">
                The 4% rule suggests you can safely withdraw 4% of your retirement balance 
                annually. This calculator uses this rule to estimate your retirement income.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
