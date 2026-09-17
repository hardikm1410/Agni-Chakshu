import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Flame, Map, Target, BarChart2, Bell, Database, Settings, Radar, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ThermalBackground from '../common/ThermalBackground';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      
      <ThermalBackground />

      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'rgba(2, 6, 23, 0.7)', 
        borderRight: '1px solid #1e293b',
        backdropFilter: 'blur(16px)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Flame color="#3b82f6" size={28} />
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#f4f4f5', fontWeight: '700', letterSpacing: '1px' }}>THERMOSCOPE</h1>
        </div>
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavLink to="/" end className="nav-link">
            <Home size={20} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/dashboard" className="nav-link dashboard">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/live-map" className="nav-link map">
            <Map size={20} />
            <span>Live Map</span>
          </NavLink>
          <div style={{ margin: '1rem 0 0.5rem 0', paddingLeft: '0.75rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525b', letterSpacing: '1px', textTransform: 'uppercase' }}>Intelligence</div>
          <NavLink to="/fire-intel" className="nav-link">
            <Radar size={20} />
            <span>Fire Intel</span>
          </NavLink>
          <NavLink to="/persistent-sources" className="nav-link">
            <Target size={20} />
            <span>Persistent Sources</span>
          </NavLink>
          <NavLink to="/analytics" className="nav-link">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
          <div style={{ margin: '1rem 0 0.5rem 0', paddingLeft: '0.75rem', fontSize: '0.75rem', fontWeight: '700', color: '#52525b', letterSpacing: '1px', textTransform: 'uppercase' }}>System</div>
          <NavLink to="/alerts" className="nav-link">
            <Bell size={20} />
            <span>Alerts</span>
          </NavLink>
          <NavLink to="/status" className="nav-link">
            <Database size={20} />
            <span>Data Sources</span>
          </NavLink>
          <NavLink to="/settings" className="nav-link">
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '0', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Top Header Row for Profile Menu */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem 2rem' }}>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '8px', color: '#f4f4f5', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'Agent'}</span>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{user?.role || 'User'}</span>
              </div>
              <ChevronDown size={16} color="#a1a1aa" style={{ marginLeft: '0.5rem' }} />
            </button>

            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, width: '220px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', zIndex: 50 }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #1e293b', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#f4f4f5', fontWeight: '500' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{user?.email}</div>
                </div>
                
                <button onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#e4e4e7', cursor: 'pointer', borderRadius: '4px', textAlign: 'left', fontFamily: 'inherit' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <User size={16} /> Profile
                </button>
                
                <button onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#e4e4e7', cursor: 'pointer', borderRadius: '4px', textAlign: 'left', fontFamily: 'inherit' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Settings size={16} /> Settings
                </button>

                <div style={{ height: '1px', backgroundColor: '#1e293b', margin: '0.5rem 0' }}></div>
                
                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', borderRadius: '4px', textAlign: 'left', fontFamily: 'inherit' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 2rem 2rem 2rem', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}


