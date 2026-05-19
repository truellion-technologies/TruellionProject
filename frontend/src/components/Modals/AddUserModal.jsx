import React, { useState } from 'react';

const AddUserModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('subscribed');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    onSave(name, email, type, startDate, endDate);
  };

  return (
    <div className="modal" onClick={(e) => { if (e.target.className === 'modal') onClose(); }}>
      <div className="modal-content">
        <h3 style={{ color: "#f97316", marginBottom: "16px" }}><i className="fas fa-user-plus"></i> Create User</h3>
        <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        
        <div className="radio-group">
          <label>
            <input type="radio" name="addAccountType" value="subscribed" checked={type === 'subscribed'} onChange={() => handleTypeChange('subscribed')} /> Subscribed
          </label>
          <label>
            <input type="radio" name="addAccountType" value="demo" checked={type === 'demo'} onChange={() => handleTypeChange('demo')} /> 7 Days Free Demo
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
        <div className="info-note">Demo auto-sets 7 days from selected start date</div>
        
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} style={{ background: "#f97316", color: "white" }}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
