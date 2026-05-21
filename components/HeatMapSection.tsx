'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import type { HeatZone } from '@/lib/supabase';
import { RefreshCw, Layers, Filter } from 'lucide-react';

const HeatMap = dynamic(() => import('./HeatMap'), { ssr: false });

export default function HeatMapSection() {
  const [zones, setZones] = useState<HeatZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    setLoading(true);
    const { data } = await supabase.from('heat_zones').select('*');
    setZones(data ?? []);
    setLoading(false);
  }

  const filteredZones = filter === 'all' ? zones : zones.filter(z => z.risk_level === filter);

  const riskCounts = {
    extreme: zones.filter(z => z.risk_level === 'extreme').length,
    high: zones.filter(z => z.risk_level === 'high').length,
    moderate: zones.filter(z => z.risk_level === 'moderate').length,
    low: zones.filter(z => z.risk_level === 'low').length,
  };

  return (
    <section className="py-20 px-4 heat-bg" id="heatmap">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="section-divider mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live Urban <span className="gradient-text">Heat Map</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Interactive real-time city temperature map. Click any zone to view detailed environmental data.
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          {[
            { label: `All Zones (${zones.length})`, value: 'all', color: 'border-white/20 text-white' },
            { label: `Extreme (${riskCounts.extreme})`, value: 'extreme', color: 'border-red-500/40 text-red-400' },
            { label: `High (${riskCounts.high})`, value: 'high', color: 'border-orange-500/40 text-orange-400' },
            { label: `Moderate (${riskCounts.moderate})`, value: 'moderate', color: 'border-yellow-500/40 text-yellow-400' },
            { label: `Low (${riskCounts.low})`, value: 'low', color: 'border-green-500/40 text-green-400' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${f.color} ${
                filter === f.value ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}

          <button
            onClick={loadZones}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/20 text-slate-400 hover:text-white hover:bg-white/5 transition-all ml-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-orange-500/20"
          style={{ height: '520px' }}
        >
          {loading ? (
            <div className="w-full h-full skeleton flex items-center justify-center">
              <div className="text-slate-500">Loading map data...</div>
            </div>
          ) : (
            <HeatMap zones={filteredZones} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
