import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Industrial', value: 400 },
  { name: 'Wildfire', value: 300 },
  { name: 'Electrical', value: 300 },
  { name: 'Unknown', value: 200 }
];
const COLORS = ['#0ea5e9', '#3b82f6', '#f97316', '#71717a'];

export default function SourceTypeChart() {
  return (
    <div className="thermal-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Heat Source Breakdown</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#f8fafc' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#a1a1aa', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

