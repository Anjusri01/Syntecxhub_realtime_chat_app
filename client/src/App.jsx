import React from 'react';
import { AuthProvider, useAuth } from './context/authContext';
import { ChatProvider } from './context/chatContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './App.css';

function MainRouter() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <HomePage /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainRouter />
      </ChatProvider>
    </AuthProvider>
  );
}
