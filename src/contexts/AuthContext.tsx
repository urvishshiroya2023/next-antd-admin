"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { appConfig } from "@/config/app.config";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(appConfig.auth.tokenKey);
        const userData = localStorage.getItem(appConfig.auth.userKey);

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem(appConfig.auth.tokenKey);
        localStorage.removeItem(appConfig.auth.userKey);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle route protection and redirects
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = appConfig.publicRoutes.includes(pathname);
    const isPrivateRoute = appConfig.privateRoutes.includes(pathname);

    // Save current location for redirect after login
    if (appConfig.location.enableLocationTracking && !isPublicRoute) {
      localStorage.setItem(appConfig.location.locationStorageKey, pathname);
    }

    // Redirect logic
    if (!isAuthenticated && isPrivateRoute) {
      // User not authenticated but trying to access private route
      router.push(appConfig.routes.unauthenticatedEntryPath);
    } else if (isAuthenticated && pathname === appConfig.routes.unauthenticatedEntryPath) {
      // User authenticated but on login page
      const savedRoute = localStorage.getItem(appConfig.location.locationStorageKey);
      const redirectTo = savedRoute && appConfig.privateRoutes.includes(savedRoute) 
        ? savedRoute 
        : appConfig.routes.authenticatedEntryPath;
      router.push(redirectTo);
    }
  }, [isAuthenticated, pathname, isLoading, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock login - replace with actual API call
      const response = await fetch(`${appConfig.api.baseUrl}${appConfig.api.endpoints.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user: userData } = data;

        // Store auth data
        localStorage.setItem(appConfig.auth.tokenKey, token);
        localStorage.setItem(appConfig.auth.userKey, JSON.stringify(userData));
        
        setUser(userData);

        // Redirect to saved location or default
        if (appConfig.location.redirectAfterLogin) {
          const savedRoute = localStorage.getItem(appConfig.location.locationStorageKey);
          const redirectTo = savedRoute && appConfig.privateRoutes.includes(savedRoute)
            ? savedRoute
            : appConfig.routes.authenticatedEntryPath;
          
          // Clear saved route
          localStorage.removeItem(appConfig.location.locationStorageKey);
          router.push(redirectTo);
        }

        return true;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem(appConfig.auth.tokenKey);
    localStorage.removeItem(appConfig.auth.userKey);
    localStorage.removeItem(appConfig.auth.refreshTokenKey);
    localStorage.removeItem(appConfig.location.locationStorageKey);
    
    setUser(null);
    router.push(appConfig.routes.unauthenticatedEntryPath);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(appConfig.auth.userKey, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
