'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, TrendingUp, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden heat-bg grid-bg">
      {/* Animated heatwave rings */}
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/20"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 2.5], opacity: [0.6, 0] }}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{ width: '400px', height: '400px' }}
          />
        ))}
      </div>

      {/* Floating heat particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-400/40"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: '100vh',
              opacity: 0,
            }}
            animate={{
              y: '-20px',
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* City skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 300" className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,69,0,0.1)" />
              <stop offset="100%" stopColor="rgba(2,8,23,0.8)" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 L0,200 L50,200 L50,150 L80,150 L80,120 L100,120 L100,80 L120,80 L120,60 L140,60 L140,80 L160,80 L160,100 L200,100 L200,120 L220,120 L220,80 L240,80 L240,140 L260,140 L260,100 L280,100 L280,60 L300,60 L300,40 L320,40 L320,60 L340,60 L340,100 L360,100 L360,80 L380,80 L380,120 L420,120 L420,90 L440,90 L440,50 L460,50 L460,30 L480,30 L480,50 L500,50 L500,90 L520,90 L520,110 L560,110 L560,70 L580,70 L580,50 L600,50 L600,70 L620,70 L620,110 L660,110 L660,80 L680,80 L680,50 L700,50 L700,30 L720,30 L720,50 L740,50 L740,80 L760,80 L760,100 L800,100 L800,120 L840,120 L840,90 L860,90 L860,60 L880,60 L880,40 L900,40 L900,60 L920,60 L920,90 L960,90 L960,110 L1000,110 L1000,80 L1020,80 L1020,50 L1040,50 L1040,80 L1060,80 L1060,110 L1100,110 L1100,130 L1140,130 L1140,100 L1160,100 L1160,70 L1180,70 L1180,100 L1200,100 L1200,130 L1240,130 L1240,150 L1280,150 L1280,180 L1320,180 L1320,200 L1360,200 L1360,220 L1440,220 L1440,300 Z"
            fill="url(#skylineGrad)"
          />
          {/* Windows with orange glow */}
          {Array.from({ length: 40 }).map((_, i) => (
            <rect
              key={i}
              x={50 + i * 34 + Math.random() * 10}
              y={60 + Math.random() * 120}
              width="4"
              height="4"
              fill={`rgba(255, ${100 + Math.floor(Math.random() * 100)}, 0, ${0.4 + Math.random() * 0.4})`}
            />
          ))}
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/30 text-sm text-orange-400 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>AI-Powered Urban Climate Intelligence Platform</span>
          <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">v2.0</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">AI Intelligence for</span>
          <br />
          <span className="gradient-text glow-text-red">Cooler, Smarter</span>
          <br />
          <span className="text-white">Cities</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Real-time Urban Heat Island detection, AI-powered predictions, and smart interventions
          to protect citizens and build sustainable cities of the future.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/heatmap"
            className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glow-red"
          >
            <span>View Heat Map</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/predictions"
            className="btn-outline flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
          >
            <Zap className="w-5 h-5" />
            <span>Predict Hotspots</span>
          </Link>
          <button className="flex items-center gap-2 px-6 py-4 text-slate-400 hover:text-white transition-colors text-base">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-orange-500/50 transition-colors">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {[
            { value: '10+', label: 'City Zones', icon: Shield },
            { value: '94%', label: 'AI Accuracy', icon: TrendingUp },
            { value: '24/7', label: 'Live Monitoring', icon: Zap },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center border border-white/5">
              <Icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-orange-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
