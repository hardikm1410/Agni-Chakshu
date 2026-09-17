import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial load

  useEffect(() => {
    // Check localStorage for session
    const storedUser = localStorage.getItem('thermoscope_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error("Email and password are required."));
          return;
        }
        if (password.length < 6) {
          reject(new Error("Password must be at least 6 characters."));
          return;
        }
        
        // Mock successful login
        const loggedInUser = {
          id: 'u123',
          name: email.split('@')[0],
          email: email,
          role: 'Admin'
        };
        setUser(loggedInUser);
        localStorage.setItem('thermoscope_user', JSON.stringify(loggedInUser));
        resolve(loggedInUser);
      }, 1000); // Simulate network latency
    });
  };

  const signup = async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error("All fields are required."));
          return;
        }
        if (password.length < 6) {
          reject(new Error("Password must be at least 6 characters."));
          return;
        }

        // Mock successful signup
        const newUser = {
          id: 'u' + Math.floor(Math.random() * 10000),
          name: name,
          email: email,
          role: 'Agent'
        };
        setUser(newUser);
        localStorage.setItem('thermoscope_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thermoscope_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
