import React, { useState } from 'react';
import { AuthUser } from '../types/event';
import './LoginComponent.css';

interface LoginComponentProps {
  onLogin: (user: AuthUser) => void;
  onClose?: () => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for authentication
    setTimeout(() => {
      if (username === 'hacker' && password === 'htn2026') {
        onLogin({
          username,
          isAuthenticated: true,
        });
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleDemoLogin = () => {
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      onLogin({
        username: 'hacker',
        isAuthenticated: true,
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {onClose && (
          <button
            type="button"
            className="login-close"
            onClick={onClose}
            aria-label="Close login"
          >
            ×
          </button>
        )}
        <div className="login-header">
          <h1>Hack the North 2026</h1>
          <p>Events Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              aria-label="Username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-label="Password"
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="demo-section">
          <p>or</p>
          <button
            type="button"
            className="demo-button"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            Try demo account
          </button>
        </div>
      </div>
    </div>
  );
};
