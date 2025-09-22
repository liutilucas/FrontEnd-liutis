// src/pages/LoginPage.jsx
import React from 'react';

function LoginPage() {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Acesso Restrito</h2>
        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;