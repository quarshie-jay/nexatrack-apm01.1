'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for existing session on mount
    const storedUser = localStorage.getItem('nexatrack_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('nexatrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Simple route protection logic
    if (isLoading) return;

    const isLoginPage = pathname === '/login';
    const isTenantRoute = pathname.startsWith('/my-') || pathname === '/transactions';
    
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
    router.push(userData.role === 'admin' ? '/dashboard' : '/my-meter');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexatrack_user');
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
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
