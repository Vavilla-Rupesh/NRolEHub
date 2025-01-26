import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { handleLoginError } from '../lib/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      const errorMessage = handleLoginError(error);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      if (userData.temp_id && userData.otp) {
        // OTP verification step - using the correct endpoint
        const response = await api.post('/auth/verifyOTP', {
          temp_id: userData.temp_id,
          otp: userData.otp.toString()
        });

        if (!response.data || !response.data.token) {
          throw new Error('Invalid response from server');
        }

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
      } else {
        // Initial registration step
        const response = await api.post('/auth/register', userData);
        if (!response.data || !response.data.temp_id) {
          throw new Error('Invalid response from server');
        }
        return response.data;
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 404) {
        throw new Error('OTP verification service is not available');
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};