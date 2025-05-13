import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, loading, logout } = useContext(AuthContext);
  return { user, loading, logout };
};