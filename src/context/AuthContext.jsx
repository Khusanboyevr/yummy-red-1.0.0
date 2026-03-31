import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null); // Mijoz (foydalanuvchi) uchun
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin check
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setAdmin({ token: adminToken });
    }

    // User check
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const loginAdmin = async (username, password) => {
    if (username === 'gopizza' && password === 'gopizza1987') {
      const fakeToken = 'local_admin_token_' + Date.now();
      localStorage.setItem('adminToken', fakeToken);
      setAdmin({ token: fakeToken });
      return { success: true };
    } else {
      return { success: false, message: 'Login yoki parol xato!' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  // User Actions
  const userRegister = (name, phone) => {
    const newUser = { name, phone, savedLocations: [] };
    localStorage.setItem('userData', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const userLogout = () => {
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateUserProfile = (locationUrl, address) => {
    if (!user) return;
    
    const updatedUser = { ...user };
    // Agar bu joylashuv hali saqlanmagan bo'lsa, qo'shamiz
    const alreadyExists = updatedUser.savedLocations.some(loc => loc.address === address || loc.url === locationUrl);
    
    if (!alreadyExists) {
      updatedUser.savedLocations.push({ url: locationUrl, address, date: new Date().toISOString() });
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      admin, login: loginAdmin, logout: logoutAdmin, 
      user, userRegister, userLogout, updateUserProfile,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
