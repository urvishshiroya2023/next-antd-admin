"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/ui/display/Card";
import { notification } from "@/ui/feedback/Notification";
import { useLocationManager } from "@/utils/locationManager";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationManager = useLocationManager();
  const redirectPath = searchParams.get('redirect');

  // Handle authentication state changes
  useEffect(() => {
    locationManager.setCurrentLocation("/login");
    
    if (isAuthenticated) {
      const redirectTo = redirectPath || "/dashboard";
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectPath, locationManager]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        notification.success({
          message: "Login Successful",
          description: "You have been successfully logged in.",
        });
      } else {
        notification.error({
          message: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: "Login Error",
        description: "An error occurred during login. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setLoading(true);
    try {
      const demoCredentials = {
        admin: { email: "admin@example.com", password: "admin123" },
        editor: { email: "editor@example.com", password: "editor123" },
        viewer: { email: "viewer@example.com", password: "viewer123" },
      };
      
      const credentials = demoCredentials[role as keyof typeof demoCredentials];
      const success = await login(credentials.email, credentials.password);
      
      if (success) {
        notification.success({
          message: `Logged in as ${role}`,
          description: `You are now logged in with ${role} privileges.`,
        });
      } else {
        notification.error({
          message: "Demo Login Failed",
          description: "Failed to log in with demo credentials.",
        });
      }
    } catch (error) {
      console.error("Demo login error:", error);
      notification.error({
        message: "Login Error",
        description: "An error occurred during demo login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card 
          title={
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>
          }
          className="w-full"
        >
          <LoginForm 
            onSubmit={handleSubmit} 
            loading={loading} 
            onDemoLogin={handleDemoLogin} 
          />
        </Card>
      </div>
    </div>
  );
}
