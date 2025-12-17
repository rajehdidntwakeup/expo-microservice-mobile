import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  isAdmin: boolean;
  login: (user: string, admin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = await storage.getToken();
      const storedUsername = await storage.getUsername();
      const adminStatus = await storage.getIsAdmin();

      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setIsAdmin(adminStatus);
      }
    };

    checkAuth();
  }, []);

  const login = (user: string, admin: boolean) => {
    setUsername(user);
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };

  const logout = async () => {
    await storage.clearAll();
    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
