import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app start without flashing login or admin UI
  useEffect(() => {
    async function restoreSession() {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const { data } = await authApi.getMe();
          setUser(data);
        } catch (error) {
          console.warn('Session restoration failed:', error.message);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      }
      setLoading(false);
    }

    restoreSession();
  }, []);

  const login = async (username, password) => {
    const { data } = await authApi.login({ username, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await authApi.logout(refresh);
      } catch (e) {
        // Silent fail on blacklist failure during logout
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const isOwner = Boolean(user && user.is_superuser);

  return (
    <AuthContext.Provider value={{ user, isOwner, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
