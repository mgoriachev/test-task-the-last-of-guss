import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import './LoginPage.css';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login({ username, password });
      navigate('/');
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ВОЙТИ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};