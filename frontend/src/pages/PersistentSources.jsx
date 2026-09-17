import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Factory, ArrowUpRight } from 'lucide-react';

const intensityData = [
  { month: 'Jan', 'Refinery Flare 4': 300, 'Peat Fire Alpha': 150 },
  { month: 'Feb', 'Refinery Flare 4': 320, 'Peat Fire Alpha': 180 },
  { month: 'Mar', 'Refinery Flare 4': 290, 'Peat Fire Alpha': 220 },
  { month: 'Apr', 'Refinery Flare 4': 310, 'Peat Fire Alpha': 260 },
  { month: 'May', 'Refinery Flare 4': 350, 'Peat Fire Alpha': 310 },
  { month: 'Jun', 'Refinery Flare 4': 340, 'Peat Fire Alpha': 280 },
];

const sources = [
  { id: 1, name: 'Refinery Flare 4', type: 'Industrial', avgTemp: '350°C', variance: '+5%', icon: Factory, color: '#0ea5e9' },
  { id: 2, name: 'Peat Fire Alpha', type: 'Underground', avgTemp: '120°C', variance: '+15%', icon: Target, color: '#f97316' },
  { id: 3, name: 'Geothermal Vent B', type: 'Natural', avgTemp: '280°C', variance: '-2%', icon: Target, color: '#3b82f6' },
];

export default function PersistentSources() {
  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Persistent Thermal Sources</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          Monitor long-term anomalies like industrial flares and peat fires.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {sources.map(source => {
          const Icon = source.icon;
          return (
            <div key={source.id} className="thermal-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: `${source.color}15`, padding: '0.75rem', borderRadius: '12px', color: source.color }}>
                  <Icon size={24} />
                </div>
                <span style={{ backgroundColor: '#1e293b', color: '#a1a1aa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>{source.type}</span>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.3rem' }}>{source.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '700', color: source.color }}>{source.avgTemp}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: source.variance.startsWith('+') ? '#3b82f6' : '#10b981', fontSize: '0.9rem', fontWeight: '600' }}>
                    <ArrowUpRight size={16} /> {source.variance}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="thermal-card" style={{ padding: '1.5rem', height: '450px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Historical Intensity Tracking (6 Months)</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={intensityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5' }} />
              <Line type="monotone" dataKey="Refinery Flare 4" stroke="#0ea5e9" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Peat Fire Alpha" stroke="#f97316" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

