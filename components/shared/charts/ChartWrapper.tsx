'use client';

import React, { Suspense } from 'react';
import { getChartComponent, defaultChartConfig, ChartType, ChartConfig, ChartData } from '@/lib/charts/ChartRegistry';
import { theme } from '@/lib/theme';

interface ChartWrapperProps {
  type: ChartType;
  data: ChartData;
  config?: Partial<ChartConfig>;
  height?: string | number;
  width?: string | number;
  className?: string;
}

const ChartSkeleton = ({ height, width }: { height?: string | number; width?: string | number }) => (
  <div
    className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg animate-pulse`}
    style={{ height: height || '300px', width: width || '100%' }}
  >
    <div className="h-full w-full flex items-center justify-center">
      <div className={`text-sm ${theme.textColors.muted}`}>Loading chart...</div>
    </div>
  </div>
);

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  data,
  config,
  height = 300,
  width = '100%',
  className = ''
}) => {
  const Chart = getChartComponent(type);

  const mergedConfig: ChartConfig = {
    ...defaultChartConfig,
    ...config,
    theme: {
      ...defaultChartConfig.theme,
      ...config?.theme
    },
    plugins: {
      ...defaultChartConfig.plugins,
      ...config?.plugins
    }
  };

  return (
    <div
      className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4 ${className}`}
      style={{ height, width }}
    >
      <Suspense fallback={<ChartSkeleton height={height} width={width} />}>
        <Chart data={data} config={mergedConfig} />
      </Suspense>
    </div>
  );
};

export default ChartWrapper;
