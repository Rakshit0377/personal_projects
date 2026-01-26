'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const Page = () => {
  const moodData = [
    { date: '2025-04-06', mood: 'negative', note: 'Felt anxious' },
    { date: '2025-04-07', mood: 'neutral', note: 'Felt okay' },
    { date: '2025-04-08', mood: 'positive', note: 'Felt happy' },
    { date: '2025-04-09', mood: 'positive', note: 'Productive day' },
    { date: '2025-04-10', mood: 'negative', note: 'Overwhelmed' },
  ];

  const moodScore = {
    negative: 1.2,
    neutral: 2,
    positive: 3,
  };

  const chartData = useMemo(
    () =>
      moodData.map((entry) => ({
        ...entry,
        score: moodScore[entry.mood],
        label: `${entry.note} on ${entry.date}`,
      })),
    []
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-2 sm:p-4 md:p-6 lg:p-10 text-gray-800 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl backdrop-blur-lg bg-white/70 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-3 sm:p-6 md:p-8 border border-white/30"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-center">
          📊 Your Weekly Mood
        </h1>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
          Hover over the graph to see your mood notes.
        </p>

        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[1, 3]}
                ticks={[1.2, 2, 3]}
                tickFormatter={(v) => {
                  if (v === 1.2) return '😟 Negative';
                  if (v === 2) return '😐 Neutral';
                  if (v === 3) return '😊 Positive';
                  return '';
                }}
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip
                formatter={(value, name, props) => props.payload.label}
                labelFormatter={() => ''}
                contentStyle={{
                  backgroundColor: '#111',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7C3AED"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#7C3AED' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-sm sm:text-base font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500" />
            <span>😟 Negative</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400" />
            <span>😐 Neutral</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500" />
            <span>😊 Positive</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;
