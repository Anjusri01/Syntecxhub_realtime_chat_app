import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';

export default function Sidebar() {
  const { username } = useAuth();
  const { chats, selectedChat, selectChatThread, setCurrentLeftPane } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = (chats || []).filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="profile-section">
          <div className="avatar-fallback" onClick={() => setCurrentLeftPane('profile')} style={{ cursor: 'pointer' }}>
            {username ? username.charAt(0) : 'U'}
          </div>
          <div className="profile-info">
            <h2>{username || 'User'}</h2>
            <p className="status-online">● <span style={{ color: '#8696a0' }}>Online</span></p>
          </div>
        </div>
        <div className="header-actions">
          <button>💬</button>
          <button>⋮</button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search or start a new chat" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="chat-list">
        {filteredChats.map((chat) => {
          const isActive = selectedChat && chat.id === selectedChat.id;
          return (
            <div 
              key={chat.id}
              onClick={() => selectChatThread(chat)}
              className={`chat-row ${isActive ? 'active' : ''}`}
            >
              <div className="avatar-container">
                <img src={chat.avatar} alt={chat.name} className="user-avatar" />
                {chat.online && <div className="badge-online" />}
              </div>
              <div className="chat-details">
                <div className="chat-row-header">
                  <h3 className="chat-name">{chat.name}</h3>
                  <span className={`chat-time ${chat.unread > 0 ? 'unread-msg' : ''}`}>{chat.time}</span>
                </div>
                <div className="chat-row-meta">
                  <p className="chat-snippet">{chat.lastMessage}</p>
                  {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
