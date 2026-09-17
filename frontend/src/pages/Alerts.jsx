import { BellRing, Smartphone, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

const alertRules = [
  { id: 1, name: 'Critical Fire Proximity', desc: 'Alert when a critical fire is detected within 50km of Sector Alpha.', type: 'Push', active: true },
  { id: 2, name: 'FRP Spike Detection', desc: 'Trigger when Fire Radiative Power exceeds 200 MW in any region.', type: 'Email', active: true },
  { id: 3, name: 'New Thermal Anomaly', desc: 'Notify immediately when the AI detects a new unclassified heat signature.', type: 'SMS', active: false },
  { id: 4, name: 'Satellite Pass Complete', desc: 'Daily summary report after Aqua/Terra sweep.', type: 'Email', active: true },
];

const recentLogs = [
  { id: 101, time: '10 mins ago', message: 'CRITICAL: High intensity fire detected in Los Angeles Sector.', icon: ShieldAlert, color: '#ef4444' },
  { id: 102, time: '2 hours ago', message: 'System: Terra satellite sweep completed. 14 anomalies mapped.', icon: CheckCircle2, color: '#10b981' },
  { id: 103, time: '5 hours ago', message: 'WARNING: FRP Spike (210 MW) in São Paulo Border.', icon: ShieldAlert, color: '#f97316' },
];

export default function Alerts() {
  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Alerts & Notifications</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          Manage your subscription rules and critical anomaly triggers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Active Alert Rules</h3>
            <button style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>+ New Rule</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alertRules.map(rule => (
              <div key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(5, 5, 5, 0.4)', border: '1px solid #27272a', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#f8fafc', fontSize: '1.05rem' }}>{rule.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>{rule.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#71717a', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    {rule.type === 'Push' ? <BellRing size={14} /> : rule.type === 'Email' ? <Mail size={14} /> : <Smartphone size={14} />}
                    {rule.type}
                  </div>
                </div>
                <div style={{ 
                  width: '40px', height: '22px', borderRadius: '11px', 
                  backgroundColor: rule.active ? '#ef4444' : '#3f3f46', 
                  position: 'relative', cursor: 'pointer', flexShrink: 0 
                }}>
                  <div style={{ 
                    position: 'absolute', top: '2px', left: rule.active ? '20px' : '2px', 
                    width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff', 
                    transition: 'left 0.2s ease' 
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Recent Dispatch Logs</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentLogs.map(log => {
              const Icon = log.icon;
              return (
                <div key={log.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #27272a', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: `${log.color}15`, padding: '0.75rem', borderRadius: '50%', color: log.color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#f4f4f5', fontSize: '0.95rem', lineHeight: '1.4' }}>{log.message}</p>
                    <p style={{ margin: 0, color: '#71717a', fontSize: '0.8rem', fontWeight: '500' }}>{log.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
