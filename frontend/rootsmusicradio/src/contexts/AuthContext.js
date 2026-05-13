// src/contexts/AuthContext.js
// ✅ Corrections:
//   - Import depuis ../services/api (instance partagée avec RadioContext)
//   - useEffect consolidé en UN SEUL (suppression race condition)
//   - axios global supprimé, tout passe par l'instance api

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ UN SEUL useEffect — plus de triple initialisation ni race condition
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      // Appliquer le token sur l'instance partagée
      setToken(savedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Token invalide ou expiré : nettoyer
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // ✅ S'exécute une seule fois au montage

  // ─────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      // Mettre à jour le state ET l'instance axios
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success(`Bienvenue, ${userData.firstName || userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Échec de la connexion';
      toast.error(message);
      return { success: false, message };
    }
  };

  // ─────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────
  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success(`Bienvenue, ${newUser.firstName || newUser.username}!`);
      return { success: true, user: newUser };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Échec de l'inscription";
      toast.error(message);
      throw new Error(message);
    }
  };

  // ─────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    toast.success('Déconnecté avec succès');
  };

  const isAdmin         = () => user?.role === 'admin';
  const isAuthenticated = () => !!user && !!token;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};