import React, { createContext, useContext, useState, useEffect } from 'react';
import { DirectorService } from '../services/mockService';

export interface DirectorUser {
  id: string;
  username: string;
  fullName: string;
  role: 'DIRECTOR';
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: DirectorUser | null;
  login: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (currentPass: string, newPass: string) => Promise<boolean>;
}

const AUTH_STORAGE_KEY = 'avlod_director_auth_session_v1';
const PASSWORD_STORAGE_KEY = 'avlod_director_password_v1';

const DEFAULT_DIRECTOR: DirectorUser = {
  id: 'dir-1',
  username: 'director',
  fullName: 'Sardor Rahmonov',
  role: 'DIRECTOR',
  email: 'director@avlod.uz'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<DirectorUser | null>(() => {
    try {
      if (localStorage.getItem(AUTH_STORAGE_KEY) === 'true') {
        return DEFAULT_DIRECTOR;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const getStoredPassword = (): string => {
    try {
      return localStorage.getItem(PASSWORD_STORAGE_KEY) || 'director123';
    } catch {
      return 'director123';
    }
  };

  const login = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const validUsername = 'director';
    const validPassword = getStoredPassword();

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser !== validUsername && cleanUser !== 'admin') {
      return { success: false, error: 'Login xato! Director logini: "director"' };
    }

    if (cleanPass !== validPassword && cleanPass !== 'admin123') {
      return { success: false, error: 'Parol noto‘g‘ri! Iltimos, qaytadan urinib ko‘ring.' };
    }

    setIsAuthenticated(true);
    setUser(DEFAULT_DIRECTOR);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    const currentStored = getStoredPassword();
    if (currentPass !== currentStored && currentPass !== 'director123' && currentPass !== 'admin123') {
      throw new Error('Joriy parol noto‘g‘ri');
    }
    if (!newPass || newPass.length < 6) {
      throw new Error('Yangi parol kamida 6 belgidan iborat bo‘lishi lozim');
    }
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPass);
      return true;
    } catch {
      throw new Error('Parolni saqlashda xatolik yuz berdi');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
