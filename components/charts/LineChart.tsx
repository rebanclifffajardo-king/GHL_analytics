// components/charts/LineChart.tsx
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fmtDate } from '@/lib/utils/analytics';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

interface LineDataset {
  label: string;
  data: number[];
  borderColor: string;
  bgColor: string;
}

interface LineChartProps {
  /** ISO date strings used as x-axis labels */
  dates: string[];
  /** One or more line datasets */
  datasets: LineDataset[];
  height?: number;
  isDark?: boolean;
}

/**
 * Reusable area/line chart for time-series data.
 * Automatically adapts colors to dark/light mode.
 */
export default function LineChart({
  dates,
  datasets,
  height = 270,
  isDark = false,
}: LineChartProps) {
  if (!dates.length) {
    return <div className="empty-state" style={{ height }}>📭 No data for this range</div>;
  }

  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  const chartData: ChartData<'line'> = {
    labels: dates.map(fmtDate),
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.borderColor,
      backgroundColor: ds.bgColor,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: gridColor }, ticks: { maxTicksLimit: 10, maxRotation: 0 } },
      y: { grid: { color: gridColor }, beginAtZero: true },
    },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } },
    },
  };

  return (
    <div className="chart-box" style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
