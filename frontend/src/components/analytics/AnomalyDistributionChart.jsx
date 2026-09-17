import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { region: 'North', anomalies: 45 }, { region: 'South', anomalies: 85 },
  { region: 'East', anomalies: 30 }, { region: 'West', anomalies: 65 },
  { region: 'Central', anomalies: 110 }
];

export default function AnomalyDistributionChart() {
  return (
    <div className="thermal-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Anomalies by Region</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="region" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#f97316' }} />
            <Bar dataKey="anomalies" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

