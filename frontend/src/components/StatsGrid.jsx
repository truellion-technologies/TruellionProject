import React from 'react';

const StatsGrid = ({ stats, currentFilter, setFilter }) => {
  return (
    <div className="stats-grid">
      <div 
        className={`stat-card ${currentFilter === 'all' ? 'active-filter' : ''}`} 
        onClick={() => setFilter('all')}
      >
        <h3><i className="fas fa-users"></i> Total Users</h3>
        <div className="stat-number">{stats.total}</div>
      </div>
      
      <div 
        className={`stat-card ${currentFilter === 'subscribed' ? 'active-filter' : ''}`} 
        onClick={() => setFilter('subscribed')}
      >
        <h3><i className="fas fa-crown"></i> Subscribed</h3>
        <div className="stat-number">{stats.subscribed}</div>
      </div>
      
      <div 
        className={`stat-card ${currentFilter === 'demo' ? 'active-filter' : ''}`} 
        onClick={() => setFilter('demo')}
      >
        <h3><i className="fas fa-hourglass-half"></i> Demo</h3>
        <div className="stat-number">{stats.demo}</div>
      </div>
      
      <div 
        className={`stat-card ${currentFilter === 'frozen' ? 'active-filter' : ''}`} 
        onClick={() => setFilter('frozen')}
      >
        <h3><i className="fas fa-snowflake"></i> Frozen</h3>
        <div className="stat-number">{stats.frozen}</div>
      </div>
      
      <div 
        className={`stat-card ${currentFilter === 'expiring' ? 'active-filter' : ''}`} 
        onClick={() => setFilter('expiring')}
      >
        <h3><i className="fas fa-exclamation-triangle"></i> Expiring Soon</h3>
        <div className="stat-number">{stats.expiring}</div>
      </div>
    </div>
  );
};

export default StatsGrid;
