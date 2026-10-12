import React, { useState } from 'react';
import { useAuth } from '../context/authContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [nicknameInput, setNicknameInput] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (nicknameInput.trim()) login(nicknameInput);
  };

  return (
    <div className="login-overlay">
      <form onSubmit={handleLoginSubmit} className="login-card">
        <div className="login-logo">💬</div>
        <div className="login-header">
          <h1>Welcome to Q-Chat</h1>
          <p>Provide a nickname to establish a channel gateway link</p>
        </div>
        <div className="form-group">
          <label>Your Display Nickname</label>
          <input 
            type="text" 
            placeholder="e.g. ANJUSRI" 
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)} 
            className="login-input" 
            maxLength={20} 
            required 
            autoFocus
          />
        </div>
        <button type="submit" className="login-submit-btn">Enter Chat Dashboard</button>
      </form>
    </div>
  );
}
