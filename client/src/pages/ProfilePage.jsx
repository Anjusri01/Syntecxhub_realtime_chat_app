import React from 'react';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';

export default function ProfilePage() {
  const { username, logout } = useAuth();
  const { setCurrentLeftPane } = useChat();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button onClick={() => setCurrentLeftPane('chats')} style={{ background: 'none', border: 'none', color: '#aebac1', fontSize: '18px', cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: '16px', color: '#fff' }}>Profile</h2>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div className="avatar-fallback" style={{ width: '100px', height: '100px', fontSize: '36px' }}>{username ? username.charAt(0) : 'U'}</div>
        <div style={{ width: '100%', backgroundColor: '#202c33', padding: '16px', borderRadius: '8px' }}>
          <span style={{ color: '#00a884', fontSize: '11px' }}>Your Name</span>
          <p style={{ color: '#fff', fontSize: '16px', marginTop: '4px', fontWeight: '500' }}>{username}</p>
        </div>
        <button onClick={logout} style={{ width: '100%', backgroundColor: '#ef5350', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Logout Session
        </button>
      </div>
    </div>
  );
}

