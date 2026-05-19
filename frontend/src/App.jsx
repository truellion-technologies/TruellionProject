import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import logo from "./assets/logo.png";
import StatsGrid from './components/StatsGrid';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import AddUserModal from './components/Modals/AddUserModal';
import EditUserModal from './components/Modals/EditUserModal';
import RecentActivity from './components/RecentActivity';
import LoginModal from './components/Modals/LoginModal';
import ResetPasswordModal from './components/Modals/ResetPasswordModal';
import Profile from './components/Profile';
import ProjectStatsGrid from './components/ProjectStatsGrid';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [authData, setAuthData] = useState(() => {
    try {
      const saved = localStorage.getItem('authData');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (authData) {
      localStorage.setItem('authData', JSON.stringify(authData));
    } else {
      localStorage.removeItem('authData');
    }
  }, [authData]);
  const [resetToken, setResetToken] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('resetToken');
    if (token) {
      setResetToken(token);
    }
  }, []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addNotification = async (user, action) => {
    try {
      await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, action })
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const handleAddUser = async (name, email, type, startDate, endDate) => {
    if (!name.trim() || !email.trim()) { alert("Name & email required"); return; }
    if (startDate > endDate) { alert("Invalid dates"); return; }

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, accountStatus: type, startDate, endDate })
      });
      if (res.ok) {
        setIsAddOpen(false);
        addNotification(name, `Added (${type}) valid ${startDate} → ${endDate}`);
        fetchUsers();
        setPage(1);
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditUser = async (id, name, email, type, startDate, endDate) => {
    if (!name.trim() || !email.trim()) return;
    if (startDate > endDate) { alert("End date must be after start"); return; }

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, accountStatus: type, startDate, endDate })
      });
      if (res.ok) {
        setEditingUser(null);
        addNotification(name, "User details updated");
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, { method: 'DELETE' });
      if (res.ok) {
        addNotification(user.name, `Deleted ${user.name}`);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (user) => {
    if (!window.confirm(`Remove ${user.name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, { method: 'DELETE' });
      if (res.ok) {
        addNotification(user.name, `Removed ${user.name}`);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBan = async (user) => {
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}/ban`, { method: 'PATCH' });
      if (res.ok) {
        addNotification(user.name, user.isBanned ? `Unfrozen user` : `Frozen user`);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePlan = async (user) => {
    if (user.isBanned) { alert("Cannot change plan for banned user"); return; }
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}/plan`, { method: 'PATCH' });
      if (res.ok) {
        const old = user.accountStatus;
        const newStatus = old === "subscribed" ? "demo" : "subscribed";
        addNotification(user.name, `Plan changed: ${old} → ${newStatus}`);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering and Stats logic
  const getDefaultStart = () => new Date().toISOString().split('T')[0];
  
  const filteredUsers = useMemo(() => {
    let result = [...users];
    const today = getDefaultStart();

    if (filter === 'subscribed') {
      result = result.filter(u => !u.isBanned && u.accountStatus === 'subscribed' && u.endDate >= today);
    } else if (filter === 'demo') {
      result = result.filter(u => !u.isBanned && u.accountStatus === 'demo' && u.endDate >= today);
    } else if (filter === 'frozen') {
      result = result.filter(u => u.isBanned);
    } else if (filter === 'expiring') {
      const threeDaysLater = new Date(); 
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      const threeDaysStr = threeDaysLater.toISOString().split('T')[0];
      result = result.filter(u => !u.isBanned && u.endDate >= today && u.endDate <= threeDaysStr);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }

    return result;
  }, [users, filter, search]);

  const stats = useMemo(() => {
    const today = getDefaultStart();
    const threeDaysLater = new Date(); 
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

    return {
      total: users.length,
      subscribed: users.filter(u => !u.isBanned && u.accountStatus === 'subscribed' && u.endDate >= today).length,
      demo: users.filter(u => !u.isBanned && u.accountStatus === 'demo' && u.endDate >= today).length,
      frozen: users.filter(u => u.isBanned).length,
      expiring: users.filter(u => !u.isBanned && u.endDate >= today && u.endDate <= threeDaysStr).length,
    };
  }, [users]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (activeTab !== 'users') {
      setActiveTab('users');
    }
  };

  // Pagination bounds check
  useEffect(() => {
    const maxPage = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page > maxPage && maxPage > 0) {
      setPage(maxPage);
    }
  }, [filteredUsers.length, page]);

  if (resetToken) {
    return (
      <ResetPasswordModal 
        token={resetToken} 
        onResetSuccess={() => {
          setResetToken(null);
          window.history.replaceState({}, document.title, "/"); // clear URL param
        }} 
      />
    );
  }

  if (!authData) {
    return <LoginModal onLogin={setAuthData} />;
  }

  return (
    <div className="app-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        authData={authData} 
        onLogout={() => setAuthData(null)} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="main-panel">
        <div className="mobile-header">
          <div className="mobile-logo">
            <img src={logo} alt="Logo" style={{ height: '32px', objectFit: 'contain', marginRight: '8px' }} />
            <span className="true">True</span><span className="llion" style={{color: '#f97316'}}>llion</span>
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="dashboard-layout">
            <ProjectStatsGrid />
            <RecentActivity notifications={notifications} />
          </div>
        )}

        {activeTab === 'users' && (
          <>
            <StatsGrid stats={stats} currentFilter={filter} setFilter={handleFilterChange} />
            <div style={{ marginTop: '20px' }}></div>
            <SearchBar search={search} setSearch={setSearch} />

            <div className="section-header">
              <div className="section-title"><i className="fas fa-table-list"></i> User Directory</div>
              <button className="btn-add" onClick={() => setIsAddOpen(true)}>
                <i className="fas fa-plus-circle"></i> Add User
              </button>
            </div>

            <UserTable 
              users={filteredUsers} 
              currentPage={page} 
              setPage={setPage} 
              itemsPerPage={itemsPerPage} 
              onEdit={setEditingUser}
              onTogglePlan={handleTogglePlan}
              onDelete={handleDelete}
              onBan={handleBan}
              onRemove={handleRemove}
            />
          </>
        )}

        {activeTab === 'profile' && (
          <Profile authData={authData} updateAuthData={setAuthData} />
        )}
      </main>

      {isAddOpen && (
        <AddUserModal onClose={() => setIsAddOpen(false)} onSave={handleAddUser} />
      )}

      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleEditUser} />
      )}
    </div>
  );
}

export default App;
