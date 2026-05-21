import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type HeatZone = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  air_quality_index: number;
  risk_level: 'low' | 'moderate' | 'high' | 'extreme';
  co2_index: number;
  greenery_pct: number;
  recorded_at: string;
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'extreme';
  zone_name: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: 'vegetation' | 'infrastructure' | 'traffic' | 'water' | 'energy' | 'community';
  impact_score: number;
  zone_name: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
};

export type AnalyticsSnapshot = {
  id: string;
  snapshot_date: string;
  avg_temperature: number;
  max_temperature: number;
  min_temperature: number;
  avg_humidity: number;
  co2_index: number;
  greenery_pct: number;
  energy_usage: number;
  hotspot_count: number;
};
