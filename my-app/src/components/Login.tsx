import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/// src/components/Login.tsx
import { User } from '../types';

interface LoginProps {
  setUser: (user: User | null) => void;
  switchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ switchToSignUp, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const testServerConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users/test');
      setTestResult(response.data);
    } catch (error) {
      setTestResult('Failed to connect to server');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response received:', response.data);
      
      // Check if response has the expected structure
      if (response.data && response.data.user) {
        localStorage.setItem('token', response.data.token || '');
        setUser(response.data.user);
        navigate('/dashboard');
      } else {
        setError('Invalid response format from server');
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

      {/* Test Connection Button and Result */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={testServerConnection}
          disabled={isTestingConnection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTestingConnection ? 'not-allowed' : 'pointer',
            marginBottom: '10px'
          }}
        >
          {isTestingConnection ? 'Testing...' : 'Test Server Connection'}
        </button>
        {testResult && (
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: testResult.includes('Failed') ? '#ffebee' : '#e8f5e9',
            borderRadius: '4px',
            color: testResult.includes('Failed') ? 'red' : 'green'
          }}>
            {testResult}
          </div>
        )}
      </div>

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