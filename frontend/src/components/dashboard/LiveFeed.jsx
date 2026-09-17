import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const alerts = [
  { id: 1, type: 'critical', text: 'Wildfire risk escalated in Sector Alpha', time: '2m ago', icon: ShieldAlert, color: '#3b82f6' },
  { id: 2, type: 'warning', text: 'Thermal anomaly detected near substation', time: '15m ago', icon: AlertTriangle, color: '#f97316' },
  { id: 3, type: 'info', text: 'Satellite sweep completed successfully', time: '1h ago', icon: Info, color: '#3b82f6' },
  { id: 4, type: 'warning', text: 'Unidentified heat source persistence', time: '2h ago', icon: AlertTriangle, color: '#0ea5e9' },
  { id: 5, type: 'info', text: 'Drone fleet deployed to Outpost', time: '3h ago', icon: Info, color: '#10b981' },
];

export default function LiveFeed() {
  return (
    <div className="thermal-card" style={{ padding: 0, height: '450px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(2, 6, 23, 0.4)' }}>
        <h3 style={{ margin: 0, color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Live Intelligence Feed</h3>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {alerts.map(alert => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #1e293b', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: `${alert.color}20`, padding: '0.6rem', borderRadius: '8px', color: alert.color }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 0.25rem 0', color: '#f4f4f5', fontSize: '0.95rem', lineHeight: '1.4' }}>{alert.text}</p>
                <p style={{ margin: 0, color: '#71717a', fontSize: '0.8rem', fontWeight: '500' }}>{alert.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

