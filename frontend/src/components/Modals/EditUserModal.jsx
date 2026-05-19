import React, { useState, useEffect } from 'react';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [type, setType] = useState(user?.accountStatus || 'subscribed');
  const [startDate, setStartDate] = useState(user?.startDate || '');
  const [endDate, setEndDate] = useState(user?.endDate || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setType(user.accountStatus);
      setStartDate(user.startDate);
      setEndDate(user.endDate);
    }
  }, [user]);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'demo' && startDate) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + 7);
      setEndDate(d.toISOString().split('T')[0]);
    }
  };

  const handleStartDateChange = (e) => {
    const newDate = e.target.value;
    setStartDate(newDate);
    if (type === 'demo' && newDate) {
      const d = new Date(newDate);
      d.setUTCDate(d.getUTCDate() + 7);
      setEndDate(d.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = () => {
    onSave(user._id, name, email, type, startDate, endDate);
  };

  if (!user) return null;

  return (
    <div className="modal" onClick={(e) => { if (e.target.className === 'modal') onClose(); }}>
      <div className="modal-content">
        <h3 style={{ color: "#f97316", marginBottom: "16px" }}><i className="fas fa-pen"></i> Edit User</h3>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        
        <div className="radio-group">
          <label>
            <input type="radio" name="editAccountType" value="subscribed" checked={type === 'subscribed'} onChange={() => handleTypeChange('subscribed')} /> Subscribed
          </label>
          <label>
            <input type="radio" name="editAccountType" value="demo" checked={type === 'demo'} onChange={() => handleTypeChange('demo')} /> 7 Days Free Demo
          </label>
        </div>
        
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Start Date</label>
            <input type="date" value={startDate} onChange={handleStartDateChange} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} style={{ background: "#f97316", color: "white" }}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
