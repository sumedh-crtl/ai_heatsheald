'use client';

import { motion } from 'framer-motion';
import { TriangleAlert as AlertTriangle, Info, ShieldAlert, Zap, Clock } from 'lucide-react';
import type { Alert } from '@/lib/supabase';

const severityConfig = {
  extreme: {
    icon: Zap,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    badge: 'bg-red-500/20 text-red-400',
    label: 'EXTREME',
  },
  danger: {
    icon: ShieldAlert,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    badge: 'bg-orange-500/20 text-orange-400',
    label: 'DANGER',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    badge: 'bg-yellow-500/20 text-yellow-400',
    label: 'WARNING',
  },
  info: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-400',
    label: 'INFO',
  },
};

interface AlertsSectionProps {
  alerts: Alert[];
}

export default function AlertsSection({ alerts }: AlertsSectionProps) {
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
            Citizen <span className="gradient-text">Alert System</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real-time heat warnings and safety alerts to protect citizens from dangerous conditions.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {alerts.map((alert, i) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 p-5 rounded-2xl border card-hover ${config.bg} ${config.border}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.badge}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                      {config.label}
                    </span>
                    {alert.zone_name && (
                      <span className="text-xs text-slate-500">{alert.zone_name}</span>
                    )}
                  </div>
                  <h3 className={`font-semibold ${config.color} mb-1`}>{alert.title}</h3>
                  <p className="text-sm text-slate-400">{alert.description}</p>
                </div>

                <div className="flex-shrink-0 text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 ml-auto mt-1 animate-pulse" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
