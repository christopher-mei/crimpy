import React, { useState } from 'react';
import axios from 'axios';

interface SignUpProps {
  switchToLogin: () => void;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

const SignUp: React.FC<SignUpProps> = ({ switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate individual fields as user types
  const validateField = (name: string, value: string) => {
    const errors: ValidationErrors = { ...validationErrors };

    switch (name) {
      case 'username':
        if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete errors.username;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;

      case 'password':
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(value)) {
          errors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          errors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(value)) {
          errors.password = 'Password must contain at least one number';
        } else {
          delete errors.password;
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update state
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }

    // Validate field
    validateField(name, value);
  };

  const validateForm = () => {
    const usernameValid = validateField('username', username);
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);

    return usernameValid && emailValid && passwordValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      // Log before making the request
      console.log('About to make request with:', {
        url: 'http://localhost:8080/api/users',
        data: { username, password, email },
        headers: axios.defaults.headers
      });

      const response = await axios.post('http://localhost:8080/api/users', {
        username,
        password,
        email
      });
      
      // Log successful response
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.data) {
        console.log('Successfully signed up!');
        switchToLogin();
      }
    } catch (error) {
      // Log error details
      console.log('Error details:', {
        isAxiosError: axios.isAxiosError(error),
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Sign up failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
};

  const inputStyle = (hasError: boolean) => ({
    padding: '10px',
    width: '100%',
    borderRadius: '4px',
    border: `1px solid ${hasError ? 'red' : '#ddd'}`,
    boxSizing: 'border-box' as const
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
      
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
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="Username"
            required
            style={inputStyle(!!validationErrors.username)}
            disabled={isLoading}
          />
          {validationErrors.username && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
              {validationErrors.username}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={inputStyle(!!validationErrors.email)}
            disabled={isLoading}
          />
          {validationErrors.email && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
              {validationErrors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            required
            style={inputStyle(!!validationErrors.password)}
            disabled={isLoading}
          />
          {validationErrors.password && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
              {validationErrors.password}
            </div>
          )}
          <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#666' }}>
            Password must:
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>Be at least 8 characters long</li>
              <li>Contain at least one uppercase letter</li>
              <li>Contain at least one lowercase letter</li>
              <li>Contain at least one number</li>
            </ul>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading || Object.keys(validationErrors).length > 0}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading || Object.keys(validationErrors).length > 0 
              ? '#ccc' 
              : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading || Object.keys(validationErrors).length > 0 
              ? 'not-allowed' 
              : 'pointer',
            fontSize: '16px',
            marginBottom: '10px'
          }}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>

        <div style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <button
            onClick={switchToLogin}
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
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;