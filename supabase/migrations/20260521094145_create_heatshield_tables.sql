/*
  # HeatShield AI Database Schema

  1. New Tables
    - `heat_zones` - City zones with temperature and environmental data
    - `heat_predictions` - AI-generated heat predictions
    - `alerts` - Citizen alert notifications
    - `recommendations` - AI smart city recommendations
    - `analytics_snapshots` - Daily snapshots for trend analysis
    - `chat_messages` - Chatbot conversation history

  2. Security
    - Enable RLS on all tables
    - Public read for most tables, controlled insert for chat
*/

CREATE TABLE IF NOT EXISTS heat_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  temperature numeric(5,2) NOT NULL DEFAULT 25.0,
  humidity numeric(5,2) NOT NULL DEFAULT 50.0,
  air_quality_index integer NOT NULL DEFAULT 50,
  risk_level text NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'moderate', 'high', 'extreme')),
  co2_index numeric(6,2) NOT NULL DEFAULT 400.0,
  greenery_pct numeric(5,2) NOT NULL DEFAULT 20.0,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS heat_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES heat_zones(id) ON DELETE CASCADE,
  zone_name text NOT NULL,
  predicted_temp numeric(5,2) NOT NULL,
  prediction_hour integer NOT NULL,
  prediction_date date NOT NULL,
  confidence numeric(4,2) NOT NULL DEFAULT 0.85,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'danger', 'extreme')),
  zone_name text,
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('vegetation', 'infrastructure', 'traffic', 'water', 'energy', 'community')),
  impact_score integer NOT NULL DEFAULT 5 CHECK (impact_score BETWEEN 1 AND 10),
  zone_name text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL,
  avg_temperature numeric(5,2) NOT NULL,
  max_temperature numeric(5,2) NOT NULL,
  min_temperature numeric(5,2) NOT NULL,
  avg_humidity numeric(5,2) NOT NULL,
  co2_index numeric(6,2) NOT NULL,
  greenery_pct numeric(5,2) NOT NULL,
  energy_usage numeric(10,2) NOT NULL,
  hotspot_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE heat_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE heat_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read heat zones" ON heat_zones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read heat predictions" ON heat_predictions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read alerts" ON alerts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read recommendations" ON recommendations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read analytics snapshots" ON analytics_snapshots FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert chat messages" ON chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read chat messages" ON chat_messages FOR SELECT TO anon, authenticated USING (true);

INSERT INTO heat_zones (name, lat, lng, temperature, humidity, air_quality_index, risk_level, co2_index, greenery_pct) VALUES
  ('Downtown Core', 40.7128, -74.0060, 38.5, 45, 78, 'extreme', 520.0, 8.5),
  ('Financial District', 40.7074, -74.0113, 36.2, 48, 72, 'high', 495.0, 10.2),
  ('Midtown', 40.7549, -73.9840, 35.8, 50, 68, 'high', 480.0, 12.0),
  ('Upper East Side', 40.7736, -73.9566, 32.1, 55, 55, 'moderate', 420.0, 22.5),
  ('Central Park', 40.7851, -73.9683, 28.3, 65, 35, 'low', 360.0, 72.0),
  ('Brooklyn Heights', 40.6958, -73.9936, 33.4, 52, 60, 'moderate', 440.0, 18.0),
  ('Queens Center', 40.7282, -73.7949, 34.7, 49, 65, 'high', 465.0, 15.0),
  ('Harlem', 40.8116, -73.9465, 31.5, 58, 52, 'moderate', 410.0, 25.0),
  ('South Bronx', 40.8168, -73.9203, 36.9, 46, 75, 'high', 500.0, 9.0),
  ('Staten Island', 40.5795, -74.1502, 29.8, 62, 40, 'low', 380.0, 45.0)
ON CONFLICT DO NOTHING;

INSERT INTO alerts (title, description, severity, zone_name, active, starts_at, ends_at) VALUES
  ('Extreme Heat Warning', 'Temperature expected to reach 41°C in Downtown Core. Avoid outdoor activities.', 'extreme', 'Downtown Core', true, now(), now() + interval '8 hours'),
  ('Heat Advisory', 'Unsafe outdoor conditions expected from 1 PM – 4 PM in Financial District.', 'danger', 'Financial District', true, now() + interval '2 hours', now() + interval '7 hours'),
  ('Air Quality Alert', 'AQI levels elevated in Midtown. Sensitive groups should limit outdoor exposure.', 'warning', 'Midtown', true, now(), now() + interval '12 hours'),
  ('Stay Hydrated', 'High temperatures across the city. Ensure adequate hydration and use cooling centers.', 'info', null, true, now(), now() + interval '24 hours'),
  ('Overnight Heat Stress', 'Temperatures will remain above 30°C overnight in the South Bronx area.', 'warning', 'South Bronx', true, now() + interval '8 hours', now() + interval '16 hours')
ON CONFLICT DO NOTHING;

