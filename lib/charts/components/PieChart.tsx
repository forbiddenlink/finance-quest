'use client';

import React from 'react';
import BaseChart from './BaseChart';
import { ChartConfig, ChartData } from '../ChartRegistry';

interface PieChartProps {
  data: ChartData;
  config: ChartConfig;
}

const PieChart: React.FC<PieChartProps> = ({ data, config }) => {
  const pieConfig: ChartConfig = {
    ...config,
    plugins: {
      ...config.plugins,
      legend: {
        ...config.plugins?.legend,
        position: 'right' as const
      }
    }
  };

  return <BaseChart type="pie" data={data} config={pieConfig} />;
};

export default PieChart;
