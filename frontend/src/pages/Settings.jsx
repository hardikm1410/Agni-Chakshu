import { Save, User, Key, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Settings</h2>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
          Configure your user profile, preferences, and API keys.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Profile */}
        <div className="thermal-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
            <User color="#3b82f6" size={24} />
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem' }}>Profile Information</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
              <input type="text" defaultValue="Commander Shepard" style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(2,6,23,0.5)', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" defaultValue="agent@thermoscope.ai" style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(2,6,23,0.5)', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5', outline: 'none' }} />
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="thermal-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
            <Key color="#f97316" size={24} />
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem' }}>API Configuration</h3>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>NASA FIRMS MAP_KEY</label>
            <input type="password" placeholder="Enter your NASA FIRMS map key for live data" style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(2,6,23,0.5)', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5', outline: 'none', fontFamily: 'monospace' }} />
            <p style={{ color: '#71717a', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>Required to fetch live satellite telemetry. Currently using demo dataset.</p>
          </div>

          <div>
            <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>OpenWeather API Key (Optional)</label>
            <input type="password" placeholder="Enter API key for wind/weather data" style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(2,6,23,0.5)', border: '1px solid #334155', borderRadius: '8px', color: '#f4f4f5', outline: 'none', fontFamily: 'monospace' }} />
          </div>
        </div>

        {/* Security */}
        <div className="thermal-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
            <Shield color="#3b82f6" size={24} />
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem' }}>Security</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#e4e4e7' }}>Two-Factor Authentication</h4>
              <p style={{ margin: 0, color: '#71717a', fontSize: '0.9rem' }}>Add an extra layer of security to your account.</p>
            </div>
            <button style={{ backgroundColor: 'transparent', color: '#f4f4f5', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Enable 2FA</button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            <Save size={18} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

