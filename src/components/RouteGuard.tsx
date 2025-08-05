"use client";

import React from "react";
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Check if current route is public
  const isPublicRoute = appConfig.publicRoutes.includes(pathname);
  
  // Check if current route is private
  const isPrivateRoute = appConfig.privateRoutes.includes(pathname);

  // Allow access to public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users trying to access private routes
  if (!isAuthenticated && isPrivateRoute) {
    router.push(appConfig.routes.unauthenticatedEntryPath);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Check role-based access for authenticated users
  if (isAuthenticated && user) {
    const userRole = user.role;
    const roleBasedRoutes = appConfig.roleBasedRoutes[userRole as keyof typeof appConfig.roleBasedRoutes];
    
    // If route requires specific role and user doesn't have access
    if (roleBasedRoutes && !roleBasedRoutes.includes(pathname)) {
      // Check if it's a general private route that all authenticated users can access
      const generalPrivateRoutes = appConfig.privateRoutes.filter(route => 
        !Object.values(appConfig.roleBasedRoutes).flat().includes(route)
      );
      
      if (!generalPrivateRoutes.includes(pathname)) {
        router.push(appConfig.routes.authenticatedEntryPath);
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" />
          </div>
        );
      }
    }
  }

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
