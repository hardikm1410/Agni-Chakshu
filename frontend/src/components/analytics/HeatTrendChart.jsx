import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', heat: 30 }, { time: '04:00', heat: 45 }, 
  { time: '08:00', heat: 85 }, { time: '12:00', heat: 120 },
  { time: '16:00', heat: 110 }, { time: '20:00', heat: 75 }
];

export default function HeatTrendChart() {
  return (
    <div className="thermal-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Heat Intensity Trend (24h)</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHeatTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="time" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#ef4444' }} />
            <Area type="monotone" dataKey="heat" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHeatTrend)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
