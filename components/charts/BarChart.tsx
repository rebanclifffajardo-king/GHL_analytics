// components/charts/BarChart.tsx
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarDataset {
  label: string;
  data: number[];
  color: string;
}

interface BarChartProps {
  /** X-axis labels */
  labels: string[];
  /** One or more bar datasets */
  datasets: BarDataset[];
  height?: number;
  isDark?: boolean;
  /** If true, stacks bars */
  stacked?: boolean;
  /** Horizontal layout */
  horizontal?: boolean;
}

/**
 * Reusable grouped/stacked bar chart.
 * Adapts colors to dark/light theme.
 */
export default function BarChart({
  labels,
  datasets,
  height = 270,
  isDark = false,
  stacked = false,
  horizontal = false,
}: BarChartProps) {
  if (!labels.length) {
    return <div className="empty-state" style={{ height }}>📭 No data for this range</div>;
  }

  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.color,
      borderRadius: 6,
      borderSkipped: false,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    scales: {
      x: { grid: { color: gridColor }, stacked },
      y: { grid: { color: gridColor }, beginAtZero: true, stacked },
    },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } },
    },
  };

  return (
    <div className="chart-box" style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
