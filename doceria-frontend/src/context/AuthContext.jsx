import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  const login = async (username, password) => {
    const token = btoa(`${username}:${password}`); 

    try {
      const response = await fetch('https://backend-liutis-production.up.railway.app/api/produtos/login-check', {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.ok) {
        setAuth(token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      return false;
    }
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}