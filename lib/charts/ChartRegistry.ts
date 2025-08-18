import { lazy } from 'react';
import { theme } from '@/lib/theme';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'candlestick';

export interface ChartConfig {
  theme?: {
    background?: string;
    text?: string;
    grid?: string;
    tooltip?: {
      background?: string;
      border?: string;
    };
  };
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  animation?: boolean;
  plugins?: Record<string, any>;
}

export interface ChartData {
  labels?: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }>;
}

const chartComponents = {
  line: lazy(() => import('./components/LineChart')),
  bar: lazy(() => import('./components/BarChart')),
  pie: lazy(() => import('./components/PieChart')),
  area: lazy(() => import('./components/AreaChart')),
  candlestick: lazy(() => import('./components/CandlestickChart'))
};

export const defaultChartConfig: ChartConfig = {
  theme: {
    background: theme.backgrounds.glass,
    text: theme.textColors.primary,
    grid: theme.borderColors.primary,
    tooltip: {
      background: theme.backgrounds.cardHover,
      border: theme.borderColors.primary
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  animation: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: theme.textColors.primary,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      padding: 12,
      backgroundColor: theme.backgrounds.cardHover,
      borderColor: theme.borderColors.primary,
      borderWidth: 1,
      titleColor: theme.textColors.primary,
      bodyColor: theme.textColors.secondary,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 12
      }
    }
  }
};

export const getChartComponent = (type: ChartType) => chartComponents[type];
