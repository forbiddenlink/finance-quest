'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreditScore } from '@/lib/hooks/calculators/useCreditScore';
import { CreditCard, Target, TrendingUp, AlertTriangle, CheckCircle2, Info, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CreditScoreSimulator() {
  const [state, actions] = useCreditScore();
  const { values, errors, result, isValid } = state;
  const { updateField, reset } = actions;

  const handleInputChange = (profile: 'current' | 'target', field: string, value: string) => {
    updateField(`${profile}.${field}` as keyof typeof values, value);
  };

  const getFieldError = (profile: 'current' | 'target', field: string) => {
    return errors.find(error => error.field === `${profile}.${field}`)?.message;
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-emerald-600';
    if (score >= 740) return 'text-green-600';
    if (score >= 670) return 'text-yellow-600';
    if (score >= 580) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Credit Score Simulator
          </CardTitle>
          <CardDescription>
            Analyze and improve your credit score with personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current">Current Profile</TabsTrigger>
              <TabsTrigger value="target">Target Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="current.paymentHistory">Payment History (%)</Label>
                  <Input
                    id="current.paymentHistory"
                    type="number"
                    value={values.current.paymentHistory}
                    onChange={(e) => handleInputChange('current', 'paymentHistory', e.target.value)}
                    error={getFieldError('current', 'paymentHistory')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current.creditUtilization">Credit Utilization (%)</Label>
                  <Input
                    id="current.creditUtilization"
                    type="number"
                    value={values.current.creditUtilization}
                    onChange={(e) => handleInputChange('current', 'creditUtilization', e.target.value)}
                    error={getFieldError('current', 'creditUtilization')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current.creditAge">Credit Age (years)</Label>
                  <Input
                    id="current.creditAge"
                    type="number"
                    value={values.current.creditAge}
                    onChange={(e) => handleInputChange('current', 'creditAge', e.target.value)}
                    error={getFieldError('current', 'creditAge')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current.creditMix">Credit Mix (types)</Label>
                  <Input
                    id="current.creditMix"
                    type="number"
                    value={values.current.creditMix}
                    onChange={(e) => handleInputChange('current', 'creditMix', e.target.value)}
                    error={getFieldError('current', 'creditMix')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current.newCredit">New Credit (inquiries)</Label>
                  <Input
                    id="current.newCredit"
                    type="number"
                    value={values.current.newCredit}
                    onChange={(e) => handleInputChange('current', 'newCredit', e.target.value)}
                    error={getFieldError('current', 'newCredit')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="target" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="target.paymentHistory">Payment History (%)</Label>
                  <Input
                    id="target.paymentHistory"
                    type="number"
                    value={values.target.paymentHistory}
                    onChange={(e) => handleInputChange('target', 'paymentHistory', e.target.value)}
                    error={getFieldError('target', 'paymentHistory')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target.creditUtilization">Credit Utilization (%)</Label>
                  <Input
                    id="target.creditUtilization"
                    type="number"
                    value={values.target.creditUtilization}
                    onChange={(e) => handleInputChange('target', 'creditUtilization', e.target.value)}
                    error={getFieldError('target', 'creditUtilization')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target.creditAge">Credit Age (years)</Label>
                  <Input
                    id="target.creditAge"
                    type="number"
                    value={values.target.creditAge}
                    onChange={(e) => handleInputChange('target', 'creditAge', e.target.value)}
                    error={getFieldError('target', 'creditAge')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target.creditMix">Credit Mix (types)</Label>
                  <Input
                    id="target.creditMix"
                    type="number"
                    value={values.target.creditMix}
                    onChange={(e) => handleInputChange('target', 'creditMix', e.target.value)}
                    error={getFieldError('target', 'creditMix')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target.newCredit">New Credit (inquiries)</Label>
                  <Input
                    id="target.newCredit"
                    type="number"
                    value={values.target.newCredit}
                    onChange={(e) => handleInputChange('target', 'newCredit', e.target.value)}
                    error={getFieldError('target', 'newCredit')}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-x-2">
            <Button
              onClick={reset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Score Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Current Score</Label>
                  <div className={`text-2xl font-bold ${getScoreColor(result.currentScore)}`}>
                    {result.currentScore}
                    <span className="text-sm font-normal ml-2">({result.currentGrade})</span>
                  </div>
                </div>
                <div>
                  <Label>Target Score</Label>
                  <div className={`text-2xl font-bold ${getScoreColor(result.targetScore)}`}>
                    {result.targetScore}
                    <span className="text-sm font-normal ml-2">({result.targetGrade})</span>
                  </div>
                </div>
                <div>
                  <Label>Time to Target</Label>
                  <div className="text-2xl font-bold">
                    {result.timeToTarget}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factor Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Factor Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.factorAnalysis.map((factor, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{factor.name}</div>
                      <div className="text-sm text-gray-500">Weight: {factor.weight}%</div>
                    </div>
                    <div className={`font-medium ${getPriorityColor(factor.priority)}`}>
                      {factor.priority.charAt(0).toUpperCase() + factor.priority.slice(1)} Priority
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-gray-500">Current: {factor.current}</div>
                      <div className="text-sm text-gray-500">Target: {factor.target}</div>
                      <div className="text-sm text-gray-500">Time: {factor.timeToImprove}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Recommendations:</div>
                      <ul className="text-sm text-gray-500 list-disc list-inside">
                        {factor.recommendations.map((rec, recIndex) => (
                          <li key={recIndex}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Score Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Score Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={result.timelineProjections}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      domain={[300, 850]}
                      label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <Label>Improvement Timeline</Label>
                <div className="space-y-2">
                  {result.timelineProjections.map((projection, index) => (
                    projection.improvements.length > 0 && (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="font-medium">Month {projection.month}</div>
                        <div className="text-sm text-gray-500">
                          {projection.improvements.join(', ')}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.insights.map((insight, index) => (
                <Alert
                  key={index}
                  variant={insight.type === 'warning' ? 'destructive' : 'default'}
                >
                  {insight.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : insight.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                  <AlertDescription>{insight.message}</AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}