'use client';

import { motion } from 'framer-motion';
import { TreePine, Building2, Car, Waves, Lightbulb, Users, CircleCheck as CheckCircle2, Clock, Circle } from 'lucide-react';
import type { Recommendation } from '@/lib/supabase';

const categoryConfig = {
  vegetation: { icon: TreePine, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  infrastructure: { icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  traffic: { icon: Car, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  water: { icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  energy: { icon: Lightbulb, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  community: { icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
};

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-green-400', label: 'Completed' },
  in_progress: { icon: Clock, color: 'text-orange-400', label: 'In Progress' },
  pending: { icon: Circle, color: 'text-slate-500', label: 'Pending' },
};

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export default function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <section className="py-20 px-4 heat-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="section-divider mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Smart <span className="gradient-text">Recommendations</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            AI-generated interventions ranked by impact score to reduce urban heat and improve city livability.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recommendations.map((rec, i) => {
            const cat = categoryConfig[rec.category];
            const status = statusConfig[rec.status];
            const Icon = cat.icon;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card card-hover p-5 border ${cat.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bg}`}>
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-600">Impact</div>
                    <div className="font-bold text-white">{rec.impact_score}/10</div>
                  </div>
                </div>

                {/* Impact bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${rec.impact_score * 10}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, #ff4500, #ff8c00)` }}
                  />
                </div>

                <h3 className="font-semibold text-white text-sm mb-2 leading-tight">{rec.title}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-3">{rec.description}</p>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1 text-xs ${cat.color} ${cat.bg} px-2 py-1 rounded-full capitalize`}>
                    {rec.category}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{status.label}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
