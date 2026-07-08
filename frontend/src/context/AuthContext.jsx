import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Set default Authorization header for all axios requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if token is still valid on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:3000/api/auth/me');
          setUser(res.data.user);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    const { access_token, refresh_token, user } = res.data.session;
    localStorage.setItem('access_token', access_token);
    setToken(access_token);
    setUser(user);
    return res;
  };

  const signup = async (email, password, name, position, team, role) => {
    const res = await axios.post('http://localhost:3000/api/auth/signup', {
      email,
      password,
      name,
      position,
      team,
      role,
    });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);