'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, ReferenceLine
} from 'recharts';
import { Zap, Clock, Sun, Wind, Droplets, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react';
import { hourlyPredictions, weeklyPredictions, monthlyTrends } from '@/lib/mock-data';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-dark border border-orange-500/20 rounded-xl p-3 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name.includes('°') ? '' : p.name === 'Humidity' ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PredictionsPage() {
  const peakHour = hourlyPredictions.reduce((prev, curr) => prev.temperature > curr.temperature ? prev : curr);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 heat-bg">
      <div className="max-w-7xl mx-auto">
        <div className="pt-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">AI Heat Predictions</h1>
              <p className="text-slate-500 text-sm">ML-powered forecasts with 94% accuracy</p>
            </div>
          </div>
        </div>

        {/* Peak alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl border border-red-500/40 bg-red-500/10 flex items-start gap-4"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-400">Peak Heat Warning</div>
            <p className="text-sm text-slate-400 mt-0.5">
              Predicted peak temperature of <span className="text-red-400 font-bold">{peakHour.temperature}°C</span> at{' '}
              <span className="text-white font-bold">{peakHour.hour}</span>. Outdoor activities strongly discouraged.
              Confidence: <span className="text-orange-400">{peakHour.confidence}%</span>
            </p>
          </div>
        </motion.div>

        {/* 24h prediction chart */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white text-sm">24-Hour Temperature Prediction</h2>
              <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                AI Active
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={hourlyPredictions}>
                <defs>
                  <linearGradient id="tempGrad24" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4500" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff4500" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 9 }} interval={2} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} domain={[20, 42]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={35} stroke="rgba(255,69,0,0.4)" strokeDasharray="4 4" label={{ value: 'Danger Threshold', fill: '#ff4500', fontSize: 10 }} />
                <Area type="monotone" dataKey="temperature" stroke="#ff4500" strokeWidth={2.5} fill="url(#tempGrad24)" name="Temperature°C" />
                <Area type="monotone" dataKey="feelsLike" stroke="#ff8c00" strokeWidth={1.5} fill="url(#feelsGrad)" name="Feels Like°C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Today's timeline */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white text-sm mb-4">Today's Heat Timeline</h2>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
              {hourlyPredictions.filter((_, i) => i % 2 === 0).map((h) => (
                <div key={h.hour} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${h.temperature >= 36 ? 'bg-red-500/10 border border-red-500/20' : h.temperature >= 32 ? 'bg-orange-500/10' : 'bg-white/2'}`}>
                  <span className="text-xs text-slate-500 w-12 flex-shrink-0">{h.hour}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${((h.temperature - 20) / 22) * 100}%`,
                        background: h.temperature >= 36 ? '#ff1a1a' : h.temperature >= 32 ? '#ff6600' : '#22c55e',
                      }}
                    />
                  </div>
                  <span className={`text-xs font-bold w-12 text-right ${h.temperature >= 36 ? 'text-red-400' : h.temperature >= 32 ? 'text-orange-400' : 'text-green-400'}`}>
                    {h.temperature}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7 day forecast */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white text-sm mb-4">7-Day Forecast</h2>
            <div className="space-y-3">
              {weeklyPredictions.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="text-sm text-slate-400 w-20 flex-shrink-0">{day.day}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${((day.high - 20) / 22) * 100}%`,
                        background: day.high >= 36 ? '#ff1a1a' : day.high >= 32 ? '#ff6600' : '#22c55e',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm flex-shrink-0">
                    <span className="text-red-400 font-semibold">{day.high}°</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-blue-400">{day.low}°</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize risk-bg-${day.risk} border risk-${day.risk} hidden sm:block`}>
                    {day.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Humidity prediction */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white text-sm mb-4">24h Humidity vs Temperature</h2>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={hourlyPredictions.filter((_, i) => i % 2 === 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 9 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="temperature" stroke="#ff4500" strokeWidth={2} dot={false} name="Temperature°C" />
                <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={false} name="Humidity%" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly trend */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white text-sm mb-4">Historical vs Predicted Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="maxTemp" fill="#ff4500" opacity={0.7} radius={[4, 4, 0, 0]} name="Max°C" />
              <Bar dataKey="avgTemp" fill="#ff8c00" opacity={0.8} radius={[4, 4, 0, 0]} name="Avg°C" />
              <Bar dataKey="heatIndex" fill="#06b6d4" opacity={0.6} radius={[4, 4, 0, 0]} name="Heat Index" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
