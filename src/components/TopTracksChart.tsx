import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Track {
  name: string;
  popularity: number;
}

interface TopTracksChartProps {
  tracks: Track[];
}

const TopTracksChart: React.FC<TopTracksChartProps> = ({ tracks }) => {
  const data = {
    labels: tracks.map(track => track.name),
    datasets: [
      {
        label: 'Top Tracks',
        data: tracks.map(track => track.popularity),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <div style={{ height: '400px' }}><Bar data={data} options={options} /></div>;
};

export default TopTracksChart;
