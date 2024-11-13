// src/screens/LoginScreen.tsx
import React, { useState, Dispatch, SetStateAction } from 'react';  // Add these imports
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import { User, LoginScreenProps } from '../types';

const LoginScreen: React.FC<LoginScreenProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);

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
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {isLogin ? (
          <Login 
            setUser={setUser} 
            switchToSignUp={() => setIsLogin(false)} 
          />
        ) : (
          <SignUp 
            switchToLogin={() => setIsLogin(true)} 
          />
        )}
      </div>
    </div>
  );
};

export default LoginScreen;