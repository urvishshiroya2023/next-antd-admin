"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { appConfig } from "@/config/app.config";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Skip if still loading
    if (isLoading) return;

    // Check if current route is public
    const isPublicRoute = appConfig.publicRoutes.some(route => 
      pathname === route || (route.endsWith('*') && pathname.startsWith(route.slice(0, -1)))
    );
    
    // Allow access to public routes
    if (isPublicRoute) {
      setIsAuthorized(true);
      return;
    }

    // Check if current route is private (including wildcard matches)
    const isPrivateRoute = appConfig.privateRoutes.some(route => {
      // Exact match
      if (route === pathname) return true;
      
      // Wildcard match (e.g., /settings/master-data/*)
      if (route.endsWith('*')) {
        const basePath = route.slice(0, -1);
        return pathname.startsWith(basePath);
      }
      
      return false;
    });

    // Redirect unauthenticated users trying to access private routes
    if (!isAuthenticated) {
      if (isPrivateRoute) {
        router.push(appConfig.routes.unauthenticatedEntryPath);
      } else {
        // If not a private route and not authenticated, allow access
        setIsAuthorized(true);
      }
      return;
    }

    // For authenticated users, check role-based access
    if (isAuthenticated && user) {
      const userRole = user.role;
      const roleBasedRoutes = appConfig.roleBasedRoutes[userRole as keyof typeof appConfig.roleBasedRoutes] || [];
      
      // Check if user has access to this route through role-based routes
      const hasRoleBasedAccess = roleBasedRoutes.some(route => {
        // Exact match
        if (route === pathname) return true;
        
        // Wildcard match
        if (route.endsWith('*')) {
          const basePath = route.slice(0, -1);
          return pathname.startsWith(basePath);
        }
        
        return false;
      });
      
      // If user has role-based access, allow
      if (hasRoleBasedAccess) {
        setIsAuthorized(true);
        return;
      }
      
      // Check if it's a general private route that all authenticated users can access
      const generalPrivateRoutes = appConfig.privateRoutes.filter(route => 
        !Object.values(appConfig.roleBasedRoutes).flat().some(r => r === route || r.endsWith('*'))
      );
      
      const hasGeneralAccess = generalPrivateRoutes.some(route => {
        if (route === pathname) return true;
        if (route.endsWith('*')) {
          const basePath = route.slice(0, -1);
          return pathname.startsWith(basePath);
        }
        return false;
      });
      
      if (hasGeneralAccess) {
        setIsAuthorized(true);
        return;
      }
      
      // If we get here and it's a private route but no access, redirect
      if (isPrivateRoute) {
        router.push(appConfig.routes.authenticatedEntryPath);
        return;
      }
      
      // If it's not a private route, allow access
      setIsAuthorized(true);
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // On initial render, show nothing to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  // Show loading spinner while checking authentication and authorization
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // If not authorized but we've already handled the redirect in the effect
  if (!isAuthorized) {
    // Show a brief loading state to allow the redirect to happen
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Finally, render the children when authorized
  return <>{children}</>;
}

// Higher-order component for protecting specific routes
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiresAuth?: boolean;
    allowedRoles?: string[];
    redirectTo?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" />
        </div>
      );
    }

    // Check authentication requirement
    if (options?.requiresAuth && !isAuthenticated) {
      router.push(options.redirectTo || appConfig.routes.unauthenticatedEntryPath);
      return null;
    }

    // Check role-based access
    if (options?.allowedRoles && user) {
      if (!options.allowedRoles.includes(user.role)) {
        router.push(appConfig.routes.authenticatedEntryPath);
        return null;
      }
    }

    return <Component {...props} />;
  };
}
