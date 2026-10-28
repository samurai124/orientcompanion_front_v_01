import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '@/api/auth';
import subscriptionsApi from '@/api/subscriptions';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Derive premium status from subscription response or role
  const checkSubscriptionStatus = useCallback(async (currentRole) => {
    if (currentRole === 'ADMIN') {
      setIsPremium(true);
      return true;
    }
    try {
      const res = await subscriptionsApi.getMySubscription();
      const active = res?.activeSubscription;
      const premium = active && active.status === 'ACTIVE' && active.plan?.code === 'PREMIUM';
      setIsPremium(Boolean(premium));
      return Boolean(premium);
    } catch {
      setIsPremium(false);
      return false;
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const me = await authApi.getMe();
        if (isMounted && me) {
          setUser(me);
          setRole(me.role);
          await checkSubscriptionStatus(me.role);
        }
      } catch (err) {
        // Token invalid or expired and refresh failed
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (isMounted) {
          setUser(null);
          setRole(null);
          setIsPremium(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    // Listen to background logout event from Axios interceptor
    const handleForceLogout = () => {
      setUser(null);
      setRole(null);
      setIsPremium(false);
      setIsLoading(false);
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:logout', handleForceLogout);
    };
  }, [checkSubscriptionStatus]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setUser(data.user);
    setRole(data.user.role);
    await checkSubscriptionStatus(data.user.role);
    return data.user;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setUser(data.user);
    setRole(data.user.role);
    await checkSubscriptionStatus(data.user.role);
    return data.user;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Continue client cleanup even if backend logout fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setRole(null);
      setIsPremium(false);
    }
  };

  const refreshSubscription = async () => {
    if (role) {
      await checkSubscriptionStatus(role);
    }
  };

  const value = {
    user,
    role,
    isPremium,
    isLoading,
    login,
    register,
    logout,
    refreshSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
