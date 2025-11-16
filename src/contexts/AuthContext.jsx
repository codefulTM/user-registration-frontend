import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Get current user from token
  const getCurrentUser = useCallback(() => {
    try {
      const currentUser = api.getCurrentUser();
      return currentUser || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.sub,
            email: currentUser.email,
            // Add other user properties as needed
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [getCurrentUser]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      
      // Get user info from token
      const currentUser = getCurrentUser();
      setUser({
        id: currentUser.sub,
        email: currentUser.email,
        // Add other user properties as needed
      });
      
      setIsAuthenticated(true);
      
      // Redirect to home
      navigate('/home');
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      navigate('/login');
    }
  };

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.sub,
          email: currentUser.email,
          // Add other user properties as needed
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }, [getCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
