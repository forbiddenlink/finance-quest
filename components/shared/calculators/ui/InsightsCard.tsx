'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Info, LucideIcon } from 'lucide-react';

interface Insight {
  type: 'success' | 'warning' | 'info';
  message: string;
}

interface InsightsCardProps {
  title: string;
  icon: LucideIcon;
  insights: Insight[];
}

export function InsightsCard({
  title,
  icon: Icon,
  insights
}: InsightsCardProps) {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <Alert
            key={index}
            variant={insight.type === 'warning' ? 'destructive' : 'default'}
          >
            {getInsightIcon(insight.type)}
            <AlertDescription>{insight.message}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}

