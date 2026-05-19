import React, { useState } from 'react';

const ResetPasswordModal = ({ token, onResetSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMsg({ text: 'Passwords do not match', type: 'error' });
    }

    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: 'Password reset successful! You can now log in.', type: 'success' });
        setTimeout(() => {
          onResetSuccess();
        }, 3000);
      } else {
        setMsg({ text: data.message || 'Failed to reset password', type: 'error' });
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
          <img src="/logo.png" alt="Logo" style={{ height: '54px', objectFit: 'contain', margin: '0 auto 16px auto', display: 'block' }} />
          <h2>Create New Password</h2>
          <p>Please enter your new password below.</p>
        </div>

        {msg.text && (
          <div className={msg.type === 'error' ? 'login-error' : 'msg-banner success'} style={msg.type==='success'?{marginBottom:'20px', textAlign:'center'}:{}}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading} style={{marginTop: '20px'}}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <div style={{textAlign: 'center', marginTop: '16px'}}>
            <span style={{color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer'}} onClick={onResetSuccess}>
              Back to Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
