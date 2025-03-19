
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

type Role = 'driver' | 'manager' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  { id: "1", name: "John Driver", email: "driver@example.com", password: "password", role: "driver" as Role },
  { id: "2", name: "Sarah Manager", email: "manager@example.com", password: "password", role: "manager" as Role },
  { id: "3", name: "Admin User", email: "admin@example.com", password: "password", role: "admin" as Role },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          // Remove password from user object before storing
          const { password, ...userWithoutPassword } = foundUser;
          
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          toast.success(`Welcome back, ${userWithoutPassword.name}`);
          resolve(true);
        } else {
          toast.error("Invalid email or password");
          resolve(false);
        }
        
        setIsLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
