// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Login from '../components/Login';
import SignUp from '../components/SignUp';

import UserService from '../services/UserService.ts';



const LoginScreen = () => {
 
  const [isLogin, setIsLogin] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState('');

  const testServerConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await UserService.testServerConnection();
      console.log('Test response:', response); // Debug log
      setTestResult(response.message || 'Test successful');
    } catch (error) {
      console.error('Connection error:', error);
      setTestResult('Failed to connect to server');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        {/* Connection Testing UI */}
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

        {/* Auth Components */}
        {isLogin ? (
          <Login switchToSignUp={() => setIsLogin(false)} />
        ) : (
          <SignUp switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default LoginScreen;