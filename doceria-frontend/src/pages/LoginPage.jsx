import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); 

    try {
      const success = await login(username, password);

      if (success) {
        navigate('/admin');
      } else {
        setError('Usuário ou senha inválidos.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/img/liutis-logo.png" alt="Logo Doces Liuti's" className="login-logo" />
        <h2>Acesso Restrito</h2>
        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input 
            type="text" 
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <Link to="/" className="back-link">Voltar para a loja</Link>
      </form>
    </div>
  );
}

export default LoginPage;