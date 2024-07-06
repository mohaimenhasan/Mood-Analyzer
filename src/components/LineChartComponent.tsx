import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }: {data: any}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="positive" stroke="#82ca9d" />
        <Line type="monotone" dataKey="neutral" stroke="#8884d8" />
        <Line type="monotone" dataKey="negative" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
