export default function DashboardHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Command Center</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          Real-time global thermal intelligence and anomaly monitoring.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.15)', 
          color: '#ef4444', 
          border: '1px solid #ef4444', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '8px', 
          fontWeight: '600', 
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}
