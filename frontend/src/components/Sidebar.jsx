import React, { useState, useEffect, useRef } from 'react';
import logo from "../assets/logo.png"

const Sidebar = ({ activeTab, setActiveTab, authData, onLogout, isOpen, onClose }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const widgetRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [widgetRef]);

  const getInitials = (first, last) => {
    if (!first) return 'U';
    return (first[0] + (last ? last[0] : '')).toUpperCase();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-area">
        <img src={logo} alt="Logo" style={{ height: '42px', objectFit: 'contain', marginRight: '10px' }} />
        <div className="logo-text"><span className="true">True</span><span className="llion">llion</span></div>
        <button className="mobile-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
      </div>
      
      <nav className="nav-menu">
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="fas fa-border-all"></i> Dashboard
        </div>
        <div 
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i> Users
        </div>
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <i className="fas fa-user"></i> Profile
        </div>
      </nav>

      <div className="user-widget-container" ref={widgetRef}>
        {showDropdown && (
          <div className="user-dropdown">
            <div className="dropdown-item" onClick={() => { setActiveTab('profile'); setShowDropdown(false); }}>
              <i className="far fa-user-circle"></i> View Profile
            </div>
            <div className="dropdown-item logout" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </div>
          </div>
        )}
        <div className="user-widget" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="user-avatar" style={{ backgroundImage: `url(${authData?.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {!authData?.avatarUrl && getInitials(authData?.firstName, authData?.lastName)}
          </div>
          <div className="user-info">
            <div className="user-name">{authData?.firstName} {authData?.lastName}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

