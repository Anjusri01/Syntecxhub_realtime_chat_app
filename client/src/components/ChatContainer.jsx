import React from 'react';
import { useChat } from '../context/chatContext';
import { useAuth } from '../context/authContext';

export default function ChatContainer() {
  const { username } = useAuth();
  const { 
    selectedChat, 
    activeMessages = [], 
    messageText, 
    setMessageText, 
    handleSendMessage, 
    messageEndRef, 
    showRightSidebar, 
    setShowRightSidebar 
  } = useChat();

  if (!selectedChat) {
    return (
      <div className="main-chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8696a0' }}>Select a conversation thread to start messaging</p>
      </div>
    );
  }

  return (
    <div className="main-chat-window">
      <div className="chat-window-header" onClick={() => setShowRightSidebar(!showRightSidebar)} style={{ cursor: 'pointer' }}>
        <div className="header-user-info">
          <img src={selectedChat.avatar} alt={selectedChat.name} className="user-avatar" style={{ width: '40px', height: '40px' }} />
          <div className="header-user-meta">
            <h3>{selectedChat.name}</h3>
            <p className={selectedChat.online ? 'status-online' : ''}>{selectedChat.online ? 'online' : 'offline'}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="footer-icon-btn">🔍</button>
          <button className="footer-icon-btn">⋮</button>
        </div>
      </div>

      <div className="message-viewport">
        {activeMessages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender === username ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              {msg.sender !== username && <span className="message-sender">{msg.sender}</span>}
              <span className="message-text">{msg.text}</span>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="chat-input-footer">
        <button className="footer-icon-btn">😀</button>
        <button className="footer-icon-btn">📎</button>
        <form onSubmit={handleSendMessage} className="message-form">
          <input 
            type="text" 
            placeholder="Type a message" 
            value={messageText} 
            onChange={(e) => setMessageText(e.target.value)} 
            className="main-input-field" 
          />
          <button 
            type="submit" 
            className={`send-action-btn ${messageText.trim() ? 'active' : ''}`} 
            disabled={!messageText.trim()}
          >
            🕊️
          </button>
        </form>
      </div>
    </div>
  );
}
