import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  role: 'ADMIN' | 'STAFF' | 'LEARNER';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);
      
      const userData: User = {
        id: data.user.id,
        role: data.user.role,
        name: data.user.name
      };

      // Store token and user
      const token = data.token;
      console.log('Storing token:', token ? 'Token exists' : 'No token');
      
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      
      console.log('Token stored in sessionStorage:', sessionStorage.getItem('token') ? 'Yes' : 'No');
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
