// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';
import { AuthContextType } from '../types';

// 1. First, create the context (must be outside and before the provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};