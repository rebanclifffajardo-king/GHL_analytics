// components/charts/DoughnutChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  /** Chart labels */
  labels: string[];
  /** Dataset values */
  data: number[];
  /** Background colors for each segment */
  colors: string[];
  /** Height of the chart container (default 240) */
  height?: number;
  /** Tooltip label formatter */
  tooltipLabel?: (value: number, total: number, label: string) => string;
}

/**
 * Reusable doughnut chart.
 * Reads CSS variables for grid/text colors to support dark mode.
 */
export default function DoughnutChart({
  labels,
  data,
  colors,
  height = 240,
  tooltipLabel,
}: DoughnutChartProps) {
  // Guard against all-zero data to avoid Chart.js warnings
  const hasData = data.some((v) => v > 0);
  const total = data.reduce((a, b) => a + b, 0);

  const chartData: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        data: hasData ? data : [1],
        backgroundColor: hasData ? colors : ['rgba(148,163,184,0.2)'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 14, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (!hasData) return '  No data';
            const v = ctx.raw as number;
            const lbl = ctx.label ?? '';
            return tooltipLabel
              ? `  ${tooltipLabel(v, total, lbl)}`
              : `  ${lbl}: ${v} (${total ? ((v / total) * 100).toFixed(1) : 0}%)`;
          },
        },
      },
    },
  };

  if (!hasData) {
    return (
      <div className="empty-state" style={{ height }}>
        📭 No data for this range
      </div>
    );
  }

  return (
    <div className="chart-box" style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
