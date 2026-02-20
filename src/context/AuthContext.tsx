import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles
export type UserRole = 'admin' | 'employee' | null;

// User interface
export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName?: string;
  email?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('flexdon_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('flexdon_user');
      }
    }
  }, []);

  // Login function
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Mock authentication - replace with actual API call in production
      // For demo purposes, accept any credentials
      if (username && password && role) {
        const newUser: User = {
          id: `${role}_${Date.now()}`,
          username,
          role,
          fullName: username.charAt(0).toUpperCase() + username.slice(1),
          email: `${username}@flexdongym.com`,
        };

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('flexdon_user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('flexdon_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    role: user?.role || null,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
