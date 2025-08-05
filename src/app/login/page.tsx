"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Checkbox, Space, Divider } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationManager } from "@/utils/locationManager";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationManager = useLocationManager();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    locationManager.setCurrentLocation("/login");
    
    // If user is already authenticated, redirect them
    if (isAuthenticated) {
      const redirectTo = redirectPath || "/dashboard";
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectPath, locationManager]);

  const onSubmit = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        message.success("Login successful!");
        // AuthContext will handle the redirect
      } else {
        message.error("Invalid email or password");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Demo login function
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
        message.success(`Logged in as ${role}!`);
      }
    } catch (error) {
      message.error("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md" title="Login to Admin Panel">
        <Form
          form={form}
          onFinish={onSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider>Demo Accounts</Divider>
        
        <Space direction="vertical" className="w-full">
          <Button 
            onClick={() => handleDemoLogin('admin')}
            loading={loading}
            block
          >
            Login as Admin
          </Button>
          <Button 
            onClick={() => handleDemoLogin('editor')}
            loading={loading}
            block
          >
            Login as Editor
          </Button>
          <Button 
            onClick={() => handleDemoLogin('viewer')}
            loading={loading}
            block
          >
            Login as Viewer
          </Button>
        </Space>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p>Admin: admin@example.com / admin123</p>
          <p>Editor: editor@example.com / editor123</p>
          <p>Viewer: viewer@example.com / viewer123</p>
        </div>
      </Card>
    </div>
  );
}
