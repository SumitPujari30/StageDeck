import React from 'react';
import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface AreaChartProps {
  data: any[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey: string;
  title?: string;
  height?: number;
  stacked?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
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
        <RechartsArea data={data}>
          <defs>
            {dataKeys.map((item, index) => (
              <linearGradient key={item.key} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
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
          {dataKeys.map((item, index) => (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={2}
              fill={`url(#gradient-${index})`}
              name={item.name || item.key}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsArea>
      </ResponsiveContainer>
    </motion.div>
  );
};
