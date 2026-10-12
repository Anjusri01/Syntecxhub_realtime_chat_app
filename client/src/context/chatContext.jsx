import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './authContext';

const ChatContext = createContext(null);

const INITIAL_CHATS = [
  { id: '1', name: 'Nanna', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVozFvSHbD9CZpO2xO1j1i-jch0s-9M0T9cZ2wDNMQqg&s', lastMessage: 'Hey! ', time: '11:42 AM', unread: 2, online: true },
  { id: '2', name: 'Sathvik', avatar: 'data:image/jpeg;base64,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', lastMessage: 'hloo', time: '1:15 PM', unread: 0, online: true },
  { id: '3', name: 'Amma ❤️', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMCgopVS1jI3cp1r-4ZcWXFafYkZpGaMrUkIGb60w1Cg&s=10', lastMessage: 'hlo', time: 'Yesterday', unread: 0, online: false },
  { id: '4', name: 'Sonu', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEbkDLC81--zeOPP_UvfsvuQWyJCEeVuz8AntN7hOWzQ&s=10', lastMessage: 'anju:hi', time: 'Oct 10', unread: 5, online: true },
];

export function ChatProvider({ children }) {
  const { username, isLoggedIn } = useAuth();
  
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState(INITIAL_CHATS[0]);
  const [messageText, setMessageText] = useState('');
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [currentLeftPane, setCurrentLeftPane] = useState('chats'); 
  
  const [conversations, setConversations] = useState({
    '1': [{ id: 'm1', sender: 'Nanna', text: 'Hey! Are we still meeting today?', time: '11:42 AM', self: false }],
    '2': [{ id: 'm2', sender: 'Sathvik', text: 'The server deployment looks stable now.', time: '1:15 PM', self: false }],
    '3': [{ id: 'm3', sender: 'Amma❤️', text: 'Remember to buy groceries on your way back!', time: 'Yesterday', self: false }],
    '4': [{ id: 'm4', sender: 'Sonu', text: 'Check out the new UI updates.', time: 'Oct 10', self: false }]
  });

  const socketRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || !username) return;

    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('register_user', { username });

    socketRef.current.on('receive_direct_message', (payload) => {
      const { senderId, text, senderName } = payload;
      
      setConversations(prev => {
        const currentMessages = prev[senderId] || [];
        return {
          ...prev,
          [senderId]: [
            ...currentMessages,
            {
              id: Date.now().toString(),
              sender: senderName,
              text: text,
              time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
              self: false
            }
          ]
        };
      });

      setChats(prevChats => 
        prevChats.map(c => c.id === senderId ? { ...c, lastMessage: text, time: 'Just Now', unread: selectedChat.id === senderId ? 0 : c.unread + 1 } : c)
      );
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isLoggedIn, username, selectedChat.id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedChat.id]);

  const selectChatThread = (chat) => {
    setSelectedChat(chat);
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socketRef.current) return;

    const timestamp = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    
    const messagePayload = {
      receiverId: selectedChat.id,
      text: messageText,
      senderName: username
    };

    socketRef.current.emit('send_direct_message', messagePayload);

    setConversations(prev => {
      const currentMessages = prev[selectedChat.id] || [];
      return {
        ...prev,
        [selectedChat.id]: [
          ...currentMessages,
          {
            id: Date.now().toString(),
            sender: username,
            text: messageText,
            time: timestamp,
            self: true
          }
        ]
      };
    });

    setChats(prevChats => 
      prevChats.map(c => c.id === selectedChat.id ? { ...c, lastMessage: messageText, time: 'Just Now' } : c)
    );

    setMessageText('');
  };

  const value = {
    chats,
    selectedChat,
    messageText,
    setMessageText,
    activeMessages: conversations[selectedChat.id] || [],
    messageEndRef,
    showRightSidebar,
    setShowRightSidebar,
    currentLeftPane,       
    setCurrentLeftPane,   
    selectChatThread,
    handleSendMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider.');
  }
  return context;
}
