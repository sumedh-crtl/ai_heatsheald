'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, TriangleAlert as AlertTriangle, Info } from 'lucide-react';
import type { HeatZone } from '@/lib/supabase';

const riskColors: Record<string, string> = {
  extreme: '#ff1a1a',
  high: '#ff6600',
  moderate: '#ffaa00',
  low: '#22c55e',
};

const riskRadii: Record<string, number> = {
  extreme: 1800,
  high: 1400,
  moderate: 1200,
  low: 1000,
};

interface HeatMapProps {
  zones: HeatZone[];
}

export default function HeatMap({ zones }: HeatMapProps) {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<HeatZone | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet components to avoid SSR issues
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([rl, L]) => {
      // Fix default marker icon
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setMapComponents({ rl, L: L.default });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="w-full h-full min-h-[500px] rounded-2xl skeleton flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading map...</div>
      </div>
    );
  }

  const { rl: { MapContainer, TileLayer, Circle, Popup, useMap }, L } = MapComponents;

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
      {/* @ts-ignore */}
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
        zoomControl={true}
      >
        {/* @ts-ignore */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {zones.map((zone) => (
          /* @ts-ignore */
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={riskRadii[zone.risk_level] || 1200}
            pathOptions={{
              color: riskColors[zone.risk_level],
              fillColor: riskColors[zone.risk_level],
              fillOpacity: 0.3,
              weight: 2,
              opacity: 0.8,
            }}
            eventHandlers={{
              click: () => setSelectedZone(zone),
            }}
          >
            {/* @ts-ignore */}
            <Popup>
              <ZonePopup zone={zone} />
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-dark rounded-xl p-3 z-[1000]">
        <div className="text-xs text-slate-400 font-medium mb-2">Heat Intensity</div>
        {Object.entries(riskColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-300 capitalize">{level}</span>
          </div>
        ))}
      </div>

      {/* Selected zone panel */}
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 glass-dark rounded-xl p-4 z-[1000] w-64"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">{selectedZone.name}</h3>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-slate-500 hover:text-white w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 risk-bg-${selectedZone.risk_level} border`}>
            <AlertTriangle className="w-3 h-3" />
            <span className={`risk-${selectedZone.risk_level} capitalize`}>{selectedZone.risk_level} Risk</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temp</span>
              <span className="text-orange-400 font-semibold">{selectedZone.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Droplets className="w-3 h-3" /> Humidity</span>
              <span className="text-blue-400 font-semibold">{selectedZone.humidity}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Wind className="w-3 h-3" /> AQI</span>
              <span className={`font-semibold ${selectedZone.air_quality_index > 70 ? 'text-red-400' : selectedZone.air_quality_index > 50 ? 'text-orange-400' : 'text-green-400'}`}>
                {selectedZone.air_quality_index}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Info className="w-3 h-3" /> CO2</span>
              <span className="text-slate-300 font-semibold">{selectedZone.co2_index} ppm</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Greenery</span>
              <span className="text-green-400 font-semibold">{selectedZone.greenery_pct}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ZonePopup({ zone }: { zone: HeatZone }) {
  return (
    <div className="text-slate-200 min-w-[160px]">
      <div className="font-bold text-base mb-2">{zone.name}</div>
      <div className={`text-xs px-2 py-0.5 rounded inline-block mb-2 capitalize risk-${zone.risk_level}`}>
        {zone.risk_level} Risk
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Temperature</span>
          <span className="text-orange-400 font-semibold">{zone.temperature}°C</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Humidity</span>
          <span className="text-blue-400">{zone.humidity}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">AQI</span>
          <span className="text-slate-300">{zone.air_quality_index}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Greenery</span>
          <span className="text-green-400">{zone.greenery_pct}%</span>
        </div>
      </div>
    </div>
  );
}
