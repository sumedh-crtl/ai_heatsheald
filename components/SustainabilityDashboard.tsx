'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { Thermometer, Leaf, Zap, Wind, TrendingUp, TrendingDown } from 'lucide-react';
import { monthlyTrends, energyData, zoneComparison } from '@/lib/mock-data';
import type { AnalyticsSnapshot } from '@/lib/supabase';

interface SustainabilityDashboardProps {
  snapshots: AnalyticsSnapshot[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-dark border border-orange-500/20 rounded-xl p-3 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SustainabilityDashboard({ snapshots }: SustainabilityDashboardProps) {
  const latest = snapshots[0];
  const yesterday = snapshots[1];

  const stats = [
    {
      label: 'Avg Temperature',
      value: `${latest?.avg_temperature?.toFixed(1) ?? 33.2}°C`,
      change: latest && yesterday ? (latest.avg_temperature - yesterday.avg_temperature).toFixed(1) : '+0.4',
      icon: Thermometer,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      up: true,
    },
    {
      label: 'Greenery Coverage',
      value: `${latest?.greenery_pct?.toFixed(1) ?? 19.2}%`,
      change: '+1.2%',
      icon: Leaf,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      up: true,
    },
    {
      label: 'Energy Usage',
      value: `${((latest?.energy_usage ?? 58420) / 1000).toFixed(1)} MWh`,
      change: '-3.2%',
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      up: false,
    },
    {
      label: 'CO2 Index',
      value: `${latest?.co2_index?.toFixed(0) ?? 468} ppm`,
      change: '+5.2 ppm',
      icon: Wind,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      up: true,
    },
  ];

  const recentData = snapshots.slice(0, 14).reverse().map((s) => ({
    date: new Date(s.snapshot_date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    avg: Number(s.avg_temperature),
    max: Number(s.max_temperature),
    min: Number(s.min_temperature),
  }));

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="section-divider mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sustainability <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real-time city climate metrics, energy usage trends, and environmental indicators.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const TrendIcon = stat.up ? TrendingUp : TrendingDown;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card card-hover p-5"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 mb-2">{stat.label}</div>
                <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-red-400' : 'text-green-400'}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>{stat.change} vs yesterday</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Temperature trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-white mb-4 text-sm">14-Day Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={recentData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4500" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff4500" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="max" stroke="#ff4500" strokeWidth={2} fill="url(#tempGrad)" name="Max°C" />
                <Area type="monotone" dataKey="avg" stroke="#ff8c00" strokeWidth={1.5} fill="none" name="Avg°C" />
                <Area type="monotone" dataKey="min" stroke="#22c55e" strokeWidth={1.5} fill="none" name="Min°C" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-white mb-4 text-sm">Monthly Heat Index</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgTemp" fill="#ff4500" opacity={0.8} radius={[4, 4, 0, 0]} name="Avg°C" />
                <Bar dataKey="heatIndex" fill="#06b6d4" opacity={0.6} radius={[4, 4, 0, 0]} name="Heat Index" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Zone comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold text-white mb-4 text-sm">Zone Temperature vs Greenery Coverage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={zoneComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="zone" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" stroke="#ff4500" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#22c55e" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff4500" strokeWidth={2} dot={{ r: 4, fill: '#ff4500' }} name="Temp (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="greenery" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} name="Greenery (%)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
}
