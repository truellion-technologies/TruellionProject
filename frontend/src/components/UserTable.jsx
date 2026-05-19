import React from 'react';
import Pagination from './Pagination';

const UserTable = ({ 
  users, 
  currentPage, 
  setPage, 
  itemsPerPage, 
  onEdit, 
  onTogglePlan, 
  onDelete, 
  onBan, 
  onRemove 
}) => {
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageUsers = users.slice(start, start + itemsPerPage);

  const getUserDisplayStatus = (user) => {
    if (user.isBanned) return { type: "frozen", label: "Frozen", icon: "fas fa-snowflake" };
    const today = new Date().toISOString().split('T')[0];
    const endDate = user.endDate;
    if (endDate < today) return { type: "expired", label: "Expired", icon: "fas fa-calendar-times" };
    
    const threeDaysLater = new Date(); 
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const threeDaysStr = threeDaysLater.toISOString().split('T')[0];
    
    if (endDate <= threeDaysStr && endDate >= today) return { type: "expiring-soon", label: "Expiring Soon", icon: "fas fa-hourglass-end" };
    
    if (user.accountStatus === "subscribed") return { type: "subscribed", label: "Subscribed", icon: "fas fa-check-circle" };
    return { type: "demo", label: "Demo", icon: "fas fa-hourglass-start" };
  };

  return (
    <div className="users-section">
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Access Period</th>
              <th>Validity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageUsers.length === 0 ? (
              <tr className="empty-row"><td colSpan="6">✨ No users found ✨</td></tr>
            ) : (
              pageUsers.map(user => {
                const display = getUserDisplayStatus(user);
                const durationText = `${user.startDate} → ${user.endDate}`;
                let validityText = "";
                if (user.isBanned) validityText = "Account Frozen";
                else if (display.type === "expired") validityText = "Access Expired";
                else if (display.type === "expiring-soon") validityText = `Ends ${user.endDate} (≤3 days)`;
                else validityText = `Active until ${user.endDate}`;

                return (
                  <tr key={user._id || Math.random()}>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge ${display.type}`}>
                        <i className={display.icon}></i> {display.label}
                      </span>
                    </td>
                    <td>
                      <span className="duration-badge">
                        <i className="far fa-calendar-alt"></i> {durationText}
                      </span>
                    </td>
                    <td><span className="badge-light">{validityText}</span></td>
                    <td className="action-buttons">
                      <button className="btn-icon btn-edit" title="Edit" onClick={() => onEdit(user)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon btn-toggle" title="Switch Plan" onClick={() => onTogglePlan(user)}>
                        <i className="fas fa-exchange-alt"></i>
                      </button>
                      <button className="btn-icon btn-delete" title="Delete" onClick={() => onDelete(user)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button className="btn-icon btn-remove" title={user.isBanned ? 'Unfreeze' : 'Freeze'} onClick={() => onBan(user)}>
                        <i className="fas fa-user-minus"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default UserTable;
