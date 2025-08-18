'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartType as ChartJSType } from 'chart.js';
import { ChartConfig, ChartData } from '../ChartRegistry';
import { theme } from '@/lib/theme';

export interface BaseChartProps {
  data: ChartData;
  config: ChartConfig;
  type: ChartJSType;
}

const BaseChart: React.FC<BaseChartProps> = ({ data, config, type }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create chart configuration
    const chartConfig: ChartConfiguration = {
      type,
      data: {
        labels: data.labels || [],
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || theme.colors.blue[500],
          borderColor: dataset.borderColor || theme.colors.blue[500],
          borderWidth: dataset.borderWidth || 2
        }))
      },
      options: {
        responsive: config.responsive,
        maintainAspectRatio: config.maintainAspectRatio,
        animation: config.animation,
        plugins: config.plugins,
        scales: {
          x: {
            grid: {
              color: config.theme?.grid,
              drawBorder: false
            },
            ticks: {
              color: config.theme?.text
            }
          },
          y: {
            grid: {
              color: config.theme?.grid,
              drawBorder: false
            },
            ticks: {
              color: config.theme?.text
            }
          }
        }
      }
    };

    // Create new chart
    chartInstance.current = new Chart(ctx, chartConfig);

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, config, type]);

  return <canvas ref={chartRef} />;
};

export default BaseChart;
