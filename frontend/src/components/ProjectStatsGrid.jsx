import React from 'react';

const ProjectStatsGrid = () => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3><i className="fas fa-paper-plane" style={{background: '#eff6ff', color: '#3b82f6'}}></i> Emails Sent</h3>
        <div className="stat-number">124,592</div>
        <div style={{fontSize: '0.75rem', color: '#10b981', marginTop: '8px'}}><i className="fas fa-arrow-up"></i> 12% this week</div>
      </div>
      
      <div className="stat-card">
        <h3><i className="fas fa-bullhorn" style={{background: '#f5f3ff', color: '#8b5cf6'}}></i> Active Campaigns</h3>
        <div className="stat-number">14</div>
        <div style={{fontSize: '0.75rem', color: '#10b981', marginTop: '8px'}}><i className="fas fa-arrow-up"></i> 3 new today</div>
      </div>
      
      <div className="stat-card">
        <h3><i className="fas fa-envelope-open-text" style={{background: '#ecfdf5', color: '#10b981'}}></i> Avg Open Rate</h3>
        <div className="stat-number">48.2%</div>
        <div style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '8px'}}><i className="fas fa-minus"></i> vs last month</div>
      </div>
      
      <div className="stat-card">
        <h3><i className="fas fa-mouse-pointer" style={{background: '#fff7ed', color: '#f97316'}}></i> Click Rate</h3>
        <div className="stat-number">12.4%</div>
        <div style={{fontSize: '0.75rem', color: '#ef4444', marginTop: '8px'}}><i className="fas fa-arrow-down"></i> 2% this week</div>
      </div>
    </div>
  );
};

export default ProjectStatsGrid;
