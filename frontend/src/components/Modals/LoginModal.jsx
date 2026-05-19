import React, { useState } from 'react';
import logo from "../../assets/logo.png"

const LoginModal = ({ onLogin }) => {
  const [view, setView] = useState('login'); // 'login' or 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        onLogin(data);
      } else {
        setMsg({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: 'Reset link sent to your email!', type: 'success' });
        if (data.previewUrl) {
          console.log("TESTING: Password Reset Email Preview ->", data.previewUrl);
        }
      } else {
        setMsg({ text: data.message || 'Failed to send reset link', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <div className="login-header">
          <img src={logo} alt="Logo" style={{ height: '54px', objectFit: 'contain', margin: '0 auto 16px auto', display: 'block' }} />
          <h2>{view === 'login' ? 'Welcome Back' : 'Reset Password'}</h2>
          <p>
            {view === 'login' 
              ? 'Sign in to manage your TrueLlion dashboard' 
              : 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {msg.text && (
          <div className={msg.type === 'error' ? 'login-error' : 'msg-banner success'} style={msg.type==='success'?{marginBottom:'20px', textAlign:'center'}:{}}>
            {msg.text}
          </div>
        )}

        {view === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="admin@truellion.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="forgot-password">
              <span onClick={() => { setView('forgot'); setMsg({text:'', type:''}); }}>Forgot Password?</span>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="admin@truellion.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading} style={{marginTop: '20px'}}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div style={{textAlign: 'center', marginTop: '16px'}}>
              <span style={{color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer'}} onClick={() => { setView('login'); setMsg({text:'', type:''}); }}>
                <i className="fas fa-arrow-left"></i> Back to Login
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
