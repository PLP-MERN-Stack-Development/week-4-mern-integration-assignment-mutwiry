import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi, getMe as getMeApi, setAuthToken } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Logout user - defined before use in useEffect
  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  }, [navigate]);

  // Load user on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getMeApi();
          // The user data is in response.data or the response itself
          const userData = response.data || response;
          setUser(userData);
        }
      } catch (err) {
        console.error('Error loading user', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [logout]); // Now logout is defined before being used here

  // Register user
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await registerApi(name, email, password);
      // The user data is in response.data, not response.data.user
      const userData = response.data || response;
      setUser(userData);
      // The token is in response.token or response.data.token
      const token = response.token || (response.data && response.data.token);
      if (token) {
        setAuthToken(token);
      }
      return userData;
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginApi(email, password);
      // The user data is in response.data, not response.data.user
      const userData = response.data || response;
      setUser(userData);
      // The token is in response.token or response.data.token
      const token = response.token || (response.data && response.data.token);
      if (token) {
        setAuthToken(token);
      }
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
