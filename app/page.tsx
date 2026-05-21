import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AlertsSection from '@/components/AlertsSection';
import RecommendationsSection from '@/components/RecommendationsSection';
import SustainabilityDashboard from '@/components/SustainabilityDashboard';
import InsightsSection from '@/components/InsightsSection';
import HeatMapSection from '@/components/HeatMapSection';
import Footer from '@/components/Footer';

async function getData() {
  const [alertsRes, recsRes, snapshotsRes] = await Promise.all([
    supabase.from('alerts').select('*').eq('active', true).order('created_at', { ascending: false }),
    supabase.from('recommendations').select('*').order('impact_score', { ascending: false }),
    supabase.from('analytics_snapshots').select('*').order('snapshot_date', { ascending: false }).limit(30),
  ]);

  return {
    alerts: alertsRes.data ?? [],
    recommendations: recsRes.data ?? [],
    snapshots: snapshotsRes.data ?? [],
  };
}

export const revalidate = 60;

export default async function HomePage() {
  const { alerts, recommendations, snapshots } = await getData();

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HeatMapSection />
      <AlertsSection alerts={alerts} />
      <RecommendationsSection recommendations={recommendations} />
      <SustainabilityDashboard snapshots={snapshots} />
      <InsightsSection />
      <Footer />
    </>
  );
}
