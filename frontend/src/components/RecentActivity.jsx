import React, { useState } from 'react';

const RecentActivity = ({ notifications }) => {
  const [showAll, setShowAll] = useState(false);
  const getTimeAgo = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const getIconClass = (action) => {
    if (action.includes('Added')) return 'green';
    if (action.includes('Deleted') || action.includes('Removed') || action.includes('Banned')) return 'orange';
    return 'blue';
  };

  const getSmallIcon = (action) => {
    if (action.includes('Added')) return <i className="fas fa-user-plus"></i>;
    if (action.includes('Deleted') || action.includes('Removed') || action.includes('Banned')) return <i className="fas fa-user-minus"></i>;
    return <i className="fas fa-user-edit"></i>;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="recent-activity-section">
      <div className="recent-activity-header">
        <h2><i className="fas fa-bolt"></i> Recent Activity</h2>
        <span className="view-all-link" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'View All'} <i className={`fas fa-arrow-${showAll ? 'up' : 'right'}`} style={{marginLeft: '4px'}}></i>
        </span>
      </div>
      
      <div className="activity-list">
        {notifications.length === 0 ? (
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>No recent activity to show.</div>
        ) : (
          (showAll ? notifications : notifications.slice(0, 5)).map(n => {
            const iconColor = getIconClass(n.action);
            return (
              <div className="activity-row" key={n._id || Math.random()}>
                <div className={`activity-icon-wrapper ${iconColor}`}>
                  {getInitials(n.user)}
                  <div className="activity-small-icon">
                    {getSmallIcon(n.action)}
                  </div>
                </div>
                
                <div className="activity-content">
                  <div className="activity-title">
                    <strong>{n.user}</strong> {n.action.replace(n.user, '').trim() || n.action}
                  </div>
                  <div className="activity-time">
                    <i className="far fa-clock"></i> {getTimeAgo(n.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
