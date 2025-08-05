'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { theme } from '@/lib/theme';
import { formatCurrency } from '@/lib/utils/financial';

// Dynamic import to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CandlestickData {
    x: Date;
    y: [number, number, number, number]; // [open, high, low, close]
}

interface TimeSeriesData {
    x: Date | string | number;
    y: number;
}

interface PieData {
    label: string;
    value: number;
    color?: string;
}

// Professional Candlestick Chart for Stock Market Analysis
export const CandlestickChart: React.FC<{
    data: CandlestickData[];
    title?: string;
    height?: number;
}> = ({ data, title, height = 400 }) => {
    const options: ApexOptions = {
        chart: {
            type: 'candlestick',
            background: 'transparent',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        theme: {
            mode: 'dark'
        },
        title: {
            text: title,
            style: {
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#cbd5e1'
                }
            },
            axisBorder: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            axisTicks: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                style: {
                    colors: '#cbd5e1'
                },
                formatter: (value) => formatCurrency(value)
            },
            axisBorder: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            strokeDashArray: 3
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#10b981', // emerald-500
                    downward: '#ef4444' // red-500
                },
                wick: {
                    useFillColor: true
                }
            }
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px'
            }
        }
    };

    const series = [{
        name: 'Price',
        data: data
    }];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="candlestick" height={height} />
        </div>
    );
};

// Advanced Line Chart with Multiple Series
export const MultiLineChart: React.FC<{
    series: Array<{
        name: string;
        data: TimeSeriesData[];
        color?: string;
    }>;
    title?: string;
    yAxisFormatter?: (value: number) => string;
    height?: number;
}> = ({ series, title, yAxisFormatter = formatCurrency, height = 350 }) => {
    const options: ApexOptions = {
        chart: {
            type: 'line',
            background: 'transparent',
            toolbar: {
                show: true
            },
            animations: {
                enabled: true,
                speed: 800
            }
        },
        theme: {
            mode: 'dark'
        },
        title: {
            text: title,
            style: {
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: series.map(s => s.color || theme.colors.blue[500]),
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#cbd5e1'
                }
            },
            axisBorder: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#cbd5e1'
                },
                formatter: yAxisFormatter
            },
            axisBorder: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            strokeDashArray: 3
        },
        legend: {
            labels: {
                colors: '#cbd5e1'
            }
        },
        tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            y: {
                formatter: yAxisFormatter
            }
        }
    };

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="line" height={height} />
        </div>
    );
};

// Professional Area Chart for Portfolio Growth
export const AreaChart: React.FC<{
    data: TimeSeriesData[];
    title?: string;
    color?: string;
    height?: number;
    fillGradient?: boolean;
}> = ({ data, title, color = theme.colors.blue[500], height = 300, fillGradient = true }) => {
    const options: ApexOptions = {
        chart: {
            type: 'area',
            background: 'transparent',
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: false
            }
        },
        theme: {
            mode: 'dark'
        },
        title: {
            text: title,
            style: {
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: [color],
        fill: fillGradient ? {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        } : undefined,
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#cbd5e1'
                }
            },
            axisBorder: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#cbd5e1'
                },
                formatter: formatCurrency
            }
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            strokeDashArray: 3
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: formatCurrency
            }
        }
    };

    const series = [{
        name: 'Value',
        data: data
    }];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="area" height={height} />
        </div>
    );
};

// Professional Donut Chart for Portfolio Allocation
export const DonutChart: React.FC<{
    data: PieData[];
    title?: string;
    height?: number;
    showLegend?: boolean;
}> = ({ data, title, height = 300, showLegend = true }) => {
    const options: ApexOptions = {
        chart: {
            type: 'donut',
            background: 'transparent'
        },
        theme: {
            mode: 'dark'
        },
        title: {
            text: title,
            style: {
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600
            }
        },
        labels: data.map(d => d.label),
        colors: data.map(d => d.color || theme.colors.blue[500]),
        legend: showLegend ? {
            position: 'bottom',
            labels: {
                colors: '#cbd5e1'
            }
        } : {
            show: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#ffffff',
                            formatter: (w) => {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return formatCurrency(total);
                            }
                        },
                        value: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#cbd5e1',
                            formatter: (val: string) => formatCurrency(Number(val))
                        }
                    }
                }
            }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: formatCurrency
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#ffffff']
            },
            formatter: (val: number) => `${val.toFixed(1)}%`
        }
    };

    const series = data.map(d => d.value);

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="donut" height={height} />
        </div>
    );
};

// Professional Bar Chart for Comparisons
export const BarChart: React.FC<{
    data: Array<{ category: string; value: number; color?: string }>;
    title?: string;
    horizontal?: boolean;
    height?: number;
}> = ({ data, title, horizontal = false, height = 300 }) => {
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            background: 'transparent',
            toolbar: {
                show: false
            }
        },
        theme: {
            mode: 'dark'
        },
        title: {
            text: title,
            style: {
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600
            }
        },
        plotOptions: {
            bar: {
                horizontal,
                borderRadius: 4,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        colors: data.map(d => d.color || theme.colors.blue[500]),
        xaxis: {
            categories: data.map(d => d.category),
            labels: {
                style: {
                    colors: '#cbd5e1'
                }
            },
            axisBorder: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#cbd5e1'
                },
                formatter: formatCurrency
            }
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            strokeDashArray: 3
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#ffffff']
            },
            formatter: formatCurrency
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: formatCurrency
            }
        }
    };

    const series = [{
        name: 'Value',
        data: data.map(d => d.value)
    }];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="bar" height={height} />
        </div>
    );
};

// Heatmap for Risk/Return Analysis
export const HeatmapChart: React.FC<{
    data: Array<{ x: string; y: string; value: number }>;
    title?: string;
    height?: number;
}> = ({ data, title, height = 300 }) => {
    // Transform data for ApexCharts heatmap format
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.y]) {
            acc[item.y] = [];
        }
        acc[item.y].push({ x: item.x, y: item.value });
        return acc;
    }, {} as Record<string, Array<{ x: string; y: number }>>);

    const series = Object.entries(groupedData).map(([name, data]) => ({
        name,
        data
    }));

    const options: ApexOptions = {
        chart: {
            type: 'heatmap',
            background: 'transparent'
        },
        theme: {
            mode: 'dark'
        },
        title: {
            text: title,
            style: {
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600
            }
        },
        colors: ['#10b981'], // emerald-500
        xaxis: {
            labels: {
                style: {
                    colors: '#cbd5e1'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#cbd5e1'
                }
            }
        },
        tooltip: {
            theme: 'dark'
        },
        dataLabels: {
            enabled: false
        }
    };

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="heatmap" height={height} />
        </div>
    );
};

export default {
    CandlestickChart,
    MultiLineChart,
    AreaChart,
    DonutChart,
    BarChart,
    HeatmapChart
};
