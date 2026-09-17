import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPICard from '../components/dashboard/KPICard';
import MapMockup from '../components/map/MapMockup';
import LiveFeed from '../components/dashboard/LiveFeed';
import HeatTrendChart from '../components/analytics/HeatTrendChart';
import AnomalyDistributionChart from '../components/analytics/AnomalyDistributionChart';
import SourceTypeChart from '../components/analytics/SourceTypeChart';
import { Flame, AlertCircle, Crosshair, Map, Satellite, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <DashboardHeader />
      
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <KPICard title="Active Fires" value="24" trend="+3" icon={Flame} color="#3b82f6" />
        <KPICard title="Critical Alerts" value="7" trend="-2" icon={AlertCircle} color="#f97316" />
        <KPICard title="Persistent Sources" value="142" trend="+12" icon={Crosshair} color="#0ea5e9" />
        <KPICard title="Monitored Area" value="4.2M" trend="sq km" icon={Map} color="#10b981" />
        <KPICard title="Satellites Online" value="8/8" icon={Satellite} color="#3b82f6" />
        <KPICard title="AI Confidence" value="96%" trend="+1%" icon={BrainCircuit} color="#8b5cf6" />
      </div>

      {/* Main Grid: Map & Feed */}
      <div className="dashboard-main-grid">
        <MapMockup />
        <LiveFeed />
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <HeatTrendChart />
        <AnomalyDistributionChart />
        <SourceTypeChart />
      </div>
    </div>
  );
}
