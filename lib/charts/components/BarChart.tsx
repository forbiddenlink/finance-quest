'use client';

import React from 'react';
import BaseChart from './BaseChart';
import { ChartConfig, ChartData } from '../ChartRegistry';

interface BarChartProps {
  data: ChartData;
  config: ChartConfig;
}

const BarChart: React.FC<BarChartProps> = ({ data, config }) => {
  const barConfig: ChartConfig = {
    ...config,
    plugins: {
      ...config.plugins,
      tooltip: {
        ...config.plugins?.tooltip,
        mode: 'index',
        intersect: false
      }
    }
  };

  const barData: ChartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderRadius: 4,
      borderSkipped: false
    }))
  };

  return <BaseChart type="bar" data={barData} config={barConfig} />;
};

export default BarChart;
