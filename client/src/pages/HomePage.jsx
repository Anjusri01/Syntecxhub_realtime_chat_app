import React from 'react';
import { useChat } from '../context/chatContext';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import ProfilePage from './ProfilePage';

export default function HomePage() {
  const { currentLeftPane, showRightSidebar } = useChat();

  return (
    <div className="app-container">
      {currentLeftPane === 'profile' ? <ProfilePage /> : <Sidebar />}
      <ChatContainer />
      {showRightSidebar && <RightSidebar />}
    </div>
  );
}
