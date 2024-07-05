// src/components/SentimentChart.tsx

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SentimentChartProps {
    sentimentData: {
        short_term: any[];
        medium_term: any[];
        long_term: any[];
    };
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentimentData }) => {
    const parseSentimentData = (data: any[]) => {
        const sentimentCounts = data.reduce(
            (acc, { sentiment }) => {
                if (sentiment === 'positive') acc.positive += 1;
                else if (sentiment === 'negative') acc.negative += 1;
                else acc.neutral += 1;
                return acc;
            },
            { positive: 0, negative: 0, neutral: 0 }
        );
        return sentimentCounts;
    };

    const longTermSentiment = parseSentimentData(sentimentData.long_term);
    const mediumTermSentiment = parseSentimentData(sentimentData.medium_term);
    const shortTermSentiment = parseSentimentData(sentimentData.short_term);

    const chartData = {
        labels: ['1 year', ' 6 months', '4 weeks'],
        datasets: [
            {
                label: 'Positive Sentiments',
                borderColor: '#84EA5B',
                backgroundColor: '#84EA5B',
                fill: false,
                data: [longTermSentiment.positive, mediumTermSentiment.positive, shortTermSentiment.positive],
            },
            {
                label: 'Negative Sentiments',
                borderColor: '#ED4142',
                backgroundColor: '#ED4142',
                fill: false,
                data: [longTermSentiment.negative, mediumTermSentiment.negative, shortTermSentiment.negative],
            },
            {
                label: 'Neutral Sentiments',
                borderColor: '#636262',
                backgroundColor: '#636262',
                borderDash: [5, 5], // Dashed line
                fill: false,
                data: [longTermSentiment.neutral, mediumTermSentiment.neutral, shortTermSentiment.neutral],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sentiment Count'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time Range'
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} width={600} height={400} />
        </div>
    );
};

export default SentimentChart;
