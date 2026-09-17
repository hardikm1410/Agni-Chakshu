import { Database, Satellite, Server, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

const systems = [
  { id: 1, name: 'NASA FIRMS API', status: 'Online', latency: '124ms', icon: Database, color: '#10b981' },
  { id: 2, name: 'Aqua Satellite Telemetry', status: 'Degraded', latency: '850ms', icon: Satellite, color: '#eab308' },
  { id: 3, name: 'Terra Satellite Telemetry', status: 'Online', latency: '180ms', icon: Satellite, color: '#10b981' },
  { id: 4, name: 'AI Inference Engine', status: 'Online', latency: '42ms', icon: Server, color: '#10b981' },
  { id: 5, name: 'WebSockets Real-time', status: 'Online', latency: '12ms', icon: Zap, color: '#10b981' },
];

export default function SystemStatus() {
  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Data Sources & System Status</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          Real-time health of APIs, satellites, and processing pipelines.
        </p>
      </div>

      <div className="thermal-card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckCircle2 color="#10b981" size={32} />
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.5rem' }}>All Systems Operational</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#a1a1aa' }}>System uptime is 99.98% over the last 30 days.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {systems.map(sys => {
          const Icon = sys.icon;
          return (
            <div key={sys.id} className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ backgroundColor: `${sys.color}15`, padding: '1rem', borderRadius: '12px', color: sys.color }}>
                <Icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#e4e4e7', fontSize: '1.1rem' }}>{sys.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: sys.color, fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {sys.status === 'Degraded' ? <AlertTriangle size={14} /> : null}
                    {sys.status}
                  </span>
                  <span style={{ color: '#71717a', fontSize: '0.85rem' }}>{sys.latency}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
