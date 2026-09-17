import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BrainCircuit, Crosshair, Sparkles } from 'lucide-react';

const predictionData = [
  { month: 'Jan', actual: 400, predicted: 380 },
  { month: 'Feb', actual: 300, predicted: 320 },
  { month: 'Mar', actual: 550, predicted: 500 },
  { month: 'Apr', actual: 450, predicted: 480 },
  { month: 'May', actual: 700, predicted: 650 },
  { month: 'Jun', actual: 650, predicted: 720 },
];

const confidenceData = [
  { name: 'High Confidence (>90%)', value: 65 },
  { name: 'Medium Confidence (50-90%)', value: 25 },
  { name: 'Low Confidence (<50%)', value: 10 },
];
const COLORS = ['#ef4444', '#f97316', '#71717a'];

export default function Analytics() {
  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Analytics & Insights</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          Historical trends, machine learning models, and forecasting.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', padding: '1rem', borderRadius: '12px', color: '#8b5cf6' }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>AI Model Accuracy</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>94.2%</h3>
          </div>
        </div>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: '12px', color: '#10b981' }}>
            <Crosshair size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>False Positive Rate</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>2.1%</h3>
          </div>
        </div>
        <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '1rem', borderRadius: '12px', color: '#eab308' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#a1a1aa', fontSize: '0.9rem' }}>Predicted Events (Next 7D)</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>~45</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="thermal-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Actual vs Predicted Anomalies</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5' }} />
                <Area type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={3} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorPredicted)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="thermal-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500' }}>Model Confidence Distribution</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={confidenceData} innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#a1a1aa', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
