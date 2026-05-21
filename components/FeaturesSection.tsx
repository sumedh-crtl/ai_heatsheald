'use client';

import { motion } from 'framer-motion';
import { Map, Zap, TreePine, Bell, ChartBar as BarChart3, Bot, Shield, Satellite } from 'lucide-react';

const features = [
  {
    icon: Map,
    title: 'Live Heat Map',
    description: 'Interactive city map with real-time temperature zones. Red, orange, and yellow heat intensity visualizations updated every 5 minutes.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: Zap,
    title: 'AI Predictions',
    description: 'Machine learning models forecast heat hotspots 24h and 7 days ahead with 94% accuracy using atmospheric data.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: TreePine,
    title: 'Smart Interventions',
    description: 'AI-generated recommendations: tree planting, cool roofs, traffic routing, shaded walkways, misting systems.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Bell,
    title: 'Citizen Alerts',
    description: 'Real-time push notifications for extreme heat warnings, unsafe conditions, air quality alerts, and cooling center locations.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive sustainability metrics: temperature trends, CO2 index, greenery percentage, energy usage with beautiful charts.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Conversational AI chatbot for heat safety tips, environmental recommendations, and city climate insights available 24/7.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Satellite,
    title: 'Satellite Imagery',
    description: 'Multi-spectral satellite overlays showing surface temperature, vegetation index, and urban heat signatures from space.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Shield,
    title: 'Admin Control',
    description: 'Comprehensive city management dashboard for officials to monitor, manage alerts, and export detailed PDF reports.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 grid-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-divider mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything Your City <span className="gradient-text">Needs</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A complete urban heat intelligence platform combining satellite data, AI predictions,
            and citizen engagement tools in one powerful dashboard.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`glass-card card-hover p-6 border ${feature.border} group`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
