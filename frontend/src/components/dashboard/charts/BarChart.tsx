import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: any[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey: string;
  title?: string;
  height?: number;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKeys,
  xAxisKey,
  title,
  height = 300,
  stacked = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xAxisKey} stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          {dataKeys.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={item.color}
              name={item.name || item.key}
              stackId={stacked ? 'stack' : undefined}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </motion.div>
  );
};
