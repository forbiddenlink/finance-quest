'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type ChartType = 'line' | 'bar' | 'area';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  type: ChartType;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  height?: number;
  domain?: [number, number];
}

export function ChartCard({
  title,
  icon: Icon,
  type,
  data,
  dataKey,
  xAxisKey = 'month',
  xAxisLabel,
  yAxisLabel,
  color = '#2563eb',
  height = 300,
  domain
}: ChartCardProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const commonAxisProps = {
      xAxis: (
        <XAxis
          dataKey={xAxisKey}
          label={xAxisLabel && { value: xAxisLabel, position: 'insideBottom', offset: -5 }}
        />
      ),
      yAxis: (
        <YAxis
          domain={domain}
          label={yAxisLabel && { value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
      ),
      cartesianGrid: <CartesianGrid strokeDasharray="3 3" />,
      tooltip: <Tooltip />
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            <Bar
              dataKey={dataKey}
              fill={color}
            />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      default:
        return null;
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
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

