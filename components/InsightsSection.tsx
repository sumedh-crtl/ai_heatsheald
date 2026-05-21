'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { insightCards } from '@/lib/mock-data';

export default function InsightsSection() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-500/30 text-sm text-yellow-400 mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Generated Insights
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Intelligence at a <span className="gradient-text">Glance</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Our AI continuously analyzes city data to surface actionable insights and measure intervention impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {insightCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card card-hover p-6"
            >
              <div className="text-3xl font-bold gradient-text mb-1">{card.value}</div>
              <div className="font-semibold text-white text-sm mb-1">{card.title}</div>
              <div className={`flex items-center gap-1 text-xs mb-3 ${card.trend === 'up' ? 'text-orange-400' : 'text-green-400'}`}>
                {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Yearly rise graph bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Yearly Temperature Rise — Urban Core</h3>
              <p className="text-xs text-slate-500 mt-1">5-year trend showing accelerating urban heat island effect</p>
            </div>
            <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              +2.3°C over 5 years
            </span>
          </div>

          <div className="flex items-end gap-2 h-40">
            {[
              { year: '2020', temp: 31.2, pct: 65 },
              { year: '2021', temp: 32.0, pct: 72 },
              { year: '2022', temp: 32.8, pct: 78 },
              { year: '2023', temp: 33.5, pct: 84 },
              { year: '2024', temp: 34.1, pct: 90 },
              { year: '2025', temp: 34.8, pct: 96 },
              { year: '2026*', temp: 35.5, pct: 100, isCurrent: true },
            ].map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-white font-semibold">{item.temp}°</div>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${item.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-full rounded-t-lg"
                  style={{
                    background: item.isCurrent
                      ? 'linear-gradient(180deg, #ff1a1a, #ff4500)'
                      : `linear-gradient(180deg, rgba(255,69,0,${0.4 + item.pct * 0.005}), rgba(255,140,0,0.3))`,
                    boxShadow: item.isCurrent ? '0 0 20px rgba(255,26,26,0.4)' : 'none',
                  }}
                />
                <div className="text-xs text-slate-600">{item.year}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-2">* Projected value based on current trajectory</p>
        </motion.div>
      </div>
    </section>
  );
}
