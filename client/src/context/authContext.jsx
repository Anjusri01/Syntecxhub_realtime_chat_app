import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pulse_chat_user');
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (name) => {
    if (!name.trim()) return false;
    localStorage.setItem('pulse_chat_user', name.trim());
    setUsername(name.trim());
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('pulse_chat_user');
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ username, isLoggedIn, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
