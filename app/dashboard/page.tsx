'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Thermometer, Leaf, Zap, Wind, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Map, ChartBar as BarChart3, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { energyData, weeklyPredictions } from '@/lib/mock-data';
import type { HeatZone, AnalyticsSnapshot, Alert } from '@/lib/supabase';

const COLORS = ['#ff1a1a', '#ff6600', '#ffaa00', '#22c55e'];
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

export default function DashboardPage() {
  const [zones, setZones] = useState<HeatZone[]>([]);
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [z, s, a] = await Promise.all([
        supabase.from('heat_zones').select('*'),
        supabase.from('analytics_snapshots').select('*').order('snapshot_date', { ascending: false }).limit(14),
        supabase.from('alerts').select('*').eq('active', true),
      ]);
      setZones(z.data ?? []);
      setSnapshots(s.data ?? []);
      setAlerts(a.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const riskDistribution = [
    { name: 'Extreme', value: zones.filter(z => z.risk_level === 'extreme').length },
    { name: 'High', value: zones.filter(z => z.risk_level === 'high').length },
    { name: 'Moderate', value: zones.filter(z => z.risk_level === 'moderate').length },
    { name: 'Low', value: zones.filter(z => z.risk_level === 'low').length },
  ];

  const latest = snapshots[0];
  const tempTrend = snapshots.slice(0, 10).reverse().map(s => ({
    date: new Date(s.snapshot_date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    avg: Number(s.avg_temperature),
    max: Number(s.max_temperature),
  }));

  const stats = [
    { label: 'Avg Temperature', value: `${latest?.avg_temperature?.toFixed(1) ?? '--'}°C`, icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Active Hotspots', value: `${latest?.hotspot_count ?? zones.filter(z => z.risk_level !== 'low').length}`, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Greenery %', value: `${latest?.greenery_pct?.toFixed(1) ?? '--'}%`, icon: Leaf, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'CO2 Index', value: `${latest?.co2_index?.toFixed(0) ?? '--'} ppm`, icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Energy Usage', value: `${((latest?.energy_usage ?? 0) / 1000).toFixed(1)} MWh`, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Active Alerts', value: `${alerts.length}`, icon: AlertTriangle, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">City Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time urban climate overview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 skeleton rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass-card card-hover p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Temperature trend */}
              <div className="lg:col-span-2 glass-card p-6">
                <h3 className="font-semibold text-white mb-4 text-sm">Temperature Trend (10 Days)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={tempTrend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff4500" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ff4500" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="max" stroke="#ff4500" strokeWidth={2} fill="url(#g1)" name="Max°C" />
                    <Area type="monotone" dataKey="avg" stroke="#ff8c00" strokeWidth={1.5} fill="none" name="Avg°C" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Risk distribution pie */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4 text-sm">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {riskDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Energy + weekly prediction */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4 text-sm">Weekly Energy Usage (kWh)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cooling" fill="#ff4500" opacity={0.8} radius={[4, 4, 0, 0]} name="Cooling" />
                    <Bar dataKey="heating" fill="#3b82f6" opacity={0.6} radius={[4, 4, 0, 0]} name="Heating" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4 text-sm">7-Day Heat Forecast</h3>
                <div className="space-y-2">
                  {weeklyPredictions.map((day) => (
                    <div key={day.day} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-slate-400 w-20">{day.day}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full risk-bg-${day.risk} border risk-${day.risk} capitalize`}>
                        {day.condition}
                      </span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-400">{day.high}°</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-blue-400">{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hottest zones table */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4 text-sm">Hottest Zones — Live Ranking</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs border-b border-white/5">
                      <th className="text-left pb-3 font-medium">Rank</th>
                      <th className="text-left pb-3 font-medium">Zone</th>
                      <th className="text-left pb-3 font-medium">Temperature</th>
                      <th className="text-left pb-3 font-medium">Humidity</th>
                      <th className="text-left pb-3 font-medium">AQI</th>
                      <th className="text-left pb-3 font-medium">Risk</th>
                      <th className="text-left pb-3 font-medium">Greenery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones
                      .sort((a, b) => b.temperature - a.temperature)
                      .slice(0, 8)
                      .map((zone, i) => (
                        <tr key={zone.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="py-3 text-slate-600">#{i + 1}</td>
                          <td className="py-3 font-medium text-white">{zone.name}</td>
                          <td className="py-3 text-orange-400 font-semibold">{zone.temperature}°C</td>
                          <td className="py-3 text-blue-400">{zone.humidity}%</td>
                          <td className="py-3">
                            <span className={zone.air_quality_index > 70 ? 'text-red-400' : zone.air_quality_index > 50 ? 'text-orange-400' : 'text-green-400'}>
                              {zone.air_quality_index}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full risk-bg-${zone.risk_level} border risk-${zone.risk_level} capitalize`}>
                              {zone.risk_level}
                            </span>
                          </td>
                          <td className="py-3 text-green-400">{zone.greenery_pct}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
