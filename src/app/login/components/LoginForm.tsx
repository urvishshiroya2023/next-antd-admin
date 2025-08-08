"use client";

import { Button } from "@/ui/actions/Button";
import { Checkbox } from "@/ui/form/Checkbox";
import { Form } from "@/ui/form/Form";
import { Input } from "@/ui/form/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Mail } from "lucide-react";
import React from "react";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  remember: yup.boolean().optional(),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  onDemoLogin: (role: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  onDemoLogin,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  return (
    <div className="space-y-6">
      <Form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
        <div className="space-y-4">
          <Input
            name="email"
            control={control}
            label="Email Address"
            placeholder="Enter your email"
            error={errors.email}
            autoComplete="username"
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          />

          <Input
            name="password"
            control={control}
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password}
            autoComplete="current-password"
            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          />

          <div className="flex items-center justify-between">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="text-sm text-gray-700"
                >
                  Remember me
                </Checkbox>
              )}
            />

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button
              htmlType="submit"
              fullWidth
              loading={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </Button>
          </div>
        </div>
      </Form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {["admin", "editor", "viewer"].map((role) => (
            <div key={role}>
              <Button
                htmlType="button"
                variant="outlined"
                fullWidth
                loading={loading}
                onClick={() => onDemoLogin(role)}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Demo Credentials:</p>
        <p>Admin: admin@example.com / admin123</p>
        <p>Editor: editor@example.com / editor123</p>
        <p>Viewer: viewer@example.com / viewer123</p>
      </div>
    </div>
  );
};
