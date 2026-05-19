import React, { useState, useEffect, useRef } from 'react';
import ImageCropper from './ImageCropper';

const Profile = ({ authData, updateAuthData }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Account Info State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Cropper State
  const [cropperModal, setCropperModal] = useState({
    isOpen: false,
    imageSrc: null,
    aspect: 1,
    type: null
  });

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const handleFileSelect = (e, type, aspect) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCropperModal({ isOpen: true, imageSrc: imageUrl, aspect, type });
      e.target.value = ''; // Reset input
    }
  };

  const handleCropComplete = (croppedBlob) => {
    if (cropperModal.type === 'avatar') {
      setAvatarFile(croppedBlob);
    } else {
      setCoverFile(croppedBlob);
    }
    setCropperModal({ isOpen: false, imageSrc: null, aspect: 1, type: null });
  };

  useEffect(() => {
    if (authData) {
      fetchProfile();
    }
  }, [authData]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        headers: { Authorization: `Bearer ${authData.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    const formData = new FormData();
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);
    formData.append('bio', profileData.bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    if (coverFile) formData.append('cover', coverFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authData.token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Profile updated successfully', type: 'success' });
        updateAuthData(data);
      } else {
        setMsg({ text: data.message || 'Update failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMsg({ text: 'New passwords do not match', type: 'error' });
    }
    
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}` 
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Password changed successfully', type: 'success' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMsg({ text: data.message || 'Change failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="cover-photo" style={{ backgroundImage: `url(${coverFile ? URL.createObjectURL(coverFile) : (authData.coverUrl || 'https://via.placeholder.com/1200x300?text=Cover+Photo')})` }}>
          <div className="edit-cover-btn" onClick={() => coverRef.current.click()}>
            <i className="fas fa-camera"></i> Change Cover
          </div>
          <input type="file" ref={coverRef} style={{display: 'none'}} onChange={(e) => handleFileSelect(e, 'cover', 4)} accept="image/*" />
        </div>
        
        <div className="profile-header-info">
          <div className="avatar-wrapper" onClick={() => avatarRef.current.click()}>
            <img src={avatarFile ? URL.createObjectURL(avatarFile) : (authData.avatarUrl || 'https://via.placeholder.com/150')} alt="Avatar" className="profile-avatar" />
            <div className="avatar-edit-overlay"><i className="fas fa-pen"></i></div>
            <input type="file" ref={avatarRef} style={{display: 'none'}} onChange={(e) => handleFileSelect(e, 'avatar', 1)} accept="image/*" />
          </div>
          <div className="profile-title">
            <h2>{profileData.firstName} {profileData.lastName}</h2>
            <div className="profile-badges">
              <span className="badge-admin"><i className="fas fa-user-shield"></i> Admin</span>
              <span className="badge-verified"><i className="fas fa-check-circle"></i> Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-sidebar">
          <div 
            className={`profile-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => { setActiveTab('account'); setMsg({text:'', type:''}); }}
          >
            <i className="fas fa-user-circle"></i> Account Info
          </div>
          <div 
            className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => { setActiveTab('security'); setMsg({text:'', type:''}); }}
          >
            <i className="fas fa-shield-alt"></i> Security
          </div>
        </div>

        <div className="profile-content">
          {msg.text && (
            <div className={`msg-banner ${msg.type}`}>
              {msg.text}
            </div>
          )}

          {activeTab === 'account' && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <h3>Personal Information</h3>
              <p className="subtext">Your name and contact details as they appear publicly.</p>
              
              <div className="form-row-2">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} required />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+1 234 567 8900" />
              </div>

              <div className="form-group">
                <label>Professional Bio</label>
                <textarea 
                  rows="4" 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Describe your experience and specialties..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="profile-form">
              <h3>Security Settings</h3>
              <p className="subtext">Change your password to keep your account secure.</p>
              
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {cropperModal.isOpen && (
        <ImageCropper
          imageSrc={cropperModal.imageSrc}
          aspect={cropperModal.aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperModal({ isOpen: false, imageSrc: null, aspect: 1, type: null })}
        />
      )}
    </div>
  );
};

export default Profile;
