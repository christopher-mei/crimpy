import React, { useState, Dispatch, SetStateAction } from 'react';  // Add these imports

//import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';;
import UserService from '../services/UserService';

// Simple interface for props
interface LoginProps {
  switchToSignUp: () => void;
}

// Simpler version - no FC declaration needed
const Login = ({ switchToSignUp }: LoginProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();  // Using context here
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });
      
      if (response.data) {
        login(response.data.token, response.data.user);  // Use context's login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: '10px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

     

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px', 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginBottom: '10px'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <button
            onClick={switchToSignUp}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#1976d2',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;