import { useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api/client';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [error, setError] = useState('');

  const session = useMemo(() => {
    if (!token) return null;
    const payload = jwtDecode(token);
    const role = payload.role || 'USER';
    return { username: payload.sub, role };
  }, [token]);

  const login = async (username, password) => {
    setError('');
    try {
      const { data } = await authApi.login({ username, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (e) {
      const backendMessage = e?.response?.data?.message;
      setError(backendMessage || 'No fue posible iniciar sesion. Verifica credenciales.');
      throw new Error('auth_error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    token,
    session,
    login,
    logout,
    error
  };
}
