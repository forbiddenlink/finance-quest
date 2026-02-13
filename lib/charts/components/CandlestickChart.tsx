'use client';

import React from 'react';
import BaseChart from './BaseChart';
import { ChartConfig, ChartData } from '../ChartRegistry';

interface CandlestickChartProps {
  data: ChartData;
  config: ChartConfig;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, config }) => {
  const candlestickConfig: ChartConfig = {
    ...config,
    plugins: {
      ...config.plugins,
      tooltip: {
        ...config.plugins?.tooltip,
        callbacks: {
          label: (context: any) => {
            const dataPoint = context.raw;
            if (dataPoint && typeof dataPoint === 'object' && 'o' in dataPoint) {
              return [
                `Open: ${dataPoint.o}`,
                `High: ${dataPoint.h}`,
                `Low: ${dataPoint.l}`,
                `Close: ${dataPoint.c}`
              ];
            }
            return context.formattedValue;
          }
        }
      }
    }
  };

  return <BaseChart type="candlestick" data={data} config={candlestickConfig} />;
};

export default CandlestickChart;
