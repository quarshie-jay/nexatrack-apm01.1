'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeMeterId, setActiveMeterId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for existing session on mount
    const storedUser = localStorage.getItem('nexatrack_user');
    const storedMeter = localStorage.getItem('nexatrack_active_meter');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Migrate legacy user sessions
        if (parsedUser.meterId && !parsedUser.meterIds) {
          parsedUser.meterIds = [parsedUser.meterId];
          delete parsedUser.meterId;
          localStorage.setItem('nexatrack_user', JSON.stringify(parsedUser));
        }

        setUser(parsedUser);
        if (storedMeter) {
           setActiveMeterId(storedMeter);
        } else if (parsedUser?.meterIds?.length > 0) {
           setActiveMeterId(parsedUser.meterIds[0]);
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('nexatrack_user');
        localStorage.removeItem('nexatrack_active_meter');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Simple route protection logic
    if (isLoading) return;

    const isLoginPage = pathname === '/login';
    const isTenantRoute = pathname.startsWith('/my-') || pathname === '/transactions' || pathname === '/profile';
    
    // Allow root / to handle its own generic redirect
    if (pathname === '/') return; 

    if (!user && !isLoginPage) {
      router.replace('/login');
    } else if (user) {
      if (isLoginPage) {
        // Redirect to appropriate dashboard if already logged in
        router.replace(user.role === 'admin' ? '/dashboard' : '/my-meter');
      } else if (user.role === 'tenant' && !isTenantRoute) {
        // Prevent tenants from accessing admin routes
        router.replace('/my-meter');
      } else if (user.role === 'admin' && isTenantRoute) {
        // Prevent admins from accessing tenant routes directly
        router.replace('/dashboard');
      }
    }
  }, [user, pathname, isLoading, router]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('nexatrack_user', JSON.stringify(userData));
    if (userData?.meterIds?.length > 0) {
      setActiveMeterId(userData.meterIds[0]);
      localStorage.setItem('nexatrack_active_meter', userData.meterIds[0]);
    }
    router.push(userData.role === 'admin' ? '/dashboard' : '/my-meter');
  };

  const logout = () => {
    setUser(null);
    setActiveMeterId(null);
    localStorage.removeItem('nexatrack_user');
    localStorage.removeItem('nexatrack_active_meter');
    router.push('/login');
  };

  const switchActiveMeter = (meterId) => {
    if (user?.meterIds?.includes(meterId)) {
      setActiveMeterId(meterId);
      localStorage.setItem('nexatrack_active_meter', meterId);
    }
  };

  const value = {
    user,
    activeMeterId,
    isLoading,
    login,
    logout,
    switchActiveMeter,
    isAdmin: user?.role === 'admin',
    isTenant: user?.role === 'tenant',
  };

  // Prevent flash of content while checking auth
  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}><div className="live-dot" style={{width: 16, height: 16}}></div></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
