'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TriangleAlert as AlertTriangle, ShieldAlert, Info, Zap, Clock, Filter, CircleCheck as CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Alert } from '@/lib/supabase';

const severityConfig = {
  extreme: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', label: 'EXTREME', dot: 'bg-red-400' },
  danger: { icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40', label: 'DANGER', dot: 'bg-orange-400' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', label: 'WARNING', dot: 'bg-yellow-400' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/40', label: 'INFO', dot: 'bg-blue-400' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('alerts').select('*').eq('active', true).order('created_at', { ascending: false });
      setAlerts(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = alerts.filter(a =>
    !dismissed.has(a.id) && (filter === 'all' || a.severity === filter)
  );

  const counts = {
    all: alerts.filter(a => !dismissed.has(a.id)).length,
    extreme: alerts.filter(a => a.severity === 'extreme' && !dismissed.has(a.id)).length,
    danger: alerts.filter(a => a.severity === 'danger' && !dismissed.has(a.id)).length,
    warning: alerts.filter(a => a.severity === 'warning' && !dismissed.has(a.id)).length,
    info: alerts.filter(a => a.severity === 'info' && !dismissed.has(a.id)).length,
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 heat-bg">
      <div className="max-w-4xl mx-auto">
        <div className="pt-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-orange-400" />
              {counts.all > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {counts.all}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Citizen Alerts</h1>
              <p className="text-slate-500 text-sm">{counts.all} active alerts across the city</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(counts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                  filter === key
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                    : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                }`}
              >
                {key !== 'all' && (
                  <span className={`w-2 h-2 rounded-full ${severityConfig[key as keyof typeof severityConfig]?.dot}`} />
                )}
                {key === 'all' ? 'All' : key}
                <span className="text-xs opacity-70">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">All Clear</h3>
                <p className="text-slate-500">No active alerts for this category.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filtered.map((alert, i) => {
                  const config = severityConfig[alert.severity];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={alert.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-5 rounded-2xl border flex items-start gap-4 ${config.bg} ${config.border}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                            {config.label}
                          </span>
                          {alert.zone_name && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {alert.zone_name}
                            </span>
                          )}
                        </div>
                        <h3 className={`font-semibold ${config.color} mb-1`}>{alert.title}</h3>
                        <p className="text-sm text-slate-400">{alert.description}</p>
                        {(alert.starts_at || alert.ends_at) && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                            <Clock className="w-3 h-3" />
                            {alert.starts_at && (
                              <span>From: {new Date(alert.starts_at).toLocaleTimeString()}</span>
                            )}
                            {alert.ends_at && (
                              <span>Until: {new Date(alert.ends_at).toLocaleTimeString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setDismissed(prev => { const next = new Set(prev); next.add(alert.id); return next; })}
                        className="flex-shrink-0 text-slate-600 hover:text-slate-400 transition-colors text-lg leading-none"
                        title="Dismiss"
                      >
                        ×
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        )}

        {/* Safety tips */}
        <div className="mt-10 glass-card p-6">
          <h2 className="font-semibold text-white mb-4">General Heat Safety Guidelines</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Stay indoors during peak heat hours (12 PM – 4 PM)',
              'Drink at least 3 liters of water per day',
              'Wear light-colored, loose-fitting clothing',
              'Check on elderly neighbors and vulnerable individuals',
              'Use cooling centers — available at city halls and libraries',
              'Never leave children or pets in parked vehicles',
              'Apply sunscreen SPF 50+ when outdoors is unavoidable',
              'Avoid strenuous physical activity in direct sunlight',
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3 text-sm text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
