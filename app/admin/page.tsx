'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Shield, Users, Bell, Map, Thermometer, Leaf, Zap, Wind, TrendingUp, Settings, Download, RefreshCw, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Activity, Database, Globe, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { energyData, zoneComparison } from '@/lib/mock-data';
import type { HeatZone, Alert, Recommendation } from '@/lib/supabase';

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

export default function AdminPage() {
  const [zones, setZones] = useState<HeatZone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function load() {
      const [z, a, r] = await Promise.all([
        supabase.from('heat_zones').select('*'),
        supabase.from('alerts').select('*'),
        supabase.from('recommendations').select('*'),
      ]);
      setZones(z.data ?? []);
      setAlerts(a.data ?? []);
      setRecs(r.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const systemStats = [
    { label: 'Total Zones', value: zones.length, icon: Map, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Active Alerts', value: alerts.filter(a => a.active).length, icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'AI Recommendations', value: recs.length, icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Hotspot Zones', value: zones.filter(z => z.risk_level === 'extreme' || z.risk_level === 'high').length, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Completed Actions', value: recs.filter(r => r.status === 'completed').length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const tabs = ['overview', 'zones', 'alerts', 'recommendations'];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="pt-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-500 text-sm">City Climate Control Center</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Sync
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm">
                <Download className="w-4 h-4" />
                Export PDF Report
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1 border border-white/5 w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {systemStats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass-card card-hover p-5"
                      >
                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                          <Icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-white">{s.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-4 text-sm">Zone Temp vs Greenery</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={zoneComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="zone" stroke="#475569" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="temp" fill="#ff4500" opacity={0.8} radius={[4, 4, 0, 0]} name="Temp°C" />
                        <Bar dataKey="greenery" fill="#22c55e" opacity={0.7} radius={[4, 4, 0, 0]} name="Greenery%" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-4 text-sm">Weekly Energy Trend</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="total" stroke="#ff4500" strokeWidth={2} dot={{ r: 4 }} name="Total kWh" />
                        <Line type="monotone" dataKey="cooling" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Cooling" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* System status */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-white mb-4 text-sm">System Status</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'AI Model', status: 'Operational', color: 'text-green-400', dotColor: 'bg-green-400' },
                      { label: 'Sensor Network', status: '10/10 Online', color: 'text-green-400', dotColor: 'bg-green-400' },
                      { label: 'Alert System', status: 'Operational', color: 'text-green-400', dotColor: 'bg-green-400' },
                      { label: 'Data Pipeline', status: 'Processing', color: 'text-orange-400', dotColor: 'bg-orange-400' },
                      { label: 'Satellite Feed', status: 'Connected', color: 'text-green-400', dotColor: 'bg-green-400' },
                      { label: 'Weather API', status: 'Operational', color: 'text-green-400', dotColor: 'bg-green-400' },
                      { label: 'Database', status: 'Healthy', color: 'text-green-400', dotColor: 'bg-green-400' },
                      { label: 'Report Gen', status: 'Ready', color: 'text-green-400', dotColor: 'bg-green-400' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                        <span className="text-xs text-slate-500">{s.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dotColor} animate-pulse`} />
                          <span className={`text-xs ${s.color}`}>{s.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'zones' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <h2 className="font-semibold text-white mb-4">All Monitored Zones</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 text-xs border-b border-white/5">
                        <th className="text-left pb-3 font-medium">Zone</th>
                        <th className="text-left pb-3 font-medium">Temp</th>
                        <th className="text-left pb-3 font-medium">Humidity</th>
                        <th className="text-left pb-3 font-medium">AQI</th>
                        <th className="text-left pb-3 font-medium">CO2</th>
                        <th className="text-left pb-3 font-medium">Greenery</th>
                        <th className="text-left pb-3 font-medium">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zones.sort((a, b) => Number(b.temperature) - Number(a.temperature)).map(z => (
                        <tr key={z.id} className="border-b border-white/5 hover:bg-white/2">
                          <td className="py-3 font-medium text-white">{z.name}</td>
                          <td className="py-3 text-orange-400 font-semibold">{z.temperature}°C</td>
                          <td className="py-3 text-blue-400">{z.humidity}%</td>
                          <td className="py-3 text-slate-300">{z.air_quality_index}</td>
                          <td className="py-3 text-slate-300">{z.co2_index} ppm</td>
                          <td className="py-3 text-green-400">{z.greenery_pct}%</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full risk-bg-${z.risk_level} border risk-${z.risk_level} capitalize`}>
                              {z.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'alerts' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className={`glass-card p-4 flex items-start gap-4 border ${alert.severity === 'extreme' ? 'border-red-500/30' : alert.severity === 'danger' ? 'border-orange-500/30' : 'border-yellow-500/20'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${alert.active ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                          {alert.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <span className={`text-xs capitalize text-slate-500`}>{alert.severity}</span>
                        {alert.zone_name && <span className="text-xs text-slate-600">{alert.zone_name}</span>}
                      </div>
                      <h3 className="font-semibold text-white text-sm">{alert.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <h2 className="font-semibold text-white mb-4">All Recommendations</h2>
                <div className="space-y-3">
                  {recs.map(rec => (
                    <div key={rec.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/2 border border-white/5 hover:border-orange-500/20 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full capitalize">{rec.category}</span>
                          <span className={`text-xs ${rec.status === 'completed' ? 'text-green-400' : rec.status === 'in_progress' ? 'text-orange-400' : 'text-slate-500'}`}>
                            {rec.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-600">Impact: {rec.impact_score}/10</span>
                        </div>
                        <h3 className="text-sm font-medium text-white">{rec.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
