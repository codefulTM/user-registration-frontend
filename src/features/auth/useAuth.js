import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export function useRegister() {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (userData) => api.register(userData),
    onSuccess: () => {
      // Redirect to login on successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' },
        replace: true 
      });
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (credentials) => api.login(credentials),
    onSuccess: (data) => {
      // Store user data if needed (e.g., in context or local storage)
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect to dashboard on successful login
      navigate('/dashboard', { replace: true });
    },
  });
}
