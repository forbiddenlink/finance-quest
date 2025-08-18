'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface ResultMetric {
  label: string;
  value: string | number;
  color?: string;
  subLabel?: string;
}

interface ResultsCardProps {
  title: string;
  icon: LucideIcon;
  metrics: ResultMetric[];
  columns?: 2 | 3 | 4;
}

export function ResultsCard({
  title,
  icon: Icon,
  metrics,
  columns = 3
}: ResultsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`grid gap-4 md:grid-cols-${columns}`}>
          {metrics.map((metric, index) => (
            <div key={index}>
              <Label>{metric.label}</Label>
              <div className={`text-2xl font-bold ${metric.color || ''}`}>
                {metric.value}
                {metric.subLabel && (
                  <span className="text-sm font-normal ml-2">({metric.subLabel})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

