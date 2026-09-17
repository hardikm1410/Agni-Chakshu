import { Flame, Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import ThermalBackground from '../components/common/ThermalBackground';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
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
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.3)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame color="#3b82f6" size={40} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>
            THERMOSCOPE <span style={{ color: '#3b82f6' }}>AI</span>
          </h1>
          <h2 style={{ fontSize: '1rem', color: '#a1a1aa', fontWeight: '400', margin: 0 }}>
            Advanced Thermal Intelligence & Real-Time Monitoring
          </h2>
        </div>

        {/* Auth Card */}
        <div className="thermal-card" style={{ width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Welcome Back</h2>
            <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.95rem' }}>
              Enter your credentials to access the command center.
            </p>
          </div>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#e4e4e7', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="agent@thermoscope.ai" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid #1e293b', borderRadius: '8px', color: '#f4f4f5', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#1e293b'} required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#e4e4e7', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 3rem', backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid #1e293b', borderRadius: '8px', color: '#f4f4f5', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#1e293b'} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#3b82f6', width: '16px', height: '16px', cursor: 'pointer' }} />
                Remember me
              </label>
              <button type="button" onClick={() => setError('Password reset instructions sent to your email.')} style={{ background: 'none', border: 'none', padding: 0, color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'inherit' }}>Forgot password?</button>
            </div>

            <button type="submit" disabled={isLoading} style={{ marginTop: '1rem', width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit' }} onMouseOver={e => !isLoading && (e.target.style.backgroundColor = '#dc2626')} onMouseOut={e => !isLoading && (e.target.style.backgroundColor = '#3b82f6')}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '2rem', fontSize: '0.95rem' }}>
            Don't have an account? {' '}
            <Link to="/signup" onClick={() => setError('')} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontFamily: 'inherit' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

