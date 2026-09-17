import { Flame, Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import ThermalBackground from '../components/common/ThermalBackground';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      <ThermalBackground />
      
      <div style={{ zIndex: 10, width: '100%', maxWidth: '480px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Branding Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame color="#ef4444" size={40} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>
            THERMOSCOPE <span style={{ color: '#ef4444' }}>AI</span>
          </h1>
          <h2 style={{ fontSize: '1rem', color: '#a1a1aa', fontWeight: '400', margin: 0 }}>
            Advanced Thermal Intelligence & Real-Time Monitoring
          </h2>
        </div>

        {/* Auth Card */}
        <div className="thermal-card" style={{ width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Create Account</h2>
            <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.95rem' }}>
              Sign up to begin monitoring global thermal anomalies.
            </p>
          </div>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={{ display: 'block', color: '#e4e4e7', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Agent Name" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', backgroundColor: 'rgba(5,5,5,0.5)', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = '#ef4444'} onBlur={e => e.target.style.borderColor = '#3f3f46'} required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#e4e4e7', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="agent@thermoscope.ai" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', backgroundColor: 'rgba(5,5,5,0.5)', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = '#ef4444'} onBlur={e => e.target.style.borderColor = '#3f3f46'} required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#e4e4e7', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 3rem', backgroundColor: 'rgba(5,5,5,0.5)', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = '#ef4444'} onBlur={e => e.target.style.borderColor = '#3f3f46'} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} style={{ marginTop: '1rem', width: '100%', padding: '1rem', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit' }} onMouseOver={e => !isLoading && (e.target.style.backgroundColor = '#dc2626')} onMouseOut={e => !isLoading && (e.target.style.backgroundColor = '#ef4444')}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '2rem', fontSize: '0.95rem' }}>
            Already have an account? {' '}
            <Link to="/login" onClick={() => setError('')} style={{ color: '#ef4444', textDecoration: 'none', fontWeight: '600', fontFamily: 'inherit' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
