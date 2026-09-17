export default function KPICard({ title, value, trend, icon: Icon, color }) {
  return (
    <div className="thermal-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#a1a1aa', margin: '0 0 0.5rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#f8fafc', fontWeight: '700' }}>{value}</h3>
        </div>
        <div style={{ backgroundColor: `${color}20`, padding: '0.75rem', borderRadius: '12px' }}>
          <Icon color={color} size={24} />
        </div>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: trend.startsWith('+') ? '#3b82f6' : trend.startsWith('-') ? '#10b981' : '#a1a1aa' }}>
          <span style={{ fontWeight: '600' }}>{trend}</span>
          {trend.startsWith('+') || trend.startsWith('-') ? <span style={{ color: '#71717a' }}>vs last 24h</span> : null}
        </div>
      )}
    </div>
  );
}
