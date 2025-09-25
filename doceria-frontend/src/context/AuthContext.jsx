// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// NOVO: Lemos a URL da API do nosso arquivo .env
const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // NOVO: Ao iniciar, tentamos carregar o token salvo no navegador.
  const [auth, setAuth] = useState(localStorage.getItem('authToken'));

  const login = async (username, password) => {
    // A criação do token está perfeita.
    const token = btoa(`${username}:${password}`); 

    try {
      // MUDANÇA CRÍTICA: Fazemos a chamada para um endpoint que REALMENTE é protegido.
      // O objetivo não é pegar dados, mas sim verificar se as credenciais são válidas.
      // Uma chamada para /api/admin/produtos (que exige login) ou uma rota específica
      // /api/auth/verify é o ideal. Se a chamada for bem-sucedida (status 200), o login é válido.
      const response = await fetch(`${API_URL}/api/produtos`, { // Usando a lista de produtos como teste de login
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.ok) {
        setAuth(token);
        // NOVO: Salvamos o token no localStorage para o usuário não ser deslogado.
        localStorage.setItem('authToken', token);
        return true;
      } else {
        // Se a resposta for 401 (Não Autorizado) ou outra, o login falha.
        return false;
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      return false;
    }
  };

  const logout = () => {
    setAuth(null);
    // NOVO: Removemos o token salvo ao fazer logout.
    localStorage.removeItem('authToken');
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