'use client';

import React from 'react';
import BaseChart from './BaseChart';
import { ChartConfig, ChartData } from '../ChartRegistry';

interface AreaChartProps {
  data: ChartData;
  config: ChartConfig;
}

const AreaChart: React.FC<AreaChartProps> = ({ data, config }) => {
  const areaConfig: ChartConfig = {
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

  const areaData: ChartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: dataset.fill ?? true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4
    }))
  };

  return <BaseChart type="line" data={areaData} config={areaConfig} />;
};

export default AreaChart;