INSERT INTO recommendations (title, description, category, impact_score, zone_name, status) VALUES
  ('Urban Tree Planting Initiative', 'Plant 500 native trees along major corridors to reduce surface temperatures by up to 8°C.', 'vegetation', 9, 'Downtown Core', 'in_progress'),
  ('Cool Roof Program', 'Apply reflective coatings to 200+ commercial buildings to reduce heat absorption by 30%.', 'infrastructure', 8, 'Financial District', 'pending'),
  ('Traffic Rerouting AI', 'Implement dynamic traffic routing to reduce vehicle density and emission hotspots by 25%.', 'traffic', 7, 'Midtown', 'pending'),
  ('Misting Stations Network', 'Install 50 automated water spray stations in high-traffic pedestrian zones.', 'water', 8, 'Downtown Core', 'in_progress'),
  ('Shaded Walkway Construction', 'Build 3km of covered walkways with solar panels providing shade and generating energy.', 'infrastructure', 7, 'Midtown', 'pending'),
  ('Green Rooftop Gardens', 'Convert 100 rooftops into gardens reducing urban heat island effect by 4-6°C.', 'vegetation', 9, 'Brooklyn Heights', 'pending'),
  ('Smart Street Lighting', 'Replace halogen with LED smart lights reducing heat generation by 40%.', 'energy', 6, null, 'completed'),
  ('Community Cooling Centers', 'Open 15 air-conditioned community centers during heat emergencies.', 'community', 8, null, 'in_progress')
ON CONFLICT DO NOTHING;

INSERT INTO analytics_snapshots (snapshot_date, avg_temperature, max_temperature, min_temperature, avg_humidity, co2_index, greenery_pct, energy_usage, hotspot_count) VALUES
  (CURRENT_DATE, 33.2, 38.5, 27.1, 52.3, 468.5, 19.2, 58420.0, 6),
  (CURRENT_DATE - 1, 32.8, 37.9, 26.5, 54.1, 462.0, 19.5, 56800.0, 5),
  (CURRENT_DATE - 2, 34.1, 39.2, 28.0, 50.8, 475.0, 18.9, 60100.0, 7),
  (CURRENT_DATE - 3, 31.5, 36.0, 25.8, 57.2, 445.0, 20.1, 53200.0, 4),
  (CURRENT_DATE - 4, 30.2, 34.5, 24.9, 59.5, 430.0, 20.8, 50100.0, 3),
  (CURRENT_DATE - 5, 29.8, 33.8, 24.2, 61.0, 420.0, 21.2, 48500.0, 3),
  (CURRENT_DATE - 6, 31.1, 35.5, 25.5, 56.8, 440.0, 20.5, 52000.0, 4),
  (CURRENT_DATE - 7, 32.4, 37.0, 26.8, 53.9, 458.0, 19.8, 55600.0, 5),
  (CURRENT_DATE - 8, 35.2, 40.1, 29.2, 48.5, 490.0, 18.5, 62000.0, 8),
  (CURRENT_DATE - 9, 36.0, 41.0, 30.0, 46.2, 510.0, 17.9, 65000.0, 9),
  (CURRENT_DATE - 10, 34.8, 39.5, 28.8, 49.0, 480.0, 18.7, 61500.0, 7),
  (CURRENT_DATE - 11, 33.5, 38.0, 27.5, 51.5, 465.0, 19.3, 57800.0, 6),
  (CURRENT_DATE - 12, 32.0, 36.5, 26.0, 55.0, 450.0, 20.0, 54000.0, 4),
  (CURRENT_DATE - 13, 30.8, 35.0, 25.2, 58.0, 435.0, 20.6, 51200.0, 3),
  (CURRENT_DATE - 14, 29.5, 33.5, 24.0, 62.0, 415.0, 21.5, 47800.0, 2),
  (CURRENT_DATE - 15, 28.8, 32.5, 23.5, 64.0, 405.0, 22.0, 46000.0, 2),
  (CURRENT_DATE - 16, 30.2, 34.8, 24.8, 60.5, 428.0, 21.0, 49800.0, 3),
  (CURRENT_DATE - 17, 31.8, 36.2, 26.2, 56.2, 448.0, 20.2, 53500.0, 4),
  (CURRENT_DATE - 18, 33.0, 37.5, 27.0, 53.5, 462.0, 19.6, 56200.0, 5),
  (CURRENT_DATE - 19, 34.5, 39.0, 28.5, 50.2, 478.0, 18.8, 60500.0, 7),
  (CURRENT_DATE - 20, 35.8, 40.5, 29.8, 47.8, 498.0, 18.1, 63800.0, 8),
  (CURRENT_DATE - 21, 36.5, 41.5, 30.5, 46.0, 512.0, 17.6, 66200.0, 9),
  (CURRENT_DATE - 22, 35.0, 39.8, 29.0, 48.8, 485.0, 18.4, 61200.0, 7),
  (CURRENT_DATE - 23, 33.8, 38.2, 27.8, 51.0, 468.0, 19.1, 57500.0, 6),
  (CURRENT_DATE - 24, 32.5, 37.0, 26.8, 54.0, 452.0, 19.9, 54800.0, 5),
  (CURRENT_DATE - 25, 31.2, 35.5, 25.5, 57.0, 438.0, 20.5, 52200.0, 4),
  (CURRENT_DATE - 26, 29.9, 34.0, 24.5, 60.0, 422.0, 21.2, 49000.0, 3),
  (CURRENT_DATE - 27, 28.5, 32.8, 23.2, 63.5, 408.0, 21.8, 46500.0, 2),
  (CURRENT_DATE - 28, 27.8, 31.5, 22.5, 66.0, 398.0, 22.5, 44800.0, 2),
  (CURRENT_DATE - 29, 29.2, 33.2, 24.0, 61.5, 418.0, 21.0, 48200.0, 3)
ON CONFLICT DO NOTHING;
