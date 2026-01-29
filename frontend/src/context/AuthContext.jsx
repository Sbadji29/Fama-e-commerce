import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('fama-token');
    if (token) {
        // Optional: Verify token with backend
        fetch('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.ok) setIsAuthenticated(true);
            else logout();
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('fama-token', data.token);
            setIsAuthenticated(true);
            setUser(data);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('fama-token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
