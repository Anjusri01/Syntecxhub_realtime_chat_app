import React from 'react';
import { useChat } from '../context/chatContext';

export default function RightSidebar() {
  const { selectedChat, setShowRightSidebar } = useChat();

  if (!selectedChat) return null;

  return (
    <div className="sidebar" style={{ width: '300px', borderLeft: '1px solid #222e35', borderRight: 'none', position: 'relative', zIndex: 50 }}>
      <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '14px', color: '#fff' }}>Contact Info</h2>
        <button onClick={() => setShowRightSidebar(false)} style={{ background: 'none', border: 'none', color: '#aebac1', fontSize: '18px', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <img src={selectedChat.avatar} alt={selectedChat.name} className="user-avatar" style={{ width: '100px', height: '100px' }} />
        <h3 style={{ color: '#fff' }}>{selectedChat.name}</h3>
        <p style={{ color: '#8696a0', fontSize: '13px' }}>{selectedChat.online ? 'Online' : 'Offline'}</p>
        <div style={{ width: '100%', marginTop: '20px', backgroundColor: '#202c33', padding: '12px', borderRadius: '8px' }}>
          <span style={{ color: '#00a884', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>About</span>
          <p style={{ color: '#e9edef', fontSize: '14px', marginTop: '4px' }}>Hey there! I am using Pulse.</p>
        </div>
      </div>
    </div>
  );
}
