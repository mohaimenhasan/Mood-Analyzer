import { BarElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Track {
  name: string;
  popularity: number;
}

interface TopTracksChartProps {
  tracks: Track[];
}

const TopTracksChart: React.FC<TopTracksChartProps> = ({ tracks }) => {
  const backgroundColors = tracks.map((track, index) => `hsl(${360 / tracks.length * index}, 100%, 70%)`);

  const data = {
    labels: tracks.map(track => track.name),
    datasets: [
      {
        label: 'Popularity',
        data: tracks.map(track => track.popularity),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Set to true if you want to display the legend
      },
      title: {
        display: true,
        text: 'Top Tracks Popularity',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category', // Explicitly setting the scale type
      },
      y: {
        type: 'linear', // Explicitly setting the scale type
        beginAtZero: true,
        title: {
          display: true,
          text: 'Popularity Score',
        },
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopTracksChart;
