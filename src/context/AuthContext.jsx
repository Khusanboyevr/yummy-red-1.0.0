import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // In a real app, you'd verify the token with the backend here
      setAdmin({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Ortiqcha server muammolarini oldini olish uchun loginni ham local qildik
    if (username === 'gopizza' && password === 'gopizza1987') {
      const fakeToken = 'local_admin_token_' + Date.now();
      localStorage.setItem('adminToken', fakeToken);
      setAdmin({ token: fakeToken });
      return { success: true };
    } else {
      return { success: false, message: 'Login yoki parol xato!' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
