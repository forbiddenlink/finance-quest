'use client';

import React from 'react';
import BaseChart from './BaseChart';
import { ChartConfig, ChartData } from '../ChartRegistry';

interface LineChartProps {
  data: ChartData;
  config: ChartConfig;
}

const LineChart: React.FC<LineChartProps> = ({ data, config }) => {
  // Add line chart specific defaults
  const lineConfig: ChartConfig = {
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

  // Add line chart specific dataset defaults
  const lineData: ChartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: dataset.fill ?? false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }))
  };

  return <BaseChart type="line" data={lineData} config={lineConfig} />;
};

export default LineChart;
