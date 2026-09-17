import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, MapPin, Activity } from 'lucide-react';

const sectorData = [
  { name: 'North Sector', incidents: 42 },
  { name: 'South Valley', incidents: 28 },
  { name: 'East Ridge', incidents: 65 },
  { name: 'West Plains', incidents: 18 },
  { name: 'Central Hub', incidents: 34 },
];

const recentFires = [
  { id: 1, location: 'Sector Alpha', temp: '842°C', confidence: '98%', time: '14:20', status: 'Critical' },
  { id: 2, location: 'Grid 7', temp: '624°C', confidence: '85%', time: '08:15', status: 'Active' },
  { id: 3, location: 'London Industrial', temp: '305°C', confidence: '72%', time: '10:45', status: 'Active' },
  { id: 4, location: 'Tokyo Anomaly', temp: '298°C', confidence: '65%', time: '03:10', status: 'Low Risk' },
];

export default function FireIntel() {
  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Fire Intelligence Details</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          In-depth analysis of active and historical fire signatures.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '12px', color: '#ef4444' }}>
            <Flame size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>Total Active Fires</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>187</h3>
          </div>
        </div>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', padding: '1rem', borderRadius: '12px', color: '#f97316' }}>
            <MapPin size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>High Risk Zones</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>14</h3>
          </div>
        </div>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '1rem', borderRadius: '12px', color: '#3b82f6' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>Avg Detection Confidence</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>92.4%</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="thermal-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Incidents by Sector (7 Days)</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5' }} itemStyle={{ color: '#ef4444' }} />
                <Bar dataKey="incidents" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="thermal-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Recent High-Confidence Detections</h3>
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a', color: '#a1a1aa', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem 0', fontWeight: '500' }}>Location</th>
                  <th style={{ padding: '1rem 0', fontWeight: '500' }}>Temp</th>
                  <th style={{ padding: '1rem 0', fontWeight: '500' }}>Conf.</th>
                  <th style={{ padding: '1rem 0', fontWeight: '500' }}>Time</th>
                  <th style={{ padding: '1rem 0', fontWeight: '500' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentFires.map(fire => (
                  <tr key={fire.id} style={{ borderBottom: '1px solid #27272a', color: '#f4f4f5' }}>
                    <td style={{ padding: '1rem 0' }}>{fire.location}</td>
                    <td style={{ padding: '1rem 0', color: '#ef4444' }}>{fire.temp}</td>
                    <td style={{ padding: '1rem 0' }}>{fire.confidence}</td>
                    <td style={{ padding: '1rem 0', color: '#a1a1aa' }}>{fire.time}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        backgroundColor: fire.status === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                        color: fire.status === 'Critical' ? '#fca5a5' : '#fdba74',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600'
                      }}>
                        {fire.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
