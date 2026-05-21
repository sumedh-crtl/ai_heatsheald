'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import type { HeatZone } from '@/lib/supabase';
import { RefreshCw, Layers, Info, Thermometer } from 'lucide-react';

const HeatMap = dynamic(() => import('@/components/HeatMap'), { ssr: false });

export default function HeatMapPage() {
  const [zones, setZones] = useState<HeatZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    setLoading(true);
    const { data } = await supabase.from('heat_zones').select('*');
    setZones(data ?? []);
    setLastUpdated(new Date());
    setLoading(false);
  }

  const filteredZones = filter === 'all' ? zones : zones.filter(z => z.risk_level === filter);

  const avgTemp = zones.length > 0 ? (zones.reduce((s, z) => s + Number(z.temperature), 0) / zones.length).toFixed(1) : '--';
  const maxTemp = zones.length > 0 ? Math.max(...zones.map(z => Number(z.temperature))).toFixed(1) : '--';
  const hotZone = zones.sort((a, b) => Number(b.temperature) - Number(a.temperature))[0];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 heat-bg">
      <div className="max-w-7xl mx-auto">
        <div className="pt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Live Urban Heat Map</h1>
              <p className="text-slate-500 text-sm mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()} &mdash; {zones.length} zones monitored
              </p>
            </div>
            <button
              onClick={loadZones}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Average Temp', value: `${avgTemp}°C`, color: 'text-orange-400' },
              { label: 'Max Temp', value: `${maxTemp}°C`, color: 'text-red-400' },
              { label: 'Hottest Zone', value: hotZone?.name ?? '--', color: 'text-white' },
              { label: 'Extreme Zones', value: `${zones.filter(z => z.risk_level === 'extreme').length}`, color: 'text-red-400' },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4">
                <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'extreme', 'high', 'moderate', 'low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                  filter === f
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                    : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                }`}
              >
                {f === 'all' ? `All (${zones.length})` : `${f} (${zones.filter(z => z.risk_level === f).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl overflow-hidden border border-orange-500/20"
          style={{ height: '600px' }}
        >
          {loading ? (
            <div className="w-full h-full skeleton flex items-center justify-center">
              <div className="text-slate-500">Loading heat map...</div>
            </div>
          ) : (
            <HeatMap zones={filteredZones} />
          )}
        </motion.div>

        {/* Zone cards */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">All Monitored Zones</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {zones
              .sort((a, b) => Number(b.temperature) - Number(a.temperature))
              .map((zone, i) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-4 border card-hover risk-bg-${zone.risk_level}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium leading-tight">{zone.name}</span>
                    <Thermometer className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  </div>
                  <div className={`text-xl font-bold risk-${zone.risk_level}`}>{zone.temperature}°C</div>
                  <div className={`text-xs capitalize mt-1 risk-${zone.risk_level} opacity-70`}>{zone.risk_level}</div>
                  <div className="mt-2 text-xs text-slate-600">
                    H: {zone.humidity}% &bull; AQI: {zone.air_quality_index}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
